const categories = [
  {
    title: 'Dashboard & Analytics',
    description: 'KPI cards, charts, activity feeds, and complete dashboard shells',
    count: 12,
    href: '/components/dashboard',
  },
  {
    title: 'Data Tables & Lists',
    description: 'Sortable tables, Kanban boards, timelines, and virtual lists',
    count: 10,
    href: '/components/data-tables',
  },
  {
    title: 'Forms & Inputs',
    description: 'Login, registration, multi-step wizards, payments, and file uploads',
    count: 12,
    href: '/components/forms',
  },
  {
    title: 'Navigation & Layout',
    description: 'Sidebars, command palettes, tabs, breadcrumbs, and page transitions',
    count: 10,
    href: '/components/navigation',
  },
  {
    title: 'Feedback & Overlays',
    description: 'Toasts, modals, tooltips, skeleton loaders, and progress indicators',
    count: 10,
    href: '/components/feedback',
  },
  {
    title: 'Cards & Content',
    description: 'Pricing tables, testimonials, blog cards, and product cards',
    count: 10,
    href: '/components/cards',
  },
  {
    title: 'AI & LLM Patterns',
    description: 'Chat interfaces, streaming text, prompt bars, and agent monitoring',
    count: 10,
    href: '/components/ai',
  },
  {
    title: 'E-Commerce',
    description: 'Shopping carts, product galleries, checkout, and reviews',
    count: 8,
    href: '/components/ecommerce',
  },
  {
    title: 'Authentication & Onboarding',
    description: 'Social auth, 2FA, onboarding wizards, and team invitations',
    count: 6,
    href: '/components/auth',
  },
  {
    title: 'Utility & System',
    description: 'Theme switcher, keyboard shortcuts, error pages, and more',
    count: 12,
    href: '/components/utility',
  },
  {
    title: 'Developer Tools',
    description: 'API key management, webhook testing, log viewers, JSON inspector, and CI/CD pipelines',
    count: 10,
    href: '/components/developer-tools',
  },
  {
    title: 'SaaS Platform',
    description: 'Subscription management, billing dashboards, team management, permissions, and audit logs',
    count: 10,
    href: '/components/saas-platform',
  },
  {
    title: 'AI Ops',
    description: 'LLM playgrounds, prompt editors, evaluation tables, vector search, and agent workflow builders',
    count: 10,
    href: '/components/ai-ops',
  },
  {
    title: 'Internal Tools',
    description: 'CRUD panels, approval workflows, report builders, notification centers, and system status',
    count: 10,
    href: '/components/internal-tools',
  },
  {
    title: 'CLI & Web Terminal',
    description: 'Terminal emulators, diff viewers, MCP server status, agent chat terminals, and cron editors',
    count: 10,
    href: '/components/cli-web',
  },
  {
    title: 'Collaboration & Social',
    description: 'Comment threads, @mentions, presence indicators, reactions, polls, and collaborative editing',
    count: 10,
    href: '/components/collaboration',
  },
  {
    title: 'Media & File Management',
    description: 'Image croppers, video players, file browsers, media grids, and upload progress tracking',
    count: 10,
    href: '/components/media',
  },
  {
    title: 'Scheduling & Calendar',
    description: 'Month calendars, week planners, availability pickers, countdown timers, and Gantt rows',
    count: 10,
    href: '/components/scheduling',
  },
  {
    title: 'Maps & Location',
    description: 'Location pickers, address autocomplete, delivery trackers, geofence editors, and ETA cards',
    count: 10,
    href: '/components/maps',
  },
  {
    title: 'Messaging & Notifications',
    description: 'Inbox panels, email composers, SMS previews, broadcast tools, and notification preferences',
    count: 10,
    href: '/components/messaging',
  },
]

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      {/* Hero */}
      <div className="mb-16">
        <p className="mb-2 text-sm font-medium text-primary">
          Premium UI Blocks
        </p>
        <h1 className="mb-4 text-4xl font-semibold tracking-tight text-foreground">
          Blocks Categories
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Premium UI Blocks are based on real-world situations. Find inspiration
          for your next dashboard by using our carefully crafted blocks.
          200 components, 55 themes, full MCP protocol support.
        </p>
      </div>

      {/* Category Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <a
            key={cat.title}
            href={cat.href}
            className="group rounded-lg border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-card-foreground">
                {cat.title}
              </h2>
              <span className="text-sm text-muted-foreground">
                {cat.count} blocks
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {cat.description}
            </p>
            <div className="mt-4 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
              View components →
            </div>
          </a>
        ))}
      </div>

      {/* Getting Started */}
      <div className="mt-20 rounded-lg border border-border bg-card p-8">
        <h2 className="mb-4 text-2xl font-semibold text-card-foreground">
          Getting Started
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-2 font-medium text-card-foreground">
              Install via CLI
            </h3>
            <div className="rounded-md bg-muted p-4 font-mono text-sm text-muted-foreground">
              npx premiumui add kpi-stat-card
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-medium text-card-foreground">
              Install via NPM
            </h3>
            <div className="rounded-md bg-muted p-4 font-mono text-sm text-muted-foreground">
              npm install @premiumui/core
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-medium text-card-foreground">
              Apply a Theme
            </h3>
            <div className="rounded-md bg-muted p-4 font-mono text-sm text-muted-foreground">
              {'<html data-theme="ocean" class="dark">'}
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-medium text-card-foreground">
              MCP Server
            </h3>
            <div className="rounded-md bg-muted p-4 font-mono text-sm text-muted-foreground">
              npx premiumui-mcp
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 border-t border-border pt-8">
        <div className="grid gap-8 text-sm sm:grid-cols-5 lg:grid-cols-5">
          <div>
            <h4 className="mb-3 font-semibold text-foreground">Charts & Analytics</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>Area Charts</li>
              <li>Bar Charts</li>
              <li>Donut Charts</li>
              <li>KPI Cards</li>
              <li>Spark Charts</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-foreground">Developer Tools</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>API Playground</li>
              <li>Log Viewer</li>
              <li>JSON Inspector</li>
              <li>Deployment Pipeline</li>
              <li>Feature Flags</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-foreground">AI & LLM Ops</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>LLM Playground</li>
              <li>Prompt Editor</li>
              <li>Agent Workflow</li>
              <li>Vector Search</li>
              <li>Cost Tracker</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-foreground">SaaS & Internal</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>Subscription Manager</li>
              <li>Team Management</li>
              <li>Permissions Matrix</li>
              <li>CRUD Panels</li>
              <li>Approval Workflows</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-foreground">CLI & Terminal</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>Terminal Emulator</li>
              <li>Diff Viewer</li>
              <li>MCP Server Status</li>
              <li>Agent Chat</li>
              <li>Cron Editor</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-foreground">Collaboration</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>Comment Thread</li>
              <li>Mention Input</li>
              <li>Reaction Picker</li>
              <li>Voting Poll</li>
              <li>Live Badge</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-foreground">Media & Files</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>Image Cropper</li>
              <li>Video Player</li>
              <li>File Browser</li>
              <li>Media Grid</li>
              <li>Audio Waveform</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-foreground">Scheduling</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>Month Calendar</li>
              <li>Week Planner</li>
              <li>Countdown Timer</li>
              <li>Gantt Row</li>
              <li>Availability Picker</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-foreground">Maps & Messaging</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>Location Picker</li>
              <li>Delivery Tracker</li>
              <li>Inbox Panel</li>
              <li>Email Composer</li>
              <li>ETA Card</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 flex items-center justify-between border-t border-border pt-6 text-sm text-muted-foreground">
          <p>© 2026 Premium UI. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Changelog</span>
            <span>License</span>
            <span>Support</span>
            <span>Imprint</span>
            <span>Privacy</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
