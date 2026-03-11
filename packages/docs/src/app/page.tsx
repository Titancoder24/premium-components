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
          100 components, 55 themes, full MCP protocol support.
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
        <div className="grid gap-8 text-sm sm:grid-cols-5">
          <div>
            <h4 className="mb-3 font-semibold text-foreground">Charts & Helpers</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>Area Charts</li>
              <li>Line Charts</li>
              <li>Bar Charts</li>
              <li>Donut Charts</li>
              <li>Chart Tooltips</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-foreground">Advanced Visualizations</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>Bar Lists</li>
              <li>Status Monitoring</li>
              <li>Spark Charts</li>
              <li>KPI Cards</li>
              <li>Chart Compositions</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-foreground">Inputs & Forms</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>Standard Forms</li>
              <li>File Uploads</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-foreground">Tables</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>Standard Tables</li>
              <li>Table Actions</li>
              <li>Table Pagination</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-foreground">Layout & Forms</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>Page Shells</li>
              <li>Filterbar</li>
              <li>Empty States</li>
              <li>Dialogs</li>
              <li>Grid Lists</li>
              <li>Banner</li>
              <li>Badges</li>
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
