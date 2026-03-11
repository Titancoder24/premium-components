import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'
import {
  searchManifests,
  getManifestById,
  getManifestsByCategory,
  manifests,
} from './manifests.js'

const server = new Server(
  {
    name: 'premiumui-mcp-server',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  },
)

// ─── Tool Definitions ───────────────────────────────────────

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'search_components',
      description:
        'Search the Premium UI component library by natural language query. Returns ranked component matches with relevance scores. Use this to find components for building dashboards, forms, AI interfaces, e-commerce pages, and more.',
      inputSchema: {
        type: 'object' as const,
        properties: {
          query: {
            type: 'string',
            description:
              'Natural language description of what you need, e.g. "dashboard with KPI cards" or "payment form with card preview"',
          },
          maxResults: {
            type: 'number',
            description: 'Maximum results to return (default 10)',
          },
        },
        required: ['query'],
      },
    },
    {
      name: 'get_component_details',
      description:
        'Get the complete specification of a component by its ID. Returns full TypeScript interface, variants, animation details, composition suggestions, and usage examples.',
      inputSchema: {
        type: 'object' as const,
        properties: {
          componentId: {
            type: 'string',
            description:
              'Component ID like "dashboard.kpi-stat-card" or "ai.chat-interface"',
          },
        },
        required: ['componentId'],
      },
    },
    {
      name: 'get_components_by_category',
      description:
        'List all components in a category. Categories: Dashboard & Analytics, Data Tables & Lists, Forms & Inputs, Navigation & Layout, Feedback & Overlays, Cards & Content, AI & LLM Patterns, E-Commerce, Authentication & Onboarding, Utility & System.',
      inputSchema: {
        type: 'object' as const,
        properties: {
          category: {
            type: 'string',
            description: 'Category name',
          },
        },
        required: ['category'],
      },
    },
    {
      name: 'suggest_composition',
      description:
        'Given a page description, suggest which components to use and how to compose them together. Returns a recommended component list with layout guidance.',
      inputSchema: {
        type: 'object' as const,
        properties: {
          pageDescription: {
            type: 'string',
            description:
              'Description of the page you want to build, e.g. "admin dashboard with metrics, charts, and activity feed"',
          },
        },
        required: ['pageDescription'],
      },
    },
    {
      name: 'list_all_components',
      description:
        'List all available components in the library with their IDs, names, and categories.',
      inputSchema: {
        type: 'object' as const,
        properties: {},
      },
    },
    {
      name: 'get_theme_info',
      description:
        'Get information about the 55 available themes including color families and how to apply them.',
      inputSchema: {
        type: 'object' as const,
        properties: {
          family: {
            type: 'string',
            description:
              'Optional: filter by theme family (blue, green, teal, purple, red, orange, yellow, neutral, specialty)',
          },
        },
      },
    },
  ],
}))

// ─── Tool Handlers ──────────────────────────────────────────

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params

  switch (name) {
    case 'search_components': {
      const query = (args as Record<string, unknown>).query as string
      const maxResults = ((args as Record<string, unknown>).maxResults as number) || 10
      const results = searchManifests(query, maxResults)

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(
              {
                query,
                resultCount: results.length,
                results: results.map((r) => ({
                  id: r.id,
                  name: r.name,
                  category: r.category,
                  description: r.description,
                  relevance: Math.round(r.relevance * 100) / 100,
                  importPath: r.importPath,
                })),
              },
              null,
              2,
            ),
          },
        ],
      }
    }

    case 'get_component_details': {
      const componentId = (args as Record<string, unknown>).componentId as string
      const manifest = getManifestById(componentId)

      if (!manifest) {
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify({
                error: `Component "${componentId}" not found`,
                availableIds: manifests.map((m) => m.id),
              }),
            },
          ],
        }
      }

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(manifest, null, 2),
          },
        ],
      }
    }

    case 'get_components_by_category': {
      const category = (args as Record<string, unknown>).category as string
      const results = getManifestsByCategory(category)

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(
              {
                category,
                count: results.length,
                components: results.map((r) => ({
                  id: r.id,
                  name: r.name,
                  description: r.description,
                })),
              },
              null,
              2,
            ),
          },
        ],
      }
    }

    case 'suggest_composition': {
      const pageDescription = (args as Record<string, unknown>).pageDescription as string
      const allResults = searchManifests(pageDescription, 20)

      // Group by category for layout suggestions
      const byCategory = new Map<string, typeof allResults>()
      for (const result of allResults) {
        const cat = result.category
        if (!byCategory.has(cat)) {
          byCategory.set(cat, [])
        }
        byCategory.get(cat)?.push(result)
      }

      const suggestions = allResults.slice(0, 8).map((r) => ({
        id: r.id,
        name: r.name,
        reason: r.description.split('.')[0],
        composedWith: r.composedWith,
        example: r.example,
      }))

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(
              {
                pageDescription,
                suggestedComponents: suggestions,
                layoutGuidance:
                  'Use DashboardShell as the outer wrapper. Place KPI cards in a KPI Grid at the top. Charts go below in a 2-column grid. Activity feeds and tables go in the main content area.',
                importExample: `import { ${suggestions.map((s) => s.name.replace(/\s+/g, '')).join(', ')} } from '@premiumui/core'`,
              },
              null,
              2,
            ),
          },
        ],
      }
    }

    case 'list_all_components': {
      const categories = new Map<string, { id: string; name: string }[]>()
      for (const m of manifests) {
        if (!categories.has(m.category)) {
          categories.set(m.category, [])
        }
        categories.get(m.category)?.push({ id: m.id, name: m.name })
      }

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(
              {
                totalComponents: manifests.length,
                categories: Object.fromEntries(categories),
              },
              null,
              2,
            ),
          },
        ],
      }
    }

    case 'get_theme_info': {
      const family = (args as Record<string, unknown>).family as string | undefined
      const themeData = {
        blue: ['ocean', 'sky', 'cobalt', 'sapphire', 'steel', 'arctic'],
        green: ['forest', 'mint', 'sage', 'emerald', 'lime', 'pine'],
        teal: ['teal', 'cyan', 'aqua', 'turquoise', 'verdigris'],
        purple: ['violet', 'lavender', 'grape', 'amethyst', 'plum', 'indigo'],
        red: ['rose', 'crimson', 'coral', 'ruby', 'blush', 'cherry'],
        orange: ['amber', 'tangerine', 'peach', 'copper', 'honey'],
        yellow: ['gold', 'sunflower', 'canary', 'saffron'],
        neutral: ['slate', 'zinc', 'stone', 'graphite', 'silver', 'charcoal'],
        specialty: [
          'neon', 'synthwave', 'sunset', 'aurora', 'monochrome',
          'earth', 'midnight', 'frost', 'sand', 'terminal', 'paper',
        ],
      }

      const filtered = family
        ? { [family]: themeData[family as keyof typeof themeData] }
        : themeData

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(
              {
                totalThemes: 55,
                modesPerTheme: 2,
                totalConfigurations: 110,
                families: filtered,
                usage: {
                  html: '<html data-theme="ocean" class="dark">',
                  react: 'const { setTheme, setMode } = useTheme()\nsetTheme("ocean")\nsetMode("dark")',
                  css: 'All colors use CSS custom properties: bg-primary, text-foreground, etc.',
                },
              },
              null,
              2,
            ),
          },
        ],
      }
    }

    default:
      return {
        content: [
          {
            type: 'text' as const,
            text: `Unknown tool: ${name}`,
          },
        ],
      }
  }
})

// ─── Start Server ───────────────────────────────────────────

async function main(): Promise<void> {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('Premium UI MCP Server running on stdio')
}

main().catch(console.error)
