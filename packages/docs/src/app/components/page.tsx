import Link from 'next/link'

const allComponents = [
  // Dashboard & Analytics
  { id: 'kpi-stat-card', name: 'KPI Stat Card', category: 'Dashboard & Analytics', blocks: 3, updated: true },
  { id: 'kpi-grid', name: 'KPI Grid', category: 'Dashboard & Analytics', blocks: 2 },
  { id: 'revenue-chart', name: 'Revenue Chart', category: 'Dashboard & Analytics', blocks: 3 },
  { id: 'bar-chart', name: 'Bar Chart', category: 'Dashboard & Analytics', blocks: 2 },
  { id: 'donut-chart', name: 'Donut Chart', category: 'Dashboard & Analytics', blocks: 2 },
  { id: 'activity-feed', name: 'Activity Feed', category: 'Dashboard & Analytics', blocks: 2 },
  { id: 'mini-sparkline', name: 'Mini Sparkline Row', category: 'Dashboard & Analytics', blocks: 1 },
  { id: 'metric-comparison', name: 'Metric Comparison Card', category: 'Dashboard & Analytics', blocks: 2 },
  { id: 'goal-progress', name: 'Goal Progress Card', category: 'Dashboard & Analytics', blocks: 2 },
  { id: 'heatmap-calendar', name: 'Heatmap Calendar', category: 'Dashboard & Analytics', blocks: 1 },
  { id: 'real-time-counter', name: 'Real-Time Counter', category: 'Dashboard & Analytics', blocks: 1 },
  { id: 'dashboard-shell', name: 'Dashboard Shell', category: 'Dashboard & Analytics', blocks: 1 },

  // Data Tables & Lists
  { id: 'data-table', name: 'Data Table', category: 'Data Tables & Lists', blocks: 5, updated: true },
  { id: 'expandable-table', name: 'Expandable Row Table', category: 'Data Tables & Lists', blocks: 2 },
  { id: 'editable-table', name: 'Editable Table', category: 'Data Tables & Lists', blocks: 2 },
  { id: 'card-list-view', name: 'Card List View', category: 'Data Tables & Lists', blocks: 2 },
  { id: 'sortable-list', name: 'Sortable Draggable List', category: 'Data Tables & Lists', blocks: 1 },
  { id: 'virtual-list', name: 'Virtual Scrolling List', category: 'Data Tables & Lists', blocks: 1 },
  { id: 'kanban-board', name: 'Kanban Board', category: 'Data Tables & Lists', blocks: 2 },
  { id: 'timeline-list', name: 'Timeline List', category: 'Data Tables & Lists', blocks: 2 },
  { id: 'nested-tree', name: 'Nested Tree List', category: 'Data Tables & Lists', blocks: 1 },
  { id: 'command-palette-list', name: 'Command Palette List', category: 'Data Tables & Lists', blocks: 1 },

  // Forms & Inputs
  { id: 'login-form', name: 'Login Form', category: 'Forms & Inputs', blocks: 3 },
  { id: 'registration-form', name: 'Registration Form', category: 'Forms & Inputs', blocks: 2 },
  { id: 'multi-step-form', name: 'Multi-Step Form Wizard', category: 'Forms & Inputs', blocks: 2 },
  { id: 'settings-form', name: 'Settings Form', category: 'Forms & Inputs', blocks: 2 },
  { id: 'search-input', name: 'Search Input', category: 'Forms & Inputs', blocks: 2 },
  { id: 'date-range-picker', name: 'Date Range Picker', category: 'Forms & Inputs', blocks: 2 },
  { id: 'file-upload', name: 'File Upload Zone', category: 'Forms & Inputs', blocks: 2, updated: true },
  { id: 'payment-form', name: 'Payment Form', category: 'Forms & Inputs', blocks: 2 },
  { id: 'address-form', name: 'Address Form', category: 'Forms & Inputs', blocks: 1 },
  { id: 'inline-edit', name: 'Inline Edit Field', category: 'Forms & Inputs', blocks: 1 },
  { id: 'tag-multi-select', name: 'Tag Multi-Select', category: 'Forms & Inputs', blocks: 2 },
  { id: 'otp-input', name: 'OTP Input', category: 'Forms & Inputs', blocks: 1 },

  // Navigation
  { id: 'collapsible-sidebar', name: 'Collapsible Sidebar', category: 'Navigation & Layout', blocks: 2 },
  { id: 'top-nav-bar', name: 'Top Navigation Bar', category: 'Navigation & Layout', blocks: 2 },
  { id: 'breadcrumb-trail', name: 'Breadcrumb Trail', category: 'Navigation & Layout', blocks: 1 },
  { id: 'tab-navigation', name: 'Tab Navigation', category: 'Navigation & Layout', blocks: 3 },
  { id: 'command-palette', name: 'Command Palette', category: 'Navigation & Layout', blocks: 2 },
  { id: 'mobile-bottom-nav', name: 'Mobile Bottom Nav', category: 'Navigation & Layout', blocks: 1 },
  { id: 'mega-menu', name: 'Mega Menu', category: 'Navigation & Layout', blocks: 1 },
  { id: 'page-transition', name: 'Page Transition', category: 'Navigation & Layout', blocks: 1 },
  { id: 'floating-action-menu', name: 'Floating Action Menu', category: 'Navigation & Layout', blocks: 1 },
  { id: 'stepper-navigation', name: 'Stepper Navigation', category: 'Navigation & Layout', blocks: 2 },

  // Feedback
  { id: 'toast', name: 'Toast Notification', category: 'Feedback & Overlays', blocks: 4 },
  { id: 'modal-dialog', name: 'Modal Dialog', category: 'Feedback & Overlays', blocks: 3 },
  { id: 'slide-over', name: 'Slide-Over Panel', category: 'Feedback & Overlays', blocks: 2 },
  { id: 'confirmation-dialog', name: 'Confirmation Dialog', category: 'Feedback & Overlays', blocks: 2 },
  { id: 'tooltip', name: 'Tooltip', category: 'Feedback & Overlays', blocks: 2 },
  { id: 'popover', name: 'Popover', category: 'Feedback & Overlays', blocks: 2 },
  { id: 'alert-banner', name: 'Alert Banner', category: 'Feedback & Overlays', blocks: 3 },
  { id: 'skeleton-loader', name: 'Skeleton Loader', category: 'Feedback & Overlays', blocks: 4 },
  { id: 'empty-state', name: 'Empty State', category: 'Feedback & Overlays', blocks: 4 },
  { id: 'progress-indicator', name: 'Progress Indicator', category: 'Feedback & Overlays', blocks: 3 },

  // Cards
  { id: 'pricing-card', name: 'Pricing Card', category: 'Cards & Content', blocks: 2 },
  { id: 'pricing-table', name: 'Pricing Table', category: 'Cards & Content', blocks: 2 },
  { id: 'testimonial-card', name: 'Testimonial Card', category: 'Cards & Content', blocks: 2 },
  { id: 'feature-card', name: 'Feature Card', category: 'Cards & Content', blocks: 3, updated: true },
  { id: 'blog-card', name: 'Blog Card', category: 'Cards & Content', blocks: 2 },
  { id: 'user-profile-card', name: 'User Profile Card', category: 'Cards & Content', blocks: 2 },
  { id: 'product-card', name: 'Product Card', category: 'Cards & Content', blocks: 3 },
  { id: 'notification-card', name: 'Notification Card', category: 'Cards & Content', blocks: 2 },
  { id: 'stat-card', name: 'Stat Card', category: 'Cards & Content', blocks: 2 },
  { id: 'cta-banner', name: 'CTA Banner Card', category: 'Cards & Content', blocks: 2 },

  // AI
  { id: 'chat-interface', name: 'Chat Interface', category: 'AI & LLM Patterns', blocks: 3 },
  { id: 'chat-bubble', name: 'Chat Bubble', category: 'AI & LLM Patterns', blocks: 2 },
  { id: 'streaming-text', name: 'Streaming Text', category: 'AI & LLM Patterns', blocks: 1 },
  { id: 'prompt-input', name: 'Prompt Input Bar', category: 'AI & LLM Patterns', blocks: 2 },
  { id: 'ai-response', name: 'AI Response Card', category: 'AI & LLM Patterns', blocks: 2 },
  { id: 'rag-citations', name: 'RAG Source Citations', category: 'AI & LLM Patterns', blocks: 1 },
  { id: 'agent-status', name: 'Agent Status Card', category: 'AI & LLM Patterns', blocks: 2 },
  { id: 'model-selector', name: 'Model Selector', category: 'AI & LLM Patterns', blocks: 1 },
  { id: 'token-usage', name: 'Token Usage Meter', category: 'AI & LLM Patterns', blocks: 1 },
  { id: 'knowledge-base', name: 'Knowledge Base List', category: 'AI & LLM Patterns', blocks: 1 },

  // E-Commerce
  { id: 'shopping-cart', name: 'Shopping Cart Drawer', category: 'E-Commerce', blocks: 2 },
  { id: 'quick-view', name: 'Product Quick View', category: 'E-Commerce', blocks: 1 },
  { id: 'checkout-summary', name: 'Checkout Summary', category: 'E-Commerce', blocks: 2 },
  { id: 'image-gallery', name: 'Product Image Gallery', category: 'E-Commerce', blocks: 2 },
  { id: 'review-block', name: 'Review Block', category: 'E-Commerce', blocks: 2 },
  { id: 'cart-item', name: 'Cart Item Row', category: 'E-Commerce', blocks: 1 },
  { id: 'wishlist-grid', name: 'Wishlist Grid', category: 'E-Commerce', blocks: 1 },
  { id: 'promo-code', name: 'Promo Code Input', category: 'E-Commerce', blocks: 1 },

  // Auth
  { id: 'social-auth', name: 'Social Auth Buttons', category: 'Auth & Onboarding', blocks: 2 },
  { id: 'two-factor', name: 'Two-Factor Auth', category: 'Auth & Onboarding', blocks: 2 },
  { id: 'onboarding', name: 'Onboarding Wizard', category: 'Auth & Onboarding', blocks: 2 },
  { id: 'password-reset', name: 'Password Reset Flow', category: 'Auth & Onboarding', blocks: 2 },
  { id: 'team-invite', name: 'Team Invite Form', category: 'Auth & Onboarding', blocks: 1 },
  { id: 'profile-setup', name: 'Profile Setup Card', category: 'Auth & Onboarding', blocks: 1 },

  // Utility
  { id: 'theme-switcher', name: 'Theme Switcher', category: 'Utility & System', blocks: 1 },
  { id: 'keyboard-shortcuts', name: 'Keyboard Shortcuts', category: 'Utility & System', blocks: 1 },
  { id: 'changelog-modal', name: 'Changelog Modal', category: 'Utility & System', blocks: 1 },
  { id: 'cookie-consent', name: 'Cookie Consent Banner', category: 'Utility & System', blocks: 1 },
  { id: 'feedback-widget', name: 'Feedback Widget', category: 'Utility & System', blocks: 1 },
  { id: 'copy-button', name: 'Copy Button', category: 'Utility & System', blocks: 2 },
  { id: 'avatar-group', name: 'Avatar Group', category: 'Utility & System', blocks: 2 },
  { id: 'tag-collection', name: 'Tag Collection', category: 'Utility & System', blocks: 2 },
  { id: 'announcement-bar', name: 'Announcement Bar', category: 'Utility & System', blocks: 1 },
  { id: 'error-page', name: 'Error Page', category: 'Utility & System', blocks: 2 },
  { id: 'maintenance-page', name: 'Maintenance Page', category: 'Utility & System', blocks: 1 },
  { id: 'integrations-grid', name: 'Integrations Grid', category: 'Utility & System', blocks: 1 },
]

export default function ComponentsPage() {
  const categories = [...new Set(allComponents.map((c) => c.category))]

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-12">
        <p className="mb-2 text-sm font-medium text-primary">All Components</p>
        <h1 className="mb-4 text-3xl font-semibold tracking-tight">
          100 Premium Blocks
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Browse all components organized by category. Each block includes
          Framer Motion animations, full TypeScript types, theme support,
          and MCP manifest for AI agents.
        </p>
      </div>

      {categories.map((category) => (
        <section key={category} className="mb-12">
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            {category}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allComponents
              .filter((c) => c.category === category)
              .map((comp) => (
                <Link
                  key={comp.id}
                  href={`/components/${comp.id}`}
                  className="group relative rounded-lg border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  {comp.updated && (
                    <span className="absolute -top-2 left-4 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                      UPDATED
                    </span>
                  )}
                  <div className="mb-3 h-24 rounded-md bg-muted" />
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-card-foreground group-hover:text-primary">
                      {comp.name}
                    </h3>
                    <span className="text-xs text-muted-foreground">→</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {comp.blocks} {comp.blocks === 1 ? 'block' : 'blocks'}
                  </p>
                </Link>
              ))}
          </div>
        </section>
      ))}
    </main>
  )
}
