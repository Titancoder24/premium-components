/** MCP component manifest definition */
export interface ComponentManifest {
  /** Unique component identifier like "dashboard.kpi-stat-card" */
  id: string
  /** Human-readable name */
  name: string
  /** Category grouping */
  category: string
  /** Natural language description optimized for LLM comprehension */
  description: string
  /** Component props specification */
  props: PropSpec[]
  /** Available variants */
  variants: string[]
  /** Animation presets used */
  animations: string[]
  /** Related component IDs for composition */
  composedWith: string[]
  /** Minimal usage example */
  example: string
  /** Import path */
  importPath: string
}

/** Property specification */
export interface PropSpec {
  name: string
  type: string
  required: boolean
  default?: string
  description: string
}

/** All component manifests */
export const manifests: ComponentManifest[] = [
  // ─── Dashboard & Analytics ────────────────────────────────
  {
    id: 'dashboard.kpi-stat-card',
    name: 'KPI Stat Card',
    category: 'Dashboard & Analytics',
    description:
      'A single KPI metric card showing value, label, trend percentage, and optional sparkline. Use in grids of 3-6 for dashboard overviews. Commonly composed with KPI Grid as its container.',
    props: [
      { name: 'value', type: 'string | number', required: true, description: 'The main metric value to display' },
      { name: 'label', type: 'string', required: true, description: 'Descriptive label for the metric' },
      { name: 'trend', type: 'number', required: false, description: 'Percentage change trend' },
      { name: 'trendDirection', type: "'up' | 'down' | 'neutral'", required: false, default: "'neutral'", description: 'Direction of the trend' },
      { name: 'icon', type: 'ReactNode', required: false, description: 'Optional icon displayed in the card' },
      { name: 'sparklineData', type: 'number[]', required: false, description: 'Data points for mini sparkline chart' },
      { name: 'loading', type: 'boolean', required: false, default: 'false', description: 'Show skeleton loading state' },
    ],
    variants: ['default', 'compact', 'highlighted'],
    animations: ['fadeUp', 'numberCountUp', 'hoverLift', 'sparklineDraw'],
    composedWith: ['dashboard.kpi-grid'],
    example: `<KpiStatCard value="$48,352" label="Revenue" trend={12.5} trendDirection="up" />`,
    importPath: '@premiumui/core/components/dashboard',
  },
  {
    id: 'dashboard.kpi-grid',
    name: 'KPI Grid',
    category: 'Dashboard & Analytics',
    description:
      'Responsive grid of KPI stat cards with staggered entrance animations. Drop in 3-6 KPI cards for dashboard hero sections.',
    props: [
      { name: 'cards', type: 'KpiStatCardProps[]', required: true, description: 'Array of KPI card configurations' },
      { name: 'columns', type: "2 | 3 | 4 | 'auto'", required: false, default: "'auto'", description: 'Number of grid columns' },
      { name: 'loading', type: 'boolean', required: false, default: 'false', description: 'Show skeleton loading state for all cards' },
    ],
    variants: ['default', 'compact', 'full-width'],
    animations: ['staggeredFadeUp'],
    composedWith: ['dashboard.kpi-stat-card'],
    example: `<KpiGrid cards={[{ value: "$48K", label: "Revenue", trend: 12 }]} columns={4} />`,
    importPath: '@premiumui/core/components/dashboard',
  },
  {
    id: 'dashboard.revenue-chart',
    name: 'Revenue Chart Block',
    category: 'Dashboard & Analytics',
    description:
      'Time-series area/line chart with date range selector and metric toggles. Primary chart for revenue, user growth, or any time-series dashboard data.',
    props: [
      { name: 'data', type: 'Array<Record<string, unknown>>', required: true, description: 'Chart data with date and metric fields' },
      { name: 'metrics', type: '{key: string, label: string, color?: string}[]', required: true, description: 'Metric configurations' },
      { name: 'chartType', type: "'area' | 'line'", required: false, default: "'area'", description: 'Chart visualization type' },
      { name: 'loading', type: 'boolean', required: false, default: 'false', description: 'Show loading state' },
    ],
    variants: ['default', 'minimal', 'comparison'],
    animations: ['chartDraw', 'tooltipFollow', 'dataTransition'],
    composedWith: ['dashboard.dashboard-shell'],
    example: `<RevenueChart data={data} metrics={[{ key: "revenue", label: "Revenue" }]} />`,
    importPath: '@premiumui/core/components/dashboard',
  },
  {
    id: 'dashboard.bar-chart',
    name: 'Bar Chart Block',
    category: 'Dashboard & Analytics',
    description:
      'Categorical bar chart supporting vertical, horizontal, grouped, and stacked layouts.',
    props: [
      { name: 'data', type: '{category: string, value: number}[]', required: true, description: 'Chart data' },
      { name: 'orientation', type: "'vertical' | 'horizontal'", required: false, default: "'vertical'", description: 'Bar orientation' },
      { name: 'loading', type: 'boolean', required: false, default: 'false', description: 'Loading state' },
    ],
    variants: ['default', 'grouped', 'stacked'],
    animations: ['barGrow', 'hoverBrighten'],
    composedWith: ['dashboard.dashboard-shell'],
    example: `<BarChartBlock data={[{ category: "Q1", value: 4000 }]} />`,
    importPath: '@premiumui/core/components/dashboard',
  },
  {
    id: 'dashboard.donut-chart',
    name: 'Donut Chart Block',
    category: 'Dashboard & Analytics',
    description:
      'Donut/pie chart with animated draw, center statistic, and interactive legend.',
    props: [
      { name: 'data', type: '{label: string, value: number, color?: string}[]', required: true, description: 'Segment data' },
      { name: 'centerLabel', type: 'string', required: false, description: 'Center text label' },
      { name: 'centerValue', type: 'string | number', required: false, description: 'Center metric value' },
      { name: 'loading', type: 'boolean', required: false, default: 'false', description: 'Loading state' },
    ],
    variants: ['default'],
    animations: ['segmentDraw', 'centerCountUp', 'hoverExpand'],
    composedWith: ['dashboard.dashboard-shell'],
    example: `<DonutChartBlock data={[{ label: "Desktop", value: 60 }]} centerValue="75%" />`,
    importPath: '@premiumui/core/components/dashboard',
  },
  {
    id: 'dashboard.activity-feed',
    name: 'Activity Feed',
    category: 'Dashboard & Analytics',
    description:
      'Real-time activity timeline showing user actions, system events, and alerts. Use in dashboard sidebars or dedicated activity pages.',
    props: [
      { name: 'activities', type: 'Activity[]', required: true, description: 'Array of activity items' },
      { name: 'maxItems', type: 'number', required: false, default: '20', description: 'Maximum items to display' },
    ],
    variants: ['default'],
    animations: ['staggerFadeIn', 'newItemSlide'],
    composedWith: ['dashboard.dashboard-shell'],
    example: `<ActivityFeed activities={activities} maxItems={10} />`,
    importPath: '@premiumui/core/components/dashboard',
  },
  {
    id: 'dashboard.dashboard-shell',
    name: 'Dashboard Shell',
    category: 'Dashboard & Analytics',
    description:
      'Complete dashboard page layout with collapsible sidebar, top bar with search and notifications, and main content area. The shell that all other dashboard components live inside.',
    props: [
      { name: 'sidebarItems', type: 'NavItem[]', required: true, description: 'Navigation items for the sidebar' },
      { name: 'user', type: '{name: string, avatar: string, email: string}', required: true, description: 'Current user info' },
      { name: 'children', type: 'ReactNode', required: true, description: 'Main content area' },
      { name: 'defaultCollapsed', type: 'boolean', required: false, default: 'false', description: 'Start with sidebar collapsed' },
    ],
    variants: ['default'],
    animations: ['sidebarCollapse', 'contentAdjust', 'mobileSlideIn'],
    composedWith: ['dashboard.kpi-grid', 'dashboard.revenue-chart', 'dashboard.activity-feed'],
    example: `<DashboardShell sidebarItems={items} user={user}>{children}</DashboardShell>`,
    importPath: '@premiumui/core/components/dashboard',
  },

  // ─── Data Tables ──────────────────────────────────────────
  {
    id: 'data-tables.data-table',
    name: 'Data Table',
    category: 'Data Tables & Lists',
    description:
      'Production data table with sorting, filtering, pagination, row selection, and column resize. Handles any tabular data display need.',
    props: [
      { name: 'columns', type: 'ColumnDef[]', required: true, description: 'Column configuration array' },
      { name: 'data', type: 'Record<string, unknown>[]', required: true, description: 'Row data array' },
      { name: 'pageSize', type: 'number', required: false, default: '10', description: 'Rows per page' },
      { name: 'selectable', type: 'boolean', required: false, default: 'false', description: 'Enable row selection' },
      { name: 'loading', type: 'boolean', required: false, default: 'false', description: 'Loading state' },
    ],
    variants: ['default', 'compact', 'striped'],
    animations: ['sortIconRotate', 'rowHover', 'pageTransition', 'skeletonShimmer'],
    composedWith: ['data-tables.expandable-row-table', 'data-tables.editable-table'],
    example: `<DataTable columns={columns} data={data} selectable />`,
    importPath: '@premiumui/core/components/data-tables',
  },
  {
    id: 'data-tables.kanban-board',
    name: 'Kanban Board',
    category: 'Data Tables & Lists',
    description:
      'Multi-column Kanban board with drag-and-drop cards between columns. Use for project management, pipeline views, or any status-based workflows.',
    props: [
      { name: 'columns', type: 'KanbanColumn[]', required: true, description: 'Columns with their cards' },
      { name: 'onCardMove', type: 'function', required: true, description: 'Callback when card is moved' },
    ],
    variants: ['default'],
    animations: ['cardDrag', 'springSettle', 'columnSlide'],
    composedWith: ['dashboard.dashboard-shell'],
    example: `<KanbanBoard columns={columns} onCardMove={handleMove} />`,
    importPath: '@premiumui/core/components/data-tables',
  },

  // ─── Forms ────────────────────────────────────────────────
  {
    id: 'forms.login-form',
    name: 'Login Form',
    category: 'Forms & Inputs',
    description:
      'Complete login form with email/password, social login buttons, forgot password link, and loading/error states.',
    props: [
      { name: 'onSubmit', type: '(data: {email: string, password: string}) => void', required: true, description: 'Form submission handler' },
      { name: 'socialProviders', type: 'string[]', required: false, description: 'Social login providers to show' },
      { name: 'loading', type: 'boolean', required: false, default: 'false', description: 'Loading state' },
      { name: 'error', type: 'string', required: false, description: 'Error message to display' },
    ],
    variants: ['default'],
    animations: ['formFadeUp', 'inputFocusGlow', 'errorShake', 'submitSpinner'],
    composedWith: ['auth.social-auth-buttons', 'forms.otp-input'],
    example: `<LoginForm onSubmit={handleLogin} socialProviders={["google", "github"]} />`,
    importPath: '@premiumui/core/components/forms',
  },
  {
    id: 'forms.multi-step-form',
    name: 'Multi-Step Form Wizard',
    category: 'Forms & Inputs',
    description:
      'Multi-step form wizard with animated step transitions and progress tracking. Use for onboarding, checkout, or any complex multi-part form.',
    props: [
      { name: 'steps', type: 'FormStep[]', required: true, description: 'Array of form steps' },
      { name: 'onComplete', type: 'function', required: true, description: 'Called when all steps are done' },
    ],
    variants: ['default'],
    animations: ['stepSlide', 'progressFill', 'checkmarkScale'],
    composedWith: ['navigation.stepper-navigation'],
    example: `<MultiStepForm steps={steps} onComplete={handleComplete} />`,
    importPath: '@premiumui/core/components/forms',
  },
  {
    id: 'forms.payment-form',
    name: 'Payment Form',
    category: 'Forms & Inputs',
    description:
      'Credit card payment form with live card preview, auto-formatting, card type detection, and 3D card flip for CVV.',
    props: [
      { name: 'onSubmit', type: 'function', required: true, description: 'Payment submission handler' },
      { name: 'showCardPreview', type: 'boolean', required: false, default: 'true', description: 'Show visual card preview' },
      { name: 'loading', type: 'boolean', required: false, default: 'false', description: 'Processing state' },
    ],
    variants: ['default'],
    animations: ['cardTypeDetect', 'cardFlip3D', 'submitProcessing'],
    composedWith: ['ecommerce.checkout-summary'],
    example: `<PaymentForm onSubmit={handlePayment} />`,
    importPath: '@premiumui/core/components/forms',
  },

  // ─── Navigation ───────────────────────────────────────────
  {
    id: 'navigation.collapsible-sidebar',
    name: 'Collapsible Sidebar',
    category: 'Navigation & Layout',
    description:
      'Full-height collapsible sidebar navigation with nested groups, active state indicator, user section, and smooth collapse/expand animation.',
    props: [
      { name: 'items', type: 'NavItem[]', required: true, description: 'Navigation items array' },
      { name: 'collapsed', type: 'boolean', required: false, default: 'false', description: 'Collapsed state' },
      { name: 'onToggle', type: 'function', required: true, description: 'Toggle collapse callback' },
      { name: 'user', type: '{name, avatar, email}', required: false, description: 'User info for bottom section' },
      { name: 'logo', type: 'ReactNode', required: false, description: 'Logo element' },
    ],
    variants: ['default'],
    animations: ['widthSpring', 'labelFade', 'groupExpand', 'activeIndicatorSlide'],
    composedWith: ['dashboard.dashboard-shell'],
    example: `<CollapsibleSidebar items={navItems} collapsed={false} onToggle={toggle} />`,
    importPath: '@premiumui/core/components/navigation',
  },
  {
    id: 'navigation.command-palette',
    name: 'Command Palette',
    category: 'Navigation & Layout',
    description:
      'Global command palette triggered by keyboard shortcut. Grouped commands with search, keyboard navigation, and shortcut display.',
    props: [
      { name: 'commands', type: 'Command[]', required: true, description: 'Available commands grouped' },
      { name: 'onSelect', type: 'function', required: true, description: 'Command selection handler' },
      { name: 'placeholder', type: 'string', required: false, default: "'Search commands...'", description: 'Search placeholder' },
    ],
    variants: ['default'],
    animations: ['backdropBlur', 'paletteScale', 'resultsCrossfade', 'highlightSlide'],
    composedWith: ['navigation.top-nav-bar'],
    example: `<CommandPalette commands={commands} onSelect={handleSelect} />`,
    importPath: '@premiumui/core/components/navigation',
  },
  {
    id: 'navigation.tab-navigation',
    name: 'Tab Navigation',
    category: 'Navigation & Layout',
    description:
      'Horizontal tabs with animated sliding indicator and smooth content transitions.',
    props: [
      { name: 'tabs', type: 'Tab[]', required: true, description: 'Tab configurations' },
      { name: 'defaultTab', type: 'string', required: false, description: 'Default active tab ID' },
      { name: 'variant', type: "'underline' | 'pill'", required: false, default: "'underline'", description: 'Tab style variant' },
    ],
    variants: ['underline', 'pill'],
    animations: ['indicatorSlide', 'contentTransition'],
    composedWith: [],
    example: `<TabNavigation tabs={tabs} defaultTab="overview" />`,
    importPath: '@premiumui/core/components/navigation',
  },

  // ─── Feedback & Overlays ──────────────────────────────────
  {
    id: 'feedback.toast',
    name: 'Toast Notification',
    category: 'Feedback & Overlays',
    description:
      'Stackable toast notifications with auto-dismiss, swipe to dismiss, and progress indicator. Comes with useToast hook for imperative triggering.',
    props: [
      { name: 'title', type: 'string', required: true, description: 'Toast title' },
      { name: 'description', type: 'string', required: false, description: 'Toast description' },
      { name: 'variant', type: "'success' | 'error' | 'warning' | 'info'", required: false, default: "'info'", description: 'Toast style variant' },
      { name: 'duration', type: 'number', required: false, default: '5000', description: 'Auto-dismiss duration in ms' },
    ],
    variants: ['success', 'error', 'warning', 'info'],
    animations: ['slideIn', 'stackPush', 'slideOutDismiss', 'progressShrink'],
    composedWith: [],
    example: `const { toast } = useToast()\ntoast({ title: "Saved", variant: "success" })`,
    importPath: '@premiumui/core/components/feedback',
  },
  {
    id: 'feedback.modal-dialog',
    name: 'Modal Dialog',
    category: 'Feedback & Overlays',
    description:
      'Centered modal dialog with backdrop blur, multiple sizes, and smooth scale/fade animation.',
    props: [
      { name: 'open', type: 'boolean', required: true, description: 'Whether modal is open' },
      { name: 'onClose', type: 'function', required: true, description: 'Close handler' },
      { name: 'title', type: 'string', required: true, description: 'Modal title' },
      { name: 'children', type: 'ReactNode', required: true, description: 'Modal content' },
      { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl' | 'full'", required: false, default: "'md'", description: 'Modal size' },
    ],
    variants: ['default'],
    animations: ['backdropBlurFade', 'modalScaleSpring', 'focusTrap'],
    composedWith: ['feedback.confirmation-dialog'],
    example: `<ModalDialog open={isOpen} onClose={close} title="Edit">content</ModalDialog>`,
    importPath: '@premiumui/core/components/feedback',
  },

  // ─── Cards & Content ──────────────────────────────────────
  {
    id: 'cards.pricing-table',
    name: 'Pricing Table',
    category: 'Cards & Content',
    description:
      'Full pricing section with monthly/annual toggle and animated price transitions across all plan cards.',
    props: [
      { name: 'plans', type: 'PricingPlan[]', required: true, description: 'Array of pricing plans' },
      { name: 'defaultPeriod', type: "'monthly' | 'annually'", required: false, default: "'monthly'", description: 'Default billing period' },
    ],
    variants: ['default'],
    animations: ['periodToggle', 'priceAnimate', 'cardStagger'],
    composedWith: ['cards.pricing-card'],
    example: `<PricingTable plans={plans} />`,
    importPath: '@premiumui/core/components/cards',
  },
  {
    id: 'cards.product-card',
    name: 'Product Card',
    category: 'Cards & Content',
    description:
      'E-commerce product card with image hover swap, quick view, and animated add-to-cart.',
    props: [
      { name: 'images', type: 'string[]', required: true, description: 'Product image URLs' },
      { name: 'name', type: 'string', required: true, description: 'Product name' },
      { name: 'price', type: 'number', required: true, description: 'Product price' },
      { name: 'onAddToCart', type: 'function', required: false, description: 'Add to cart handler' },
    ],
    variants: ['default'],
    animations: ['imageSwap', 'quickViewFade', 'addToCartCheck'],
    composedWith: ['ecommerce.shopping-cart-drawer', 'ecommerce.product-quick-view'],
    example: `<ProductCard images={["/img.jpg"]} name="Widget" price={29.99} />`,
    importPath: '@premiumui/core/components/cards',
  },

  // ─── AI & LLM Patterns ───────────────────────────────────
  {
    id: 'ai.chat-interface',
    name: 'Chat Interface',
    category: 'AI & LLM Patterns',
    description:
      'Complete chat interface with message list, input, and typing indicator. Foundation for any AI chat experience.',
    props: [
      { name: 'messages', type: 'ChatMessage[]', required: true, description: 'Array of chat messages' },
      { name: 'onSend', type: '(message: string) => void', required: true, description: 'Send message handler' },
      { name: 'loading', type: 'boolean', required: false, default: 'false', description: 'AI thinking state' },
      { name: 'placeholder', type: 'string', required: false, description: 'Input placeholder' },
    ],
    variants: ['default'],
    animations: ['userMessageSlide', 'assistantMessageSlide', 'typingDots', 'smoothScroll'],
    composedWith: ['ai.chat-bubble', 'ai.streaming-text', 'ai.prompt-input-bar'],
    example: `<ChatInterface messages={messages} onSend={handleSend} />`,
    importPath: '@premiumui/core/components/ai',
  },
  {
    id: 'ai.streaming-text',
    name: 'Streaming Text Display',
    category: 'AI & LLM Patterns',
    description:
      'Streaming text renderer that displays AI responses character by character with cursor animation.',
    props: [
      { name: 'text', type: 'string', required: true, description: 'Full or partial text to display' },
      { name: 'isStreaming', type: 'boolean', required: true, description: 'Whether text is still streaming' },
      { name: 'speed', type: 'number', required: false, default: '2', description: 'Characters per frame' },
    ],
    variants: ['default'],
    animations: ['characterAppear', 'cursorBlink', 'cursorFade'],
    composedWith: ['ai.chat-bubble', 'ai.ai-response-card'],
    example: `<StreamingText text={response} isStreaming={true} />`,
    importPath: '@premiumui/core/components/ai',
  },

  // ─── E-Commerce ───────────────────────────────────────────
  {
    id: 'ecommerce.shopping-cart-drawer',
    name: 'Shopping Cart Drawer',
    category: 'E-Commerce',
    description:
      'Slide-over shopping cart with item management, animated quantity/price updates, and checkout CTA.',
    props: [
      { name: 'open', type: 'boolean', required: true, description: 'Whether drawer is open' },
      { name: 'onClose', type: 'function', required: true, description: 'Close handler' },
      { name: 'items', type: 'CartItem[]', required: true, description: 'Cart items' },
      { name: 'subtotal', type: 'number', required: true, description: 'Cart subtotal' },
      { name: 'onCheckout', type: 'function', required: true, description: 'Checkout handler' },
    ],
    variants: ['default'],
    animations: ['drawerSlide', 'itemCollapse', 'priceAnimate', 'emptyStateTransition'],
    composedWith: ['ecommerce.cart-item-row', 'ecommerce.promo-code-input'],
    example: `<ShoppingCartDrawer open={isOpen} onClose={close} items={items} subtotal={99} onCheckout={checkout} />`,
    importPath: '@premiumui/core/components/ecommerce',
  },

  // ─── Auth & Onboarding ───────────────────────────────────
  {
    id: 'auth.onboarding-wizard',
    name: 'Onboarding Wizard',
    category: 'Authentication & Onboarding',
    description:
      'Multi-step onboarding wizard with illustrations, animated transitions, and completion celebration.',
    props: [
      { name: 'steps', type: 'OnboardingStep[]', required: true, description: 'Onboarding step configurations' },
      { name: 'onComplete', type: 'function', required: true, description: 'Completion handler' },
      { name: 'onSkip', type: 'function', required: false, description: 'Skip handler per step' },
    ],
    variants: ['default'],
    animations: ['stepSlide', 'illustrationFloat', 'progressDots', 'celebrationConfetti'],
    composedWith: ['auth.profile-setup-card', 'auth.team-invite-form'],
    example: `<OnboardingWizard steps={steps} onComplete={handleComplete} />`,
    importPath: '@premiumui/core/components/auth',
  },

  // ─── Utility & System ────────────────────────────────────
  {
    id: 'utility.theme-switcher',
    name: 'Theme Switcher',
    category: 'Utility & System',
    description:
      'Theme picker showing 55 color themes in a searchable swatch grid with light/dark mode toggle and animated preview.',
    props: [
      { name: 'currentTheme', type: 'string', required: true, description: 'Current active theme name' },
      { name: 'onThemeChange', type: '(theme: string) => void', required: true, description: 'Theme change handler' },
      { name: 'showMode', type: 'boolean', required: false, default: 'true', description: 'Show light/dark mode toggle' },
    ],
    variants: ['default'],
    animations: ['sunMoonMorph', 'swatchGrid', 'selectedRing'],
    composedWith: [],
    example: `<ThemeSwitcher currentTheme="ocean" onThemeChange={setTheme} />`,
    importPath: '@premiumui/core/components/utility',
  },
  {
    id: 'utility.copy-button',
    name: 'Copy Button',
    category: 'Utility & System',
    description:
      'Copy-to-clipboard button with animated icon morph feedback.',
    props: [
      { name: 'text', type: 'string', required: true, description: 'Text to copy to clipboard' },
      { name: 'label', type: 'string', required: false, description: 'Optional visible label' },
      { name: 'variant', type: "'icon-only' | 'with-text'", required: false, default: "'icon-only'", description: 'Display variant' },
    ],
    variants: ['icon-only', 'with-text'],
    animations: ['iconMorph', 'copiedTooltip'],
    composedWith: [],
    example: `<CopyButton text="npm install @premiumui/core" />`,
    importPath: '@premiumui/core/components/utility',
  },
  {
    id: 'utility.empty-state',
    name: 'Empty State',
    category: 'Utility & System',
    description:
      'Empty state display with icon, message, and call-to-action for when there is no data to show.',
    props: [
      { name: 'icon', type: 'ReactNode', required: false, description: 'Display icon' },
      { name: 'title', type: 'string', required: true, description: 'Empty state title' },
      { name: 'description', type: 'string', required: false, description: 'Description text' },
      { name: 'action', type: '{label: string, onClick: () => void}', required: false, description: 'CTA button configuration' },
    ],
    variants: ['no-data', 'no-results', 'error', 'no-permission'],
    animations: ['iconFloat', 'textFadeUp', 'actionFadeLast'],
    composedWith: ['data-tables.data-table'],
    example: `<EmptyState title="No results" description="Try a different search" />`,
    importPath: '@premiumui/core/components/feedback',
  },
]

/**
 * Search manifests by natural language query.
 * Returns ranked results based on keyword matching.
 */
export function searchManifests(
  query: string,
  maxResults = 10,
): (ComponentManifest & { relevance: number })[] {
  const terms = query.toLowerCase().split(/\s+/)

  const scored = manifests.map((manifest) => {
    const searchText = [
      manifest.name,
      manifest.description,
      manifest.category,
      ...manifest.variants,
      ...manifest.composedWith,
    ]
      .join(' ')
      .toLowerCase()

    let score = 0
    for (const term of terms) {
      if (manifest.name.toLowerCase().includes(term)) score += 3
      if (manifest.category.toLowerCase().includes(term)) score += 2
      if (manifest.description.toLowerCase().includes(term)) score += 1
      if (searchText.includes(term)) score += 0.5
    }

    return { ...manifest, relevance: score / terms.length }
  })

  return scored
    .filter((m) => m.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, maxResults)
}

/**
 * Get a manifest by ID.
 */
export function getManifestById(
  id: string,
): ComponentManifest | undefined {
  return manifests.find((m) => m.id === id)
}

/**
 * Get all manifests in a category.
 */
export function getManifestsByCategory(
  category: string,
): ComponentManifest[] {
  return manifests.filter(
    (m) => m.category.toLowerCase() === category.toLowerCase(),
  )
}
