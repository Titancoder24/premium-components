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

  // Developer Tools
  { id: 'api-key-manager', name: 'API Key Manager', category: 'Developer Tools', blocks: 2, updated: true },
  { id: 'webhook-tester', name: 'Webhook Tester', category: 'Developer Tools', blocks: 2 },
  { id: 'environment-variable-editor', name: 'Environment Variable Editor', category: 'Developer Tools', blocks: 2 },
  { id: 'log-viewer', name: 'Log Viewer', category: 'Developer Tools', blocks: 2 },
  { id: 'json-inspector', name: 'JSON Inspector', category: 'Developer Tools', blocks: 2 },
  { id: 'api-playground', name: 'API Playground', category: 'Developer Tools', blocks: 3, updated: true },
  { id: 'deployment-pipeline', name: 'Deployment Pipeline', category: 'Developer Tools', blocks: 2 },
  { id: 'schema-visualizer', name: 'Schema Visualizer', category: 'Developer Tools', blocks: 2 },
  { id: 'code-snippet-block', name: 'Code Snippet Block', category: 'Developer Tools', blocks: 2 },
  { id: 'feature-flag-panel', name: 'Feature Flag Panel', category: 'Developer Tools', blocks: 2 },

  // SaaS Platform
  { id: 'subscription-manager', name: 'Subscription Manager', category: 'SaaS Platform', blocks: 3, updated: true },
  { id: 'usage-billing-dashboard', name: 'Usage Billing Dashboard', category: 'SaaS Platform', blocks: 3 },
  { id: 'team-management-panel', name: 'Team Management Panel', category: 'SaaS Platform', blocks: 2 },
  { id: 'audit-log-viewer', name: 'Audit Log Viewer', category: 'SaaS Platform', blocks: 2 },
  { id: 'permissions-matrix', name: 'Permissions Matrix', category: 'SaaS Platform', blocks: 2 },
  { id: 'onboarding-checklist', name: 'Onboarding Checklist', category: 'SaaS Platform', blocks: 2 },
  { id: 'tenant-switcher', name: 'Tenant Switcher', category: 'SaaS Platform', blocks: 1 },
  { id: 'quota-usage-card', name: 'Quota Usage Card', category: 'SaaS Platform', blocks: 2 },
  { id: 'customer-health-score', name: 'Customer Health Score', category: 'SaaS Platform', blocks: 2 },
  { id: 'changelog-timeline', name: 'Changelog Timeline', category: 'SaaS Platform', blocks: 2 },

  // AI Ops
  { id: 'llm-playground', name: 'LLM Playground', category: 'AI Ops', blocks: 3, updated: true },
  { id: 'prompt-template-editor', name: 'Prompt Template Editor', category: 'AI Ops', blocks: 2 },
  { id: 'evaluation-results-table', name: 'Evaluation Results Table', category: 'AI Ops', blocks: 2 },
  { id: 'vector-search-explorer', name: 'Vector Search Explorer', category: 'AI Ops', blocks: 2 },
  { id: 'agent-workflow-builder', name: 'Agent Workflow Builder', category: 'AI Ops', blocks: 3, updated: true },
  { id: 'model-comparison-card', name: 'Model Comparison Card', category: 'AI Ops', blocks: 2 },
  { id: 'cost-tracker-dashboard', name: 'Cost Tracker Dashboard', category: 'AI Ops', blocks: 2 },
  { id: 'annotation-labeling-tool', name: 'Annotation Labeling Tool', category: 'AI Ops', blocks: 2 },
  { id: 'guardrail-config-panel', name: 'Guardrail Config Panel', category: 'AI Ops', blocks: 2 },
  { id: 'dataset-browser', name: 'Dataset Browser', category: 'AI Ops', blocks: 2 },

  // Internal Tools
  { id: 'crud-resource-panel', name: 'CRUD Resource Panel', category: 'Internal Tools', blocks: 3, updated: true },
  { id: 'approval-workflow', name: 'Approval Workflow', category: 'Internal Tools', blocks: 2 },
  { id: 'bulk-action-toolbar', name: 'Bulk Action Toolbar', category: 'Internal Tools', blocks: 1 },
  { id: 'report-builder', name: 'Report Builder', category: 'Internal Tools', blocks: 2 },
  { id: 'notification-center', name: 'Notification Center', category: 'Internal Tools', blocks: 2 },
  { id: 'system-status-dashboard', name: 'System Status Dashboard', category: 'Internal Tools', blocks: 2 },
  { id: 'import-export-wizard', name: 'Import/Export Wizard', category: 'Internal Tools', blocks: 3 },
  { id: 'role-based-nav-shell', name: 'Role-Based Nav Shell', category: 'Internal Tools', blocks: 2 },
  { id: 'task-queue-monitor', name: 'Task Queue Monitor', category: 'Internal Tools', blocks: 2 },
  { id: 'configuration-panel', name: 'Configuration Panel', category: 'Internal Tools', blocks: 2 },

  // CLI & Web Terminal
  { id: 'terminal-emulator', name: 'Terminal Emulator', category: 'CLI & Web Terminal', blocks: 2, updated: true },
  { id: 'cli-output-renderer', name: 'CLI Output Renderer', category: 'CLI & Web Terminal', blocks: 2 },
  { id: 'mcp-server-status', name: 'MCP Server Status', category: 'CLI & Web Terminal', blocks: 2 },
  { id: 'agent-chat-terminal', name: 'Agent Chat Terminal', category: 'CLI & Web Terminal', blocks: 2, updated: true },
  { id: 'pipeline-log-stream', name: 'Pipeline Log Stream', category: 'CLI & Web Terminal', blocks: 2 },
  { id: 'command-builder-form', name: 'Command Builder Form', category: 'CLI & Web Terminal', blocks: 2 },
  { id: 'diff-viewer', name: 'Diff Viewer', category: 'CLI & Web Terminal', blocks: 2 },
  { id: 'ssh-connection-manager', name: 'SSH Connection Manager', category: 'CLI & Web Terminal', blocks: 2 },
  { id: 'cron-schedule-editor', name: 'Cron Schedule Editor', category: 'CLI & Web Terminal', blocks: 2 },
  { id: 'webhook-event-log', name: 'Webhook Event Log', category: 'CLI & Web Terminal', blocks: 2 },

  // Collaboration & Social
  { id: 'comment-thread', name: 'Comment Thread', category: 'Collaboration & Social', blocks: 2 },
  { id: 'mention-input', name: 'Mention Input', category: 'Collaboration & Social', blocks: 2 },
  { id: 'presence-indicator', name: 'Presence Indicator', category: 'Collaboration & Social', blocks: 1 },
  { id: 'shared-cursor', name: 'Shared Cursor', category: 'Collaboration & Social', blocks: 1 },
  { id: 'reaction-picker', name: 'Reaction Picker', category: 'Collaboration & Social', blocks: 2 },
  { id: 'activity-timeline', name: 'Activity Timeline', category: 'Collaboration & Social', blocks: 2 },
  { id: 'invite-link-card', name: 'Invite Link Card', category: 'Collaboration & Social', blocks: 2 },
  { id: 'voting-poll', name: 'Voting Poll', category: 'Collaboration & Social', blocks: 2 },
  { id: 'live-badge', name: 'Live Badge', category: 'Collaboration & Social', blocks: 1, updated: true },
  { id: 'collaborative-editor-toolbar', name: 'Collaborative Editor Toolbar', category: 'Collaboration & Social', blocks: 2 },

  // Media & File Management
  { id: 'image-cropper', name: 'Image Cropper', category: 'Media & File Management', blocks: 2, updated: true },
  { id: 'video-player', name: 'Video Player', category: 'Media & File Management', blocks: 3 },
  { id: 'audio-waveform', name: 'Audio Waveform', category: 'Media & File Management', blocks: 2 },
  { id: 'file-browser', name: 'File Browser', category: 'Media & File Management', blocks: 2 },
  { id: 'document-viewer', name: 'Document Viewer', category: 'Media & File Management', blocks: 2 },
  { id: 'media-grid', name: 'Media Grid', category: 'Media & File Management', blocks: 2 },
  { id: 'upload-progress-card', name: 'Upload Progress Card', category: 'Media & File Management', blocks: 2 },
  { id: 'cloud-storage-meter', name: 'Cloud Storage Meter', category: 'Media & File Management', blocks: 2 },
  { id: 'attachment-chip', name: 'Attachment Chip', category: 'Media & File Management', blocks: 1 },
  { id: 'screen-recording-card', name: 'Screen Recording Card', category: 'Media & File Management', blocks: 2 },

  // Scheduling & Calendar
  { id: 'month-calendar', name: 'Month Calendar', category: 'Scheduling & Calendar', blocks: 3 },
  { id: 'week-planner', name: 'Week Planner', category: 'Scheduling & Calendar', blocks: 3 },
  { id: 'event-card', name: 'Event Card', category: 'Scheduling & Calendar', blocks: 2 },
  { id: 'availability-picker', name: 'Availability Picker', category: 'Scheduling & Calendar', blocks: 2 },
  { id: 'timezone-selector', name: 'Timezone Selector', category: 'Scheduling & Calendar', blocks: 2 },
  { id: 'countdown-timer', name: 'Countdown Timer', category: 'Scheduling & Calendar', blocks: 2, updated: true },
  { id: 'booking-confirmation', name: 'Booking Confirmation', category: 'Scheduling & Calendar', blocks: 2 },
  { id: 'recurring-schedule-editor', name: 'Recurring Schedule Editor', category: 'Scheduling & Calendar', blocks: 2 },
  { id: 'gantt-row', name: 'Gantt Row', category: 'Scheduling & Calendar', blocks: 1 },
  { id: 'agenda-list', name: 'Agenda List', category: 'Scheduling & Calendar', blocks: 2 },

  // Maps & Location
  { id: 'location-picker', name: 'Location Picker', category: 'Maps & Location', blocks: 2, updated: true },
  { id: 'address-autocomplete', name: 'Address Autocomplete', category: 'Maps & Location', blocks: 2 },
  { id: 'store-locator-card', name: 'Store Locator Card', category: 'Maps & Location', blocks: 2 },
  { id: 'route-summary', name: 'Route Summary', category: 'Maps & Location', blocks: 2 },
  { id: 'geofence-editor', name: 'Geofence Editor', category: 'Maps & Location', blocks: 2 },
  { id: 'delivery-tracker', name: 'Delivery Tracker', category: 'Maps & Location', blocks: 3 },
  { id: 'heatmap-overlay', name: 'Heatmap Overlay', category: 'Maps & Location', blocks: 2 },
  { id: 'coordinates-display', name: 'Coordinates Display', category: 'Maps & Location', blocks: 1 },
  { id: 'region-selector', name: 'Region Selector', category: 'Maps & Location', blocks: 2 },
  { id: 'eta-card', name: 'ETA Card', category: 'Maps & Location', blocks: 2 },

  // Messaging & Notifications
  { id: 'inbox-panel', name: 'Inbox Panel', category: 'Messaging & Notifications', blocks: 3, updated: true },
  { id: 'push-notification-card', name: 'Push Notification Card', category: 'Messaging & Notifications', blocks: 2 },
  { id: 'email-composer', name: 'Email Composer', category: 'Messaging & Notifications', blocks: 3 },
  { id: 'sms-preview', name: 'SMS Preview', category: 'Messaging & Notifications', blocks: 2 },
  { id: 'notification-preferences', name: 'Notification Preferences', category: 'Messaging & Notifications', blocks: 2 },
  { id: 'message-status-row', name: 'Message Status Row', category: 'Messaging & Notifications', blocks: 1 },
  { id: 'broadcast-composer', name: 'Broadcast Composer', category: 'Messaging & Notifications', blocks: 2 },
  { id: 'unread-badge-stack', name: 'Unread Badge Stack', category: 'Messaging & Notifications', blocks: 2 },
  { id: 'digest-summary-card', name: 'Digest Summary Card', category: 'Messaging & Notifications', blocks: 2 },
  { id: 'webhook-notification-card', name: 'Webhook Notification Card', category: 'Messaging & Notifications', blocks: 2 },
]

export default function ComponentsPage() {
  const categories = [...new Set(allComponents.map((c) => c.category))]

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-12">
        <p className="mb-2 text-sm font-medium text-primary">All Components</p>
        <h1 className="mb-4 text-3xl font-semibold tracking-tight">
          200 Premium Blocks
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
