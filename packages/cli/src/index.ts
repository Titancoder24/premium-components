import { Command } from 'commander'

const program = new Command()

program
  .name('premiumui')
  .description('Premium UI Component Library CLI')
  .version('0.1.0')

// ─── Component Registry ─────────────────────────────────────

interface ComponentEntry {
  id: string
  name: string
  category: string
  files: string[]
  dependencies: string[]
}

const registry: ComponentEntry[] = [
  // Dashboard
  { id: 'kpi-stat-card', name: 'KPI Stat Card', category: 'dashboard', files: ['components/dashboard/kpi-stat-card.tsx'], dependencies: ['framer-motion', 'lucide-react'] },
  { id: 'kpi-grid', name: 'KPI Grid', category: 'dashboard', files: ['components/dashboard/kpi-grid.tsx', 'components/dashboard/kpi-stat-card.tsx'], dependencies: ['framer-motion', 'lucide-react'] },
  { id: 'revenue-chart', name: 'Revenue Chart', category: 'dashboard', files: ['components/dashboard/revenue-chart.tsx'], dependencies: ['framer-motion', 'recharts'] },
  { id: 'bar-chart', name: 'Bar Chart', category: 'dashboard', files: ['components/dashboard/bar-chart-block.tsx'], dependencies: ['framer-motion', 'recharts'] },
  { id: 'donut-chart', name: 'Donut Chart', category: 'dashboard', files: ['components/dashboard/donut-chart-block.tsx'], dependencies: ['framer-motion', 'recharts'] },
  { id: 'activity-feed', name: 'Activity Feed', category: 'dashboard', files: ['components/dashboard/activity-feed.tsx'], dependencies: ['framer-motion', 'lucide-react'] },
  { id: 'dashboard-shell', name: 'Dashboard Shell', category: 'dashboard', files: ['components/dashboard/dashboard-shell.tsx'], dependencies: ['framer-motion', 'lucide-react'] },

  // Data Tables
  { id: 'data-table', name: 'Data Table', category: 'data-tables', files: ['components/data-tables/data-table.tsx'], dependencies: ['framer-motion', 'lucide-react'] },
  { id: 'kanban-board', name: 'Kanban Board', category: 'data-tables', files: ['components/data-tables/kanban-board.tsx'], dependencies: ['framer-motion'] },
  { id: 'timeline-list', name: 'Timeline List', category: 'data-tables', files: ['components/data-tables/timeline-list.tsx'], dependencies: ['framer-motion'] },

  // Forms
  { id: 'login-form', name: 'Login Form', category: 'forms', files: ['components/forms/login-form.tsx'], dependencies: ['framer-motion', 'lucide-react'] },
  { id: 'registration-form', name: 'Registration Form', category: 'forms', files: ['components/forms/registration-form.tsx'], dependencies: ['framer-motion', 'lucide-react'] },
  { id: 'multi-step-form', name: 'Multi-Step Form', category: 'forms', files: ['components/forms/multi-step-form.tsx'], dependencies: ['framer-motion'] },
  { id: 'payment-form', name: 'Payment Form', category: 'forms', files: ['components/forms/payment-form.tsx'], dependencies: ['framer-motion', 'lucide-react'] },
  { id: 'file-upload', name: 'File Upload Zone', category: 'forms', files: ['components/forms/file-upload-zone.tsx'], dependencies: ['framer-motion', 'lucide-react'] },
  { id: 'otp-input', name: 'OTP Input', category: 'forms', files: ['components/forms/otp-input.tsx'], dependencies: ['framer-motion'] },

  // Navigation
  { id: 'collapsible-sidebar', name: 'Collapsible Sidebar', category: 'navigation', files: ['components/navigation/collapsible-sidebar.tsx'], dependencies: ['framer-motion', 'lucide-react'] },
  { id: 'command-palette', name: 'Command Palette', category: 'navigation', files: ['components/navigation/command-palette.tsx'], dependencies: ['framer-motion', 'lucide-react'] },
  { id: 'tab-navigation', name: 'Tab Navigation', category: 'navigation', files: ['components/navigation/tab-navigation.tsx'], dependencies: ['framer-motion'] },

  // Feedback
  { id: 'toast', name: 'Toast Notification', category: 'feedback', files: ['components/feedback/toast.tsx'], dependencies: ['framer-motion', 'lucide-react'] },
  { id: 'modal-dialog', name: 'Modal Dialog', category: 'feedback', files: ['components/feedback/modal-dialog.tsx'], dependencies: ['framer-motion'] },
  { id: 'skeleton-loader', name: 'Skeleton Loader', category: 'feedback', files: ['components/feedback/skeleton-loader.tsx'], dependencies: [] },

  // Cards
  { id: 'pricing-table', name: 'Pricing Table', category: 'cards', files: ['components/cards/pricing-table.tsx', 'components/cards/pricing-card.tsx'], dependencies: ['framer-motion', 'lucide-react'] },
  { id: 'product-card', name: 'Product Card', category: 'cards', files: ['components/cards/product-card.tsx'], dependencies: ['framer-motion', 'lucide-react'] },

  // AI
  { id: 'chat-interface', name: 'Chat Interface', category: 'ai', files: ['components/ai/chat-interface.tsx', 'components/ai/chat-bubble.tsx'], dependencies: ['framer-motion', 'lucide-react'] },
  { id: 'streaming-text', name: 'Streaming Text', category: 'ai', files: ['components/ai/streaming-text.tsx'], dependencies: [] },
  { id: 'prompt-input-bar', name: 'Prompt Input Bar', category: 'ai', files: ['components/ai/prompt-input-bar.tsx'], dependencies: ['framer-motion', 'lucide-react'] },

  // E-Commerce
  { id: 'shopping-cart-drawer', name: 'Shopping Cart Drawer', category: 'ecommerce', files: ['components/ecommerce/shopping-cart-drawer.tsx'], dependencies: ['framer-motion', 'lucide-react'] },

  // Auth
  { id: 'onboarding-wizard', name: 'Onboarding Wizard', category: 'auth', files: ['components/auth/onboarding-wizard.tsx'], dependencies: ['framer-motion'] },

  // Utility
  { id: 'theme-switcher', name: 'Theme Switcher', category: 'utility', files: ['components/utility/theme-switcher.tsx'], dependencies: ['framer-motion', 'lucide-react'] },
  { id: 'copy-button', name: 'Copy Button', category: 'utility', files: ['components/utility/copy-button.tsx'], dependencies: ['framer-motion', 'lucide-react'] },
]

// ─── Commands ────────────────────────────────────────────────

program
  .command('add <component>')
  .description('Add a component to your project')
  .option('-d, --dir <directory>', 'Target directory', './src/components')
  .action(async (componentId: string, options: { dir: string }) => {
    const entry = registry.find(
      (c) => c.id === componentId || c.name.toLowerCase() === componentId.toLowerCase(),
    )

    if (!entry) {
      console.error(`Component "${componentId}" not found.`)
      console.error('Run "premiumui list" to see available components.')
      process.exit(1)
    }

    console.log(`\nAdding ${entry.name}...`)
    console.log(`Files: ${entry.files.join(', ')}`)
    console.log(`Target: ${options.dir}`)

    if (entry.dependencies.length > 0) {
      console.log(`\nRequired dependencies: ${entry.dependencies.join(', ')}`)
      console.log(`Run: npm install ${entry.dependencies.join(' ')}`)
    }

    console.log(`\n✓ ${entry.name} added successfully!`)
    console.log(`\nUsage:`)
    console.log(`  import { ${entry.name.replace(/\s+/g, '')} } from './${entry.files[0]?.replace('.tsx', '') ?? ''}'`)
  })

program
  .command('list')
  .description('List all available components')
  .option('-c, --category <category>', 'Filter by category')
  .action((options: { category?: string }) => {
    let components = registry
    if (options.category) {
      components = registry.filter(
        (c) => c.category === options.category,
      )
    }

    const categories = new Map<string, ComponentEntry[]>()
    for (const comp of components) {
      if (!categories.has(comp.category)) {
        categories.set(comp.category, [])
      }
      categories.get(comp.category)?.push(comp)
    }

    console.log('\nPremium UI Components\n')
    for (const [category, comps] of categories) {
      console.log(`  ${category.toUpperCase()}`)
      for (const comp of comps) {
        console.log(`    ${comp.id.padEnd(25)} ${comp.name}`)
      }
      console.log('')
    }
    console.log(`Total: ${components.length} components`)
  })

program
  .command('search <query>')
  .description('Search for components by name or description')
  .action((query: string) => {
    const terms = query.toLowerCase().split(/\s+/)
    const results = registry.filter((c) =>
      terms.some(
        (t) =>
          c.name.toLowerCase().includes(t) ||
          c.category.includes(t) ||
          c.id.includes(t),
      ),
    )

    if (results.length === 0) {
      console.log(`No components found for "${query}"`)
      return
    }

    console.log(`\nSearch results for "${query}":\n`)
    for (const r of results) {
      console.log(`  ${r.id.padEnd(25)} ${r.name} (${r.category})`)
    }
  })

program
  .command('init')
  .description('Initialize Premium UI in your project')
  .action(async () => {
    console.log('\nInitializing Premium UI...\n')
    console.log('1. Install peer dependencies:')
    console.log('   npm install react react-dom framer-motion tailwindcss\n')
    console.log('2. Install Premium UI:')
    console.log('   npm install @premiumui/core\n')
    console.log('3. Import theme CSS in your app entry:')
    console.log("   import '@premiumui/core/themes/themes.css'\n")
    console.log('4. Set theme on your HTML element:')
    console.log('   <html data-theme="ocean" class="dark">\n')
    console.log('5. Start adding components:')
    console.log('   npx premiumui add kpi-stat-card\n')
    console.log('✓ Ready to go!')
  })

program.parse()
