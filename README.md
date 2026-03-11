# Premium UI — MCP-First Component Library

**200+ production-grade React components** | **55 color themes** (110 light/dark configs) | **MCP protocol** for AI agents | **TypeScript strict** | **Tree-shakeable** | **Accessible**

A comprehensive, enterprise-ready UI component library built with React 18, TypeScript, Tailwind CSS, and Framer Motion. Designed so any developer—from an 18-year-old beginner to a senior CTO—can install, use, and extend it in minutes. Every AI agent, LLM, and IDE can discover and compose components through the built-in MCP server.

---

## Table of Contents

1. [Why Premium UI](#why-premium-ui)
2. [Quick Start](#quick-start)
3. [Installation Methods](#installation-methods)
4. [Project Architecture](#project-architecture)
5. [Component Categories (200+)](#component-categories)
6. [Theme System (55 Themes)](#theme-system)
7. [Animation System](#animation-system)
8. [Hooks & Utilities](#hooks--utilities)
9. [MCP Server (AI Agent Protocol)](#mcp-server)
10. [CLI Tool](#cli-tool)
11. [Configuration & Setup](#configuration--setup)
12. [Testing](#testing)
13. [Building from Source](#building-from-source)
14. [Contributing](#contributing)
15. [API Reference](#api-reference)
16. [Scalability & Architecture Decisions](#scalability--architecture-decisions)
17. [Troubleshooting](#troubleshooting)
18. [License](#license)

---

## Why Premium UI

| Feature | Premium UI | shadcn/ui | Chakra UI | MUI |
|---------|-----------|-----------|-----------|-----|
| Components | **200+** | ~50 | ~60 | ~70 |
| Themes | **55** (110 configs) | 1 | ~5 | ~5 |
| MCP Protocol | **Yes** | No | No | No |
| Tree-shakeable | **Yes** | Yes | Partial | No |
| Framer Motion | **Every component** | Manual | No | No |
| Copy-paste OR npm | **Both** | Copy only | npm only | npm only |
| AI Agent Friendly | **Native** | No | No | No |

### Key Differentiators

- **MCP-First**: The only component library with built-in Model Context Protocol support. Any AI agent (Claude, GPT, Copilot) can search, discover, and compose your UI programmatically.
- **200+ Real-World Components**: Not just buttons and inputs. Full dashboard shells, AI chat interfaces, Kanban boards, terminal emulators, e-commerce checkouts, and more.
- **55 Production Themes**: Every theme tested across all components in both light and dark mode. Switch themes with a single HTML attribute.
- **Zero Build Errors, Always**: Continuous integration ensures the library builds cleanly. Every component is type-checked, tested, and linted.

---

## Quick Start

### 30-Second Setup

```bash
# 1. Install the library
npm install @premiumui/core

# 2. Add Tailwind CSS plugin (tailwind.config.ts)
# 3. Apply a theme to your HTML
# 4. Import and use components
```

### Minimal Example

```tsx
// app/page.tsx
import { KpiStatCard } from '@premiumui/core'

export default function Page() {
  return (
    <KpiStatCard
      value="$48,352"
      label="Revenue"
      trend={12.5}
      trendDirection="up"
      sparklineData={[30, 45, 28, 52, 41, 60, 55]}
    />
  )
}
```

### Apply a Theme

```html
<!-- In your root HTML or layout -->
<html data-theme="ocean" class="dark">
```

That's it. Every component in the library will automatically use the Ocean theme in dark mode.

---

## Installation Methods

### Method 1: NPM Package (Recommended)

```bash
# npm
npm install @premiumui/core

# yarn
yarn add @premiumui/core

# pnpm
pnpm add @premiumui/core
```

**Peer dependencies** (you likely already have these):
```bash
npm install react react-dom framer-motion tailwindcss
```

### Method 2: CLI (Add Individual Components)

```bash
# Install a single component into your project
npx premiumui add kpi-stat-card

# Install multiple components
npx premiumui add kpi-stat-card activity-feed dashboard-shell

# List all available components
npx premiumui list

# Search components
npx premiumui search "chart"
```

The CLI copies the component source code directly into your project, so you own it completely. No runtime dependency.

### Method 3: MCP Server (AI Agent)

```bash
# Start the MCP server
npx premiumui-mcp

# Or add to your Claude Desktop / AI IDE config:
{
  "mcpServers": {
    "premiumui": {
      "command": "npx",
      "args": ["premiumui-mcp"]
    }
  }
}
```

Your AI agent can then search, inspect, and compose components programmatically.

---

## Project Architecture

```
premium-components/
├── packages/
│   ├── ui/                          # Core component library
│   │   ├── src/
│   │   │   ├── components/          # 200+ components in 21 categories
│   │   │   │   ├── dashboard/       # KPI cards, charts, feeds (12)
│   │   │   │   ├── data-tables/     # Tables, lists, Kanban (10)
│   │   │   │   ├── forms/           # Login, registration, payments (12)
│   │   │   │   ├── navigation/      # Sidebar, tabs, command palette (10)
│   │   │   │   ├── feedback/        # Toast, modal, skeleton loader (10)
│   │   │   │   ├── cards/           # Pricing, blog, testimonial (10)
│   │   │   │   ├── ai/              # Chat, streaming, agents (10)
│   │   │   │   ├── ai-ops/          # LLM playground, prompt editor (10)
│   │   │   │   ├── ecommerce/       # Cart, checkout, reviews (8)
│   │   │   │   ├── auth/            # Social auth, 2FA, onboarding (6)
│   │   │   │   ├── utility/         # Theme switcher, copy button (12)
│   │   │   │   ├── developer-tools/ # API playground, log viewer (10)
│   │   │   │   ├── saas-platform/   # Billing, teams, permissions (10)
│   │   │   │   ├── internal-tools/  # CRUD, approval workflows (10)
│   │   │   │   ├── cli-web/         # Terminal, diff viewer (10)
│   │   │   │   ├── collaboration/   # Comments, mentions, polls (10)
│   │   │   │   ├── media/           # Image cropper, video player (10)
│   │   │   │   ├── scheduling/      # Calendar, week planner (10)
│   │   │   │   ├── maps/            # Location picker, delivery (10)
│   │   │   │   └── messaging/       # Inbox, email, notifications (10)
│   │   │   ├── themes/              # 55 theme definitions + CSS
│   │   │   ├── animations/          # Framer Motion preset variants
│   │   │   ├── hooks/               # useTheme, useReducedMotion, useAnimatedNumber
│   │   │   ├── lib/                 # cn(), formatNumber(), uniqueId()
│   │   │   ├── types/               # Shared TypeScript interfaces
│   │   │   ├── __tests__/           # Vitest unit & integration tests
│   │   │   └── index.ts             # Main barrel export
│   │   ├── vitest.config.ts         # Test configuration
│   │   ├── tsup.config.ts           # Build configuration
│   │   ├── tailwind.config.ts       # Tailwind CSS configuration
│   │   └── package.json
│   │
│   ├── docs/                        # Next.js 14 documentation site
│   │   ├── src/app/
│   │   │   ├── page.tsx             # Homepage with category grid
│   │   │   ├── components/page.tsx  # Component showcase with CLI snippets
│   │   │   └── layout.tsx           # Root layout with theme support
│   │   └── package.json
│   │
│   ├── cli/                         # CLI tool for adding components
│   │   ├── src/
│   │   │   ├── index.ts             # Commander-based CLI
│   │   │   └── manifests.ts         # Component metadata registry
│   │   └── package.json
│   │
│   └── mcp-server/                  # MCP protocol server
│       ├── src/
│       │   ├── index.ts             # MCP SDK server implementation
│       │   └── manifests.ts         # Component manifests for AI
│       └── package.json
│
├── package.json                     # Root workspace config
├── turbo.json                       # Turborepo build orchestration
├── tsconfig.base.json               # Shared TypeScript config
└── README.md                        # This file
```

### How the Architecture Scales

The architecture is designed to scale from 200 to **3,000+ components**:

1. **Category-based file organization**: Each category is a folder with its own barrel `index.ts`. Adding a new category is just adding a folder.
2. **Wildcard entry points in tsup**: `src/components/*/index.ts` automatically picks up new categories without config changes.
3. **Tree-shakeable ESM output**: Only imported components end up in the user's bundle. Adding 1,000 more components doesn't increase bundle size for users importing 5.
4. **Parallel builds with Turborepo**: Each package builds independently. Adding packages doesn't slow down the build.
5. **Component manifest system**: The CLI and MCP server use a shared manifest registry. Adding a component to the manifest automatically makes it available in both.

---

## Component Categories

### Dashboard & Analytics (12 components)

| Component | Description | Key Props |
|-----------|-------------|-----------|
| `KpiStatCard` | KPI card with animated number, trend arrow, sparkline | `value`, `label`, `trend`, `trendDirection`, `sparklineData` |
| `KpiGrid` | Responsive grid of KPI cards | `cards`, `columns` |
| `RevenueChart` | Area chart with revenue data | `data`, `period`, `currency` |
| `BarChartBlock` | Vertical/horizontal bar chart | `data`, `orientation`, `stacked` |
| `DonutChartBlock` | Donut/pie chart with center label | `data`, `centerLabel`, `size` |
| `ActivityFeed` | Real-time activity timeline | `items`, `maxItems` |
| `MiniSparklineRow` | Row of metrics with inline sparklines | `metrics` |
| `MetricComparisonCard` | Side-by-side metric comparison | `metricA`, `metricB` |
| `GoalProgressCard` | Progress toward a goal | `name`, `current`, `target` |
| `HeatmapCalendar` | GitHub-style contribution heatmap | `data`, `year` |
| `RealTimeCounter` | Animated live counter | `value`, `label` |
| `DashboardShell` | Full dashboard layout with sidebar | `title`, `sidebarItems`, `user`, `children` |

### Data Tables & Lists (10 components)

| Component | Description |
|-----------|-------------|
| `DataTable` | Full-featured data table with sort, filter, pagination |
| `ExpandableRowTable` | Table with expandable detail rows |
| `EditableTable` | Inline-editable cells |
| `CardListView` | Card-based list with grid/list toggle |
| `SortableList` | Drag-and-drop sortable list |
| `VirtualList` | Virtualized list for 10,000+ items |
| `KanbanBoard` | Drag-and-drop Kanban columns |
| `TimelineList` | Vertical timeline with milestones |
| `NestedTreeList` | Collapsible tree structure |
| `CommandPaletteList` | Searchable command palette list |

### Forms & Inputs (12 components)

| Component | Description |
|-----------|-------------|
| `LoginForm` | Email/password login with social auth |
| `RegistrationForm` | Full registration with validation |
| `MultiStepForm` | Multi-step form wizard with progress |
| `SettingsForm` | Settings panel with toggles and selects |
| `SearchInput` | Search with suggestions and keyboard nav |
| `DateRangePicker` | Date range selector with presets |
| `FileUploadZone` | Drag-and-drop file upload with preview |
| `PaymentForm` | Credit card form with validation |
| `AddressForm` | Address form with autocomplete |
| `InlineEditField` | Click-to-edit field |
| `TagMultiSelect` | Tag selector with search |
| `OtpInput` | One-time password input |

### Navigation & Layout (10 components)

| Component | Description |
|-----------|-------------|
| `CollapsibleSidebar` | Sidebar that collapses to icons |
| `TopNavBar` | Top navigation with dropdowns |
| `BreadcrumbTrail` | Breadcrumb navigation |
| `TabNavigation` | Tab bar with animated indicator |
| `CommandPalette` | Cmd+K command palette |
| `MobileBottomNav` | Mobile bottom tab bar |
| `MegaMenu` | Multi-column dropdown menu |
| `PageTransition` | Animated page transitions |
| `FloatingActionMenu` | FAB with expandable actions |
| `StepperNavigation` | Multi-step progress stepper |

### Feedback & Overlays (10 components)

| Component | Description |
|-----------|-------------|
| `Toast` | Toast notifications with variants |
| `ModalDialog` | Accessible modal with animations |
| `SlideOverPanel` | Slide-in side panel |
| `ConfirmationDialog` | Confirm/cancel dialog |
| `Tooltip` | Hover tooltip with positioning |
| `Popover` | Click-triggered popover |
| `AlertBanner` | Dismissible alert banner |
| `SkeletonLoader` | Content loading placeholder |
| `EmptyState` | No-data state with action |
| `ProgressIndicator` | Progress bar with label |

### Cards & Content (10 components)

`PricingCard` | `PricingTable` | `TestimonialCard` | `FeatureCard` | `BlogCard` | `UserProfileCard` | `ProductCard` | `NotificationCard` | `StatCard` | `CtaBannerCard`

### AI & LLM Patterns (10 components)

`ChatInterface` | `ChatBubble` | `StreamingText` | `PromptInputBar` | `AIResponseCard` | `RAGSourceCitation` | `AgentStatusCard` | `ModelSelector` | `TokenUsageMeter` | `KnowledgeBaseList`

### AI Ops (10 components)

`LlmPlayground` | `PromptTemplateEditor` | `EvaluationResultsTable` | `VectorSearchExplorer` | `AgentWorkflowBuilder` | `ModelComparisonCard` | `CostTrackerDashboard` | `AnnotationLabelingTool` | `GuardrailConfigPanel` | `DatasetBrowser`

### E-Commerce (8 components)

`ShoppingCartDrawer` | `ProductQuickView` | `CheckoutSummary` | `ProductImageGallery` | `ReviewBlock` | `CartItemRow` | `WishlistGrid` | `PromoCodeInput`

### Authentication & Onboarding (6 components)

`SocialAuthButtons` | `TwoFactorAuth` | `OnboardingWizard` | `PasswordResetFlow` | `TeamInviteForm` | `ProfileSetupCard`

### Utility & System (12 components)

`ThemeSwitcher` | `KeyboardShortcutDisplay` | `ChangelogModal` | `CookieConsentBanner` | `FeedbackWidget` | `CopyButton` | `AvatarGroup` | `TagCollection` | `AnnouncementBar` | `ErrorPage` | `MaintenancePage` | `IntegrationsGrid`

### Developer Tools (10 components)

`ApiKeyManager` | `WebhookTester` | `EnvironmentVariableEditor` | `LogViewer` | `JsonInspector` | `ApiPlayground` | `DeploymentPipeline` | `SchemaVisualizer` | `CodeSnippetBlock` | `FeatureFlagPanel`

### SaaS Platform (10 components)

`SubscriptionManager` | `UsageBillingDashboard` | `TeamManagementPanel` | `AuditLogViewer` | `PermissionsMatrix` | `OnboardingChecklist` | `TenantSwitcher` | `QuotaUsageCard` | `CustomerHealthScore` | `ChangelogTimeline`

### Internal Tools (10 components)

`CrudResourcePanel` | `ApprovalWorkflow` | `BulkActionToolbar` | `ReportBuilder` | `NotificationCenter` | `SystemStatusDashboard` | `ImportExportWizard` | `RoleBasedNavShell` | `TaskQueueMonitor` | `ConfigurationPanel`

### CLI & Web Terminal (10 components)

`TerminalEmulator` | `CliOutputRenderer` | `McpServerStatus` | `AgentChatTerminal` | `PipelineLogStream` | `CommandBuilderForm` | `DiffViewer` | `SshConnectionManager` | `CronScheduleEditor` | `WebhookEventLog`

### Collaboration & Social (10 components)

`CommentThread` | `MentionInput` | `PresenceIndicator` | `SharedCursor` | `ReactionPicker` | `ActivityTimeline` | `InviteLinkCard` | `VotingPoll` | `LiveBadge` | `CollaborativeEditorToolbar`

### Media & File Management (10 components)

`ImageCropper` | `VideoPlayer` | `AudioWaveform` | `FileBrowser` | `DocumentViewer` | `MediaGrid` | `UploadProgressCard` | `CloudStorageMeter` | `AttachmentChip` | `ScreenRecordingCard`

### Scheduling & Calendar (10 components)

`MonthCalendar` | `WeekPlanner` | `EventCard` | `AvailabilityPicker` | `TimezoneSelector` | `CountdownTimer` | `BookingConfirmation` | `RecurringScheduleEditor` | `GanttRow` | `AgendaList`

### Maps & Location (10 components)

`LocationPicker` | `AddressAutocomplete` | `StoreLocatorCard` | `RouteSummary` | `GeofenceEditor` | `DeliveryTracker` | `HeatmapOverlay` | `CoordinatesDisplay` | `RegionSelector` | `EtaCard`

### Messaging & Notifications (10 components)

`InboxPanel` | `PushNotificationCard` | `EmailComposer` | `SmsPreview` | `NotificationPreferences` | `MessageStatusRow` | `BroadcastComposer` | `UnreadBadgeStack` | `DigestSummaryCard` | `WebhookNotificationCard`

---

## Theme System

### 55 Themes, 110 Configurations

Every theme provides both light and dark mode. Apply a theme by setting `data-theme` on your root element:

```html
<html data-theme="ocean" class="dark">
```

Switch theme programmatically:

```tsx
import { useTheme } from '@premiumui/core'

function App() {
  const { theme, mode, setTheme, setMode } = useTheme('ocean', 'system')

  return (
    <button onClick={() => setTheme('forest')}>
      Switch to Forest
    </button>
  )
}
```

### Theme Families

| Family | Themes | Vibe |
|--------|--------|------|
| **Blue** | Ocean, Sky, Cobalt, Sapphire, Steel, Arctic | Professional, corporate, trustworthy |
| **Green** | Forest, Mint, Sage, Emerald, Lime, Pine | Nature, growth, health, finance |
| **Teal** | Teal, Cyan, Aqua, Turquoise, Verdigris | Modern, clean, tech-forward |
| **Purple** | Violet, Lavender, Grape, Amethyst, Plum, Indigo | Creative, premium, elegant |
| **Red** | Rose, Crimson, Coral, Ruby, Blush, Cherry | Bold, energetic, passionate |
| **Orange** | Amber, Tangerine, Peach, Copper, Honey | Warm, friendly, inviting |
| **Yellow** | Gold, Sunflower, Canary, Saffron | Optimistic, bright, attention-grabbing |
| **Neutral** | Slate, Zinc, Stone, Graphite, Silver, Charcoal | Minimal, enterprise, serious |
| **Specialty** | Neon, Synthwave, Sunset, Aurora, Monochrome, Earth, Midnight, Frost, Sand, Terminal, Paper | Unique vibes for specific use cases |

### How Themes Work (Under the Hood)

Themes use CSS custom properties (variables) in HSL format:

```css
[data-theme="ocean"] {
  --background: 210 40% 98%;
  --foreground: 222 47% 11%;
  --primary: 221 83% 53%;
  --secondary: 210 40% 96%;
  --muted: 210 40% 96%;
  --accent: 210 40% 96%;
  --destructive: 0 84% 60%;
  --border: 214 32% 91%;
  --ring: 221 83% 53%;
  --radius: 0.5rem;
}
```

Components reference these with Tailwind's `hsl(var(--...))` pattern:

```tsx
<div className="bg-background text-foreground border-border">
  <button className="bg-primary text-primary-foreground">
    Click me
  </button>
</div>
```

This means **every component automatically adapts to any theme** without any per-component configuration.

---

## Animation System

Every component uses Framer Motion animations. Import presets for custom components:

```tsx
import {
  // Spring physics presets
  springSnappy,      // Fast, responsive (stiffness: 300, damping: 30)
  springGentle,      // Smooth, slow (stiffness: 150, damping: 25)
  springBouncy,      // Fun, playful (stiffness: 400, damping: 20)
  springHeavy,       // Weighty, deliberate (stiffness: 100, damping: 30)

  // Entrance/exit variants
  fadeVariants,          // Simple opacity fade
  fadeUpVariants,        // Fade + slide up from below
  fadeDownVariants,      // Fade + slide down from above
  scaleInVariants,       // Scale from 0.95 to 1
  scaleInBounceVariants, // Scale from 0.8 with bounce
  slideRightVariants,    // Slide in from right
  slideLeftVariants,     // Slide in from left
  slideUpVariants,       // Slide up from bottom

  // Container variants (for staggering children)
  staggerContainerVariants, // 75ms stagger delay
  staggerFastVariants,      // 50ms stagger delay
  createStaggerVariants,    // Custom stagger timing

  // Hover presets
  hoverLiftProps,   // Lift card on hover (y: -2)
  hoverPressProps,  // Scale button on press (scale: 0.97)

  // Overlay variants
  backdropVariants, // Backdrop fade for modals
  modalVariants,    // Modal entrance with scale

  // Accessibility
  reducedMotionVariants, // Empty variants for prefers-reduced-motion
} from '@premiumui/core'
```

### Usage Example

```tsx
import { motion } from 'framer-motion'
import { fadeUpVariants, springSnappy } from '@premiumui/core'

function MyCard() {
  return (
    <motion.div
      variants={fadeUpVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={springSnappy}
    >
      Card content
    </motion.div>
  )
}
```

### Reduced Motion Support

All components automatically disable animations when the user has `prefers-reduced-motion: reduce` enabled:

```tsx
import { useReducedMotion, reducedMotionVariants, fadeUpVariants } from '@premiumui/core'

function AccessibleComponent() {
  const prefersReduced = useReducedMotion()
  const variants = prefersReduced ? reducedMotionVariants : fadeUpVariants

  return <motion.div variants={variants}>...</motion.div>
}
```

---

## Hooks & Utilities

### Hooks

| Hook | Description | Returns |
|------|-------------|---------|
| `useTheme(defaultTheme?, defaultMode?)` | Theme and color mode management | `{ theme, mode, resolvedMode, setTheme, setMode }` |
| `useReducedMotion()` | Detects `prefers-reduced-motion` | `boolean` |
| `useAnimatedNumber(target, options?)` | Animate number changes with spring physics | `number` (current animated value) |

### Utility Functions

| Function | Description | Example |
|----------|-------------|---------|
| `cn(...classes)` | Merge Tailwind classes with conflict resolution | `cn('p-4', 'p-8')` → `'p-8'` |
| `formatNumber(value, options?)` | Locale-aware number formatting | `formatNumber(1234567)` → `'1,234,567'` |
| `formatCurrency(value, currency?)` | Currency formatting | `formatCurrency(29.99)` → `'$29.99'` |
| `formatPercent(value)` | Percentage formatting | `formatPercent(85)` → `'85.0%'` |
| `uniqueId(prefix?)` | Generate unique component IDs | `uniqueId('modal')` → `'modal-42'` |

---

## MCP Server

The MCP (Model Context Protocol) server lets any AI agent discover and compose components programmatically.

### Setup

```bash
# Run standalone
npx premiumui-mcp

# Add to Claude Desktop config (~/.claude/claude_desktop_config.json)
{
  "mcpServers": {
    "premiumui": {
      "command": "npx",
      "args": ["premiumui-mcp"]
    }
  }
}
```

### Available Tools

| Tool | Description | Example Query |
|------|-------------|---------------|
| `search_components` | Natural language search | "I need a dashboard with KPI cards" |
| `get_component_details` | Full TypeScript interface + examples | "Show me KpiStatCard props" |
| `suggest_composition` | Page composition guidance | "Build a settings page" |
| `list_all_components` | Browse all 200+ components | "List all AI components" |
| `get_theme_info` | Theme configuration help | "Show me dark themes" |

### AI Agent Workflow

1. Agent calls `search_components("dashboard analytics")` → gets matching components
2. Agent calls `get_component_details("kpi-stat-card")` → gets full TypeScript interface
3. Agent calls `suggest_composition("analytics dashboard")` → gets layout guidance
4. Agent generates code using the component interfaces

---

## CLI Tool

```bash
# Install globally (optional)
npm install -g @premiumui/cli

# Or use npx
npx premiumui <command>
```

### Commands

```bash
# Add a component to your project
npx premiumui add <component-name>

# Add multiple components
npx premiumui add kpi-stat-card kpi-grid dashboard-shell

# List all available components
npx premiumui list

# Search components by keyword
npx premiumui search "chart"

# Show component details
npx premiumui info kpi-stat-card
```

The CLI copies component source files directly into your project (like shadcn/ui), giving you full control over the code.

---

## Configuration & Setup

### Tailwind CSS

Add the Premium UI content path to your `tailwind.config.ts`:

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{ts,tsx}',
    // Add this line to include Premium UI components:
    './node_modules/@premiumui/core/dist/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
}

export default config
```

### Import Theme CSS

```tsx
// In your root layout or global styles:
import '@premiumui/core/themes/themes.css'
```

Or copy just the theme you need:
```css
/* Only import the Ocean theme */
@import '@premiumui/core/themes/ocean.css';
```

---

## Testing

The library uses **Vitest** with **React Testing Library** for comprehensive testing.

### Run Tests

```bash
# Run all tests
yarn test

# Run tests in watch mode (from packages/ui)
cd packages/ui && npx vitest

# Run tests with coverage
cd packages/ui && npx vitest run --coverage

# Run a specific test file
cd packages/ui && npx vitest run src/__tests__/utils.test.ts
```

### Test Structure

```
packages/ui/src/__tests__/
├── setup.ts                    # Test setup (jsdom, framer-motion mock, etc.)
├── utils.test.ts               # Utility function tests
├── hooks.test.ts               # Hook tests (useTheme, useReducedMotion)
├── animations.test.ts          # Animation preset tests
├── themes.test.ts              # Theme registry validation
├── components.test.tsx         # Core component render tests
├── components-advanced.test.tsx # Advanced component interaction tests
└── exports.test.ts             # Barrel export integrity tests (all 200+)
```

### What's Tested

- **Utility functions**: `cn()`, `formatNumber()`, `formatCurrency()`, `formatPercent()`, `uniqueId()`
- **Hooks**: `useTheme` (theme switching, dark mode, system preference), `useReducedMotion`
- **Animations**: All spring presets, fade/scale/slide variants, stagger configs
- **Themes**: All 55 themes validate required color tokens, HSL format, family membership
- **Components**: Render tests, accessibility (ARIA roles), user interactions, loading states
- **Export integrity**: Every one of 200+ components verified as correctly exported

### Writing Tests for New Components

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MyComponent } from '../components/my-category'

describe('MyComponent', () => {
  it('renders with required props', () => {
    render(<MyComponent title="Hello" />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('handles user interaction', async () => {
    const onClick = vi.fn()
    render(<MyComponent title="Click me" onClick={onClick} />)
    await userEvent.setup().click(screen.getByText('Click me'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('renders accessible markup', () => {
    render(<MyComponent title="Alert" role="alert" />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})
```

---

## Building from Source

### Prerequisites

- Node.js 18+
- Yarn 1.22+

### Build

```bash
# Clone the repository
git clone https://github.com/your-org/premium-components.git
cd premium-components

# Install dependencies
yarn install

# Build all packages
yarn build

# Or build a specific package
npx turbo build --filter=@premiumui/core
```

### Development

```bash
# Start dev mode (all packages with hot reload)
yarn dev

# Start docs site only
cd packages/docs && yarn dev
```

### Package Scripts

| Script | Description |
|--------|-------------|
| `yarn build` | Build all packages (Turborepo) |
| `yarn dev` | Start all packages in dev mode |
| `yarn test` | Run all tests |
| `yarn lint` | TypeScript type checking |
| `yarn clean` | Remove all build artifacts |

---

## Contributing

### Adding a New Component

1. **Create the component file**: `packages/ui/src/components/<category>/<component-name>.tsx`

2. **Follow the component pattern**:
   ```tsx
   'use client'

   import * as React from 'react'
   import { motion } from 'framer-motion'
   import { SomeIcon } from 'lucide-react'
   import { cn } from '../../lib/utils'

   export interface MyComponentProps {
     title: string
     className?: string
   }

   export const MyComponent: React.FC<MyComponentProps> = ({
     title,
     className,
   }) => {
     return (
       <motion.div
         initial={{ opacity: 0, y: 15 }}
         animate={{ opacity: 1, y: 0 }}
         className={cn('rounded-lg border border-border bg-card p-4', className)}
       >
         <h3 className="text-foreground">{title}</h3>
       </motion.div>
     )
   }

   MyComponent.displayName = 'MyComponent'
   ```

3. **Export from category barrel**: Add to `packages/ui/src/components/<category>/index.ts`

4. **Export from main barrel**: Add to `packages/ui/src/index.ts`

5. **Add to CLI manifest**: Update `packages/cli/src/manifests.ts`

6. **Add to MCP manifest**: Update `packages/mcp-server/src/manifests.ts`

7. **Write tests**: Add tests in `packages/ui/src/__tests__/`

### Component Requirements

- `'use client'` directive at the top
- Framer Motion animations (entrance, hover, exit)
- Lucide React icons (not custom SVGs)
- `cn()` utility for class merging
- Tailwind CSS with CSS variable colors (`hsl(var(--...))`)
- Exported TypeScript interface for props
- `.displayName` set for React DevTools
- Accessible markup (ARIA roles, keyboard navigation)
- Works with all 55 themes in light and dark mode

---

## API Reference

### Imports

```tsx
// Full library import
import { KpiStatCard, ChatInterface, useTheme } from '@premiumui/core'

// Category-specific import (smaller bundle)
import { KpiStatCard } from '@premiumui/core/components/dashboard'
import { ChatInterface } from '@premiumui/core/components/ai'

// Theme system
import { themes, themeNames, themeFamilies } from '@premiumui/core/themes'

// Animations
import { fadeUpVariants, springSnappy } from '@premiumui/core/animations'
```

### Subpath Exports

The package provides granular subpath exports for optimal tree-shaking:

| Path | Contents |
|------|----------|
| `@premiumui/core` | Everything (200+ components + utils + hooks + themes + animations) |
| `@premiumui/core/themes` | Theme definitions and registry |
| `@premiumui/core/animations` | Framer Motion presets |
| `@premiumui/core/components/dashboard` | Dashboard components only |
| `@premiumui/core/components/ai` | AI components only |
| `@premiumui/core/components/<category>` | Any category's components |

---

## Scalability & Architecture Decisions

### Why This Architecture Scales to 3,000+ Components

| Decision | Rationale |
|----------|-----------|
| **Category folders** | New categories don't touch existing code. Just add a folder. |
| **Barrel exports per category** | Each category manages its own exports. No single massive file. |
| **Wildcard tsup entry** | `src/components/*/index.ts` auto-discovers categories. |
| **CSS variables for theming** | Adding themes doesn't require component changes. |
| **Tree-shaking ESM** | Users pay only for what they import. 3,000 components = same bundle for users importing 5. |
| **Turborepo caching** | Unchanged packages skip rebuild. Scales with workspace size. |
| **Manifest-driven CLI/MCP** | Component metadata is data, not code. Easy to generate programmatically. |
| **Vitest parallel tests** | Tests run in parallel by default. Adding tests scales linearly. |

### Bundle Size

Each component is typically **2-8 KB gzipped**. The library uses:
- ESM-only output (no CommonJS duplication)
- `splitting: true` in tsup (shared code chunked)
- `treeshake: true` (dead code eliminated)
- External peer dependencies (React, Framer Motion, Tailwind not bundled)

### Performance Guidelines for Contributors

1. **No global side effects** in components
2. **Lazy load heavy dependencies** (e.g., Recharts only in chart components)
3. **Use `React.memo`** for list item components
4. **Prefer CSS animations** over JS animations for simple transitions
5. **Use `useReducedMotion`** to skip animations for accessibility

---

## Troubleshooting

### Common Issues

**"Module not found: @premiumui/core"**
```bash
# Ensure peer dependencies are installed
npm install react react-dom framer-motion tailwindcss
```

**Components render without styling**
```
1. Verify Tailwind is configured with Premium UI content paths
2. Import the theme CSS: import '@premiumui/core/themes/themes.css'
3. Set data-theme on your root HTML element
```

**Dark mode not working**
```html
<!-- Add class="dark" to enable dark mode -->
<html data-theme="ocean" class="dark">
```

**Build errors in your project**
```bash
# Ensure TypeScript is 5.4+
npx tsc --version

# Ensure tsconfig has "moduleResolution": "bundler" or "node16"
```

**Animation performance issues**
```tsx
// Use will-change for heavy animations
<motion.div style={{ willChange: 'transform, opacity' }}>

// Or disable animations for reduced motion users
import { useReducedMotion } from '@premiumui/core'
```

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3+ | UI framework |
| TypeScript | 5.4+ | Type safety (strict mode) |
| Tailwind CSS | 3.4+ | Utility-first styling |
| Framer Motion | 11+ | Physics-based animations |
| Radix UI | Latest | Accessible primitives |
| Recharts | 2.12+ | Chart components |
| Lucide React | 0.350+ | Icon system |
| Next.js | 14+ | Documentation site |
| Vitest | Latest | Testing framework |
| tsup | 8+ | Build bundler |
| Turborepo | 2+ | Monorepo orchestration |
| MCP SDK | 1+ | AI agent protocol |

---

## License

MIT License. See [LICENSE](./LICENSE) for details.

---

**Built with precision for the open-source community. From startups to enterprises, from junior devs to CTOs, from human developers to AI agents.**
