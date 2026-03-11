# Premium UI — MCP-First Component Library

Production-grade React component library with **100 premium blocks**, **55 color themes**, Framer Motion animations, and **MCP protocol support** for AI agents.

## Features

- **100 Component Blocks** across 10 categories: Dashboard, Data Tables, Forms, Navigation, Feedback, Cards, AI Patterns, E-Commerce, Auth, and Utility
- **55 Color Themes** with light/dark modes (110 total configurations)
- **Framer Motion Animations** on every component — entrance, hover, state transitions, and exit animations
- **MCP Protocol Server** — any AI agent can discover, understand, and compose components programmatically
- **TypeScript Strict Mode** — complete types, zero `any`, full JSDoc documentation
- **Tailwind CSS** — all styling through CSS custom properties and utility classes
- **shadcn/ui Architecture** — built on Radix UI primitives with custom styling
- **Tree-shakeable** — import only what you use, under 5KB gzipped per component
- **Accessible** — WCAG 2.1 AA compliant, keyboard navigable, reduced motion support

## Quick Start

```bash
# Install
npm install @premiumui/core

# Or add individual components
npx premiumui add kpi-stat-card
npx premiumui add chat-interface
```

### Apply a Theme

```html
<html data-theme="ocean" class="dark">
```

### Use Components

```tsx
import { KpiStatCard, KpiGrid, DashboardShell } from '@premiumui/core'

export default function Dashboard() {
  return (
    <DashboardShell sidebarItems={items} user={user}>
      <KpiGrid
        cards={[
          { value: "$48,352", label: "Revenue", trend: 12.5, trendDirection: "up" },
          { value: "2,340", label: "Users", trend: 8.1, trendDirection: "up" },
          { value: "98.5%", label: "Uptime", trend: 0.1, trendDirection: "neutral" },
        ]}
        columns={3}
      />
    </DashboardShell>
  )
}
```

## MCP Server

Connect any AI agent to your component library:

```bash
npx premiumui-mcp
```

The MCP server exposes tools:
- `search_components` — natural language component search
- `get_component_details` — full TypeScript interface and examples
- `suggest_composition` — page-building guidance
- `list_all_components` — browse the full library
- `get_theme_info` — theme configuration help

## 55 Themes

| Family | Themes |
|--------|--------|
| Blue | Ocean, Sky, Cobalt, Sapphire, Steel, Arctic |
| Green | Forest, Mint, Sage, Emerald, Lime, Pine |
| Teal | Teal, Cyan, Aqua, Turquoise, Verdigris |
| Purple | Violet, Lavender, Grape, Amethyst, Plum, Indigo |
| Red | Rose, Crimson, Coral, Ruby, Blush, Cherry |
| Orange | Amber, Tangerine, Peach, Copper, Honey |
| Yellow | Gold, Sunflower, Canary, Saffron |
| Neutral | Slate, Zinc, Stone, Graphite, Silver, Charcoal |
| Specialty | Neon, Synthwave, Sunset, Aurora, Monochrome, Earth, Midnight, Frost, Sand, Terminal, Paper |

## Component Categories

### Dashboard & Analytics (12 blocks)
KPI Stat Card, KPI Grid, Revenue Chart, Bar Chart, Donut Chart, Activity Feed, Mini Sparkline Row, Metric Comparison Card, Goal Progress Card, Heatmap Calendar, Real-Time Counter, Dashboard Shell

### Data Tables & Lists (10 blocks)
Data Table, Expandable Row Table, Editable Table, Card List View, Sortable Draggable List, Virtual Scrolling List, Kanban Board, Timeline List, Nested Tree List, Command Palette List

### Forms & Inputs (12 blocks)
Login Form, Registration Form, Multi-Step Form Wizard, Settings Form, Search Input, Date Range Picker, File Upload Zone, Payment Form, Address Form, Inline Edit Field, Tag Multi-Select, OTP Input

### Navigation & Layout (10 blocks)
Collapsible Sidebar, Top Navigation Bar, Breadcrumb Trail, Tab Navigation, Command Palette, Mobile Bottom Nav, Mega Menu, Page Transition, Floating Action Menu, Stepper Navigation

### Feedback & Overlays (10 blocks)
Toast Notification, Modal Dialog, Slide-Over Panel, Confirmation Dialog, Tooltip, Popover, Alert Banner, Skeleton Loader, Empty State, Progress Indicator

### Cards & Content (10 blocks)
Pricing Card, Pricing Table, Testimonial Card, Feature Card, Blog Card, User Profile Card, Product Card, Notification Card, Stat Card, CTA Banner Card

### AI & LLM Patterns (10 blocks)
Chat Interface, Chat Bubble, Streaming Text, Prompt Input Bar, AI Response Card, RAG Source Citation, Agent Status Card, Model Selector, Token Usage Meter, Knowledge Base List

### E-Commerce (8 blocks)
Shopping Cart Drawer, Product Quick View, Checkout Summary, Product Image Gallery, Review Block, Cart Item Row, Wishlist Grid, Promo Code Input

### Authentication & Onboarding (6 blocks)
Social Auth Buttons, Two-Factor Auth, Onboarding Wizard, Password Reset Flow, Team Invite Form, Profile Setup Card

### Utility & System (12 blocks)
Theme Switcher, Keyboard Shortcut Display, Changelog Modal, Cookie Consent Banner, Feedback Widget, Copy Button, Avatar Group, Tag Collection, Announcement Bar, Error Page, Maintenance Page, Integrations Grid

## Architecture

```
packages/
  ui/           → Component library (React + TypeScript + Tailwind + Framer Motion)
  mcp-server/   → MCP protocol server for AI agents
  cli/          → CLI tool for adding components
  docs/         → Next.js documentation site
```

## Tech Stack

- React 18+ with TypeScript 5.4+ (strict mode)
- Tailwind CSS 3.4+ with CSS custom properties
- Framer Motion 11+ for all animations
- Radix UI primitives (via shadcn/ui patterns)
- Recharts for chart components
- Lucide React for icons
- Next.js 14+ for documentation
- MCP TypeScript SDK for AI agent protocol

## License

MIT
