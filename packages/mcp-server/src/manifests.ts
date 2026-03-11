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

  // ─── Developer Tools ──────────────────────────────────────
  {
    id: 'developer-tools.api-key-manager',
    name: 'API Key Manager',
    category: 'Developer Tools',
    description:
      'Full API key management panel with masked key display, create/revoke flows, copy-to-clipboard with icon morph, and staggered row animations. Use for developer portals and API dashboards.',
    props: [
      { name: 'keys', type: 'ApiKey[]', required: true, description: 'Array of API keys' },
      { name: 'onCreateKey', type: 'function', required: true, description: 'Create key handler' },
      { name: 'onRevokeKey', type: 'function', required: true, description: 'Revoke key handler' },
      { name: 'onCopyKey', type: 'function', required: false, description: 'Copy key handler' },
    ],
    variants: ['default'],
    animations: ['staggerRows', 'copyIconMorph', 'revokeSlideDown', 'newKeyPulse'],
    composedWith: ['utility.copy-button'],
    example: `<ApiKeyManager keys={keys} onCreateKey={handleCreate} onRevokeKey={handleRevoke} />`,
    importPath: '@premiumui/core/components/developer-tools',
  },
  {
    id: 'developer-tools.webhook-tester',
    name: 'Webhook Tester',
    category: 'Developer Tools',
    description:
      'Interactive webhook testing panel with URL input, method selector, headers editor, body editor, and response viewer with status code badges.',
    props: [
      { name: 'defaultUrl', type: 'string', required: false, description: 'Default webhook URL' },
      { name: 'onSend', type: 'function', required: true, description: 'Send request handler' },
      { name: 'history', type: 'RequestHistory[]', required: false, description: 'Request history' },
    ],
    variants: ['default'],
    animations: ['responseSlideIn', 'spinnerRotate', 'headerStagger'],
    composedWith: ['developer-tools.json-inspector'],
    example: `<WebhookTester onSend={handleSend} />`,
    importPath: '@premiumui/core/components/developer-tools',
  },
  {
    id: 'developer-tools.environment-variable-editor',
    name: 'Environment Variable Editor',
    category: 'Developer Tools',
    description:
      'Key-value env var management with secrets masking, environment tabs, drag-to-reorder, and unsaved changes indicator.',
    props: [
      { name: 'variables', type: 'EnvVar[]', required: true, description: 'Environment variables' },
      { name: 'environments', type: 'string[]', required: true, description: 'Available environments' },
      { name: 'activeEnv', type: 'string', required: true, description: 'Active environment' },
      { name: 'onChange', type: 'function', required: true, description: 'Change handler' },
    ],
    variants: ['default'],
    animations: ['rowEnterExit', 'secretToggle', 'layoutReorder', 'unsavedPulse'],
    composedWith: [],
    example: `<EnvironmentVariableEditor variables={vars} environments={["dev","prod"]} activeEnv="dev" onChange={handle} />`,
    importPath: '@premiumui/core/components/developer-tools',
  },
  {
    id: 'developer-tools.log-viewer',
    name: 'Log Viewer',
    category: 'Developer Tools',
    description:
      'Real-time log viewer with level filtering, search highlighting, auto-scroll, expandable log details, and pause/resume controls.',
    props: [
      { name: 'logs', type: 'LogEntry[]', required: true, description: 'Log entries array' },
      { name: 'onClear', type: 'function', required: false, description: 'Clear logs handler' },
      { name: 'autoScroll', type: 'boolean', required: false, default: 'true', description: 'Auto-scroll enabled' },
      { name: 'maxEntries', type: 'number', required: false, default: '500', description: 'Max entries to display' },
    ],
    variants: ['default'],
    animations: ['entrySlideIn', 'levelGlow', 'clearStaggerOut', 'expandHeight'],
    composedWith: [],
    example: `<LogViewer logs={logs} autoScroll />`,
    importPath: '@premiumui/core/components/developer-tools',
  },
  {
    id: 'developer-tools.json-inspector',
    name: 'JSON Inspector',
    category: 'Developer Tools',
    description:
      'Collapsible JSON tree viewer with color-coded types, path breadcrumb with copy, search, and expand/collapse all.',
    props: [
      { name: 'data', type: 'unknown', required: true, description: 'JSON data to inspect' },
      { name: 'defaultExpanded', type: 'boolean | number', required: false, default: '1', description: 'Default expand depth' },
      { name: 'searchable', type: 'boolean', required: false, default: 'true', description: 'Enable search' },
    ],
    variants: ['default'],
    animations: ['chevronRotate', 'heightCollapse', 'staggerExpand', 'searchHighlight'],
    composedWith: ['utility.copy-button'],
    example: `<JsonInspector data={{ users: [{ name: "Alice" }] }} />`,
    importPath: '@premiumui/core/components/developer-tools',
  },
  {
    id: 'developer-tools.api-playground',
    name: 'API Playground',
    category: 'Developer Tools',
    description:
      'Interactive API testing playground with method selector, URL input, headers/params/body/auth tabs, and response viewer with syntax coloring.',
    props: [
      { name: 'baseUrl', type: 'string', required: false, description: 'Base URL prefix' },
      { name: 'onSendRequest', type: 'function', required: true, description: 'Send request handler' },
    ],
    variants: ['default'],
    animations: ['tabIndicator', 'responseSlide', 'spinnerRotate'],
    composedWith: ['developer-tools.json-inspector'],
    example: `<ApiPlayground baseUrl="https://api.example.com" onSendRequest={handle} />`,
    importPath: '@premiumui/core/components/developer-tools',
  },
  {
    id: 'developer-tools.deployment-pipeline',
    name: 'Deployment Pipeline',
    category: 'Developer Tools',
    description:
      'CI/CD pipeline visualization with horizontal stages, animated connecting lines, status indicators (running pulse, success checkmark, failed shake), and commit info.',
    props: [
      { name: 'stages', type: 'PipelineStage[]', required: true, description: 'Pipeline stages' },
      { name: 'commit', type: '{hash, author, message}', required: false, description: 'Commit info' },
    ],
    variants: ['default'],
    animations: ['lineDraw', 'stagePulse', 'checkmarkSpring', 'failShake'],
    composedWith: [],
    example: `<DeploymentPipeline stages={stages} commit={{ hash: "abc123", author: "dev", message: "fix" }} />`,
    importPath: '@premiumui/core/components/developer-tools',
  },
  {
    id: 'developer-tools.schema-visualizer',
    name: 'Schema Visualizer',
    category: 'Developer Tools',
    description:
      'Database/API schema viewer with table cards, field lists, type badges, relationship indicators, and hover highlighting.',
    props: [
      { name: 'tables', type: 'SchemaTable[]', required: true, description: 'Schema tables' },
      { name: 'relationships', type: 'SchemaRelation[]', required: true, description: 'Table relationships' },
    ],
    variants: ['default'],
    animations: ['cardHoverLift', 'relationGlow', 'expandCollapse'],
    composedWith: [],
    example: `<SchemaVisualizer tables={tables} relationships={relations} />`,
    importPath: '@premiumui/core/components/developer-tools',
  },
  {
    id: 'developer-tools.code-snippet-block',
    name: 'Code Snippet Block',
    category: 'Developer Tools',
    description:
      'Premium code display with language tabs, line numbers, copy button, syntax coloring, line wrap toggle, diff mode, and expandable long snippets.',
    props: [
      { name: 'snippets', type: 'CodeSnippet[]', required: true, description: 'Code snippets with language' },
      { name: 'showLineNumbers', type: 'boolean', required: false, default: 'true', description: 'Show line numbers' },
      { name: 'maxLines', type: 'number', required: false, description: 'Max lines before collapse' },
      { name: 'diffMode', type: 'boolean', required: false, default: 'false', description: 'Enable diff mode' },
    ],
    variants: ['default'],
    animations: ['tabIndicator', 'copyIconMorph', 'expandCollapse'],
    composedWith: [],
    example: `<CodeSnippetBlock snippets={[{ language: "tsx", code: "const x = 1" }]} />`,
    importPath: '@premiumui/core/components/developer-tools',
  },
  {
    id: 'developer-tools.feature-flag-panel',
    name: 'Feature Flag Panel',
    category: 'Developer Tools',
    description:
      'Feature flag management with toggle switches, environment scoping, percentage rollout sliders, search, and tags.',
    props: [
      { name: 'flags', type: 'FeatureFlag[]', required: true, description: 'Feature flags' },
      { name: 'environments', type: 'string[]', required: true, description: 'Available environments' },
      { name: 'onToggle', type: 'function', required: true, description: 'Toggle handler' },
      { name: 'onUpdateRollout', type: 'function', required: false, description: 'Rollout update handler' },
    ],
    variants: ['default'],
    animations: ['toggleSpring', 'envIndicator', 'statusPulse', 'newFlagSlide'],
    composedWith: [],
    example: `<FeatureFlagPanel flags={flags} environments={["dev","prod"]} onToggle={handle} />`,
    importPath: '@premiumui/core/components/developer-tools',
  },

  // ─── SaaS Platform ───────────────────────────────────────
  {
    id: 'saas-platform.subscription-manager',
    name: 'Subscription Manager',
    category: 'SaaS Platform',
    description:
      'Plan cards with upgrade/downgrade flows, billing cycle toggle with savings badge, trial indicator, and cancel subscription flow.',
    props: [
      { name: 'plans', type: 'Plan[]', required: true, description: 'Available plans' },
      { name: 'currentPlanId', type: 'string', required: true, description: 'Current plan ID' },
      { name: 'onChangePlan', type: 'function', required: true, description: 'Plan change handler' },
      { name: 'onCancel', type: 'function', required: false, description: 'Cancel handler' },
    ],
    variants: ['default'],
    animations: ['borderGlow', 'planSwitch', 'savingsBadge', 'trialPulse'],
    composedWith: ['cards.pricing-table'],
    example: `<SubscriptionManager plans={plans} currentPlanId="pro" onChangePlan={handle} />`,
    importPath: '@premiumui/core/components/saas-platform',
  },
  {
    id: 'saas-platform.usage-billing-dashboard',
    name: 'Usage Billing Dashboard',
    category: 'SaaS Platform',
    description:
      'Usage-based billing with animated progress bars, cost breakdown, invoice preview, overage warnings, and payment method display.',
    props: [
      { name: 'period', type: 'BillingPeriod', required: true, description: 'Current billing period' },
      { name: 'usageMetrics', type: 'UsageMetric[]', required: true, description: 'Usage metrics' },
    ],
    variants: ['default'],
    animations: ['progressFill', 'counterAnimate', 'overageSlideIn'],
    composedWith: [],
    example: `<UsageBillingDashboard period={period} usageMetrics={metrics} />`,
    importPath: '@premiumui/core/components/saas-platform',
  },
  {
    id: 'saas-platform.team-management-panel',
    name: 'Team Management Panel',
    category: 'SaaS Platform',
    description:
      'Team member management with roles, invite flow, pending invites, remove confirmation, and search/filter.',
    props: [
      { name: 'members', type: 'TeamMember[]', required: true, description: 'Team members' },
      { name: 'roles', type: 'string[]', required: true, description: 'Available roles' },
      { name: 'onInvite', type: 'function', required: true, description: 'Invite handler' },
      { name: 'onRemove', type: 'function', required: true, description: 'Remove handler' },
      { name: 'onChangeRole', type: 'function', required: true, description: 'Role change handler' },
    ],
    variants: ['default'],
    animations: ['inviteSlideDown', 'roleChange', 'rowStagger'],
    composedWith: ['auth.team-invite-form'],
    example: `<TeamManagementPanel members={members} roles={["admin","member"]} onInvite={handle} onRemove={handle} onChangeRole={handle} />`,
    importPath: '@premiumui/core/components/saas-platform',
  },
  {
    id: 'saas-platform.audit-log-viewer',
    name: 'Audit Log Viewer',
    category: 'SaaS Platform',
    description:
      'Filterable audit trail with actor, action, timestamp, expandable details, action type color coding, and export.',
    props: [
      { name: 'entries', type: 'AuditEntry[]', required: true, description: 'Audit log entries' },
      { name: 'onLoadMore', type: 'function', required: false, description: 'Load more handler' },
      { name: 'hasMore', type: 'boolean', required: false, description: 'More entries available' },
    ],
    variants: ['default'],
    animations: ['entryStagger', 'detailExpand', 'loadingSpinner'],
    composedWith: [],
    example: `<AuditLogViewer entries={entries} onLoadMore={handle} hasMore />`,
    importPath: '@premiumui/core/components/saas-platform',
  },
  {
    id: 'saas-platform.permissions-matrix',
    name: 'Permissions Matrix',
    category: 'SaaS Platform',
    description:
      'Role-permission grid with toggle cells, collapsible row groups, hover cross-hair, bulk toggle per role, and unsaved changes.',
    props: [
      { name: 'roles', type: 'Role[]', required: true, description: 'Role definitions' },
      { name: 'permissionGroups', type: 'PermissionGroup[]', required: true, description: 'Permission groups' },
      { name: 'onToggle', type: 'function', required: true, description: 'Toggle handler' },
      { name: 'onSave', type: 'function', required: true, description: 'Save handler' },
    ],
    variants: ['default'],
    animations: ['toggleSpring', 'groupCollapse', 'crossHairHighlight'],
    composedWith: [],
    example: `<PermissionsMatrix roles={roles} permissionGroups={groups} onToggle={handle} onSave={handle} />`,
    importPath: '@premiumui/core/components/saas-platform',
  },
  {
    id: 'saas-platform.onboarding-checklist',
    name: 'Onboarding Checklist',
    category: 'SaaS Platform',
    description:
      'Progressive onboarding checklist with completion tracking, animated progress bar, expandable steps, skip option, and celebration on complete.',
    props: [
      { name: 'steps', type: 'OnboardingStep[]', required: true, description: 'Onboarding steps' },
      { name: 'onComplete', type: 'function', required: true, description: 'Completion handler' },
      { name: 'onSkip', type: 'function', required: false, description: 'Skip handler' },
      { name: 'onDismiss', type: 'function', required: false, description: 'Dismiss handler' },
    ],
    variants: ['default'],
    animations: ['progressFill', 'checkmarkSpring', 'stepExpand', 'celebration'],
    composedWith: [],
    example: `<OnboardingChecklist steps={steps} onComplete={handle} />`,
    importPath: '@premiumui/core/components/saas-platform',
  },
  {
    id: 'saas-platform.tenant-switcher',
    name: 'Tenant Switcher',
    category: 'SaaS Platform',
    description:
      'Multi-tenant workspace switcher dropdown with search, avatars, role badges, and create new workspace.',
    props: [
      { name: 'tenants', type: 'Tenant[]', required: true, description: 'Available tenants' },
      { name: 'activeTenantId', type: 'string', required: true, description: 'Active tenant ID' },
      { name: 'onSwitch', type: 'function', required: true, description: 'Switch handler' },
      { name: 'onCreate', type: 'function', required: false, description: 'Create workspace handler' },
    ],
    variants: ['default'],
    animations: ['dropdownScaleFade', 'switchTransition', 'hoverHighlight'],
    composedWith: [],
    example: `<TenantSwitcher tenants={tenants} activeTenantId="org-1" onSwitch={handle} />`,
    importPath: '@premiumui/core/components/saas-platform',
  },
  {
    id: 'saas-platform.quota-usage-card',
    name: 'Quota Usage Card',
    category: 'SaaS Platform',
    description:
      'Resource quota usage with animated progress indicators, color transitions (green/amber/red), overage warnings, and upgrade CTA.',
    props: [
      { name: 'quotas', type: 'Quota[]', required: true, description: 'Quota data' },
      { name: 'onUpgrade', type: 'function', required: false, description: 'Upgrade handler' },
    ],
    variants: ['default'],
    animations: ['progressFill', 'colorTransition', 'overagePulse'],
    composedWith: [],
    example: `<QuotaUsageCard quotas={quotas} onUpgrade={handle} />`,
    importPath: '@premiumui/core/components/saas-platform',
  },
  {
    id: 'saas-platform.customer-health-score',
    name: 'Customer Health Score',
    category: 'SaaS Platform',
    description:
      'Customer health gauge with animated score counter, color-coded ring, trend indicator, factor breakdown, and sparkline.',
    props: [
      { name: 'score', type: 'number', required: true, description: 'Health score 0-100' },
      { name: 'trend', type: "'up'|'down'|'stable'", required: true, description: 'Score trend' },
      { name: 'factors', type: 'HealthFactor[]', required: true, description: 'Health factors' },
    ],
    variants: ['default'],
    animations: ['ringFill', 'counterAnimate', 'trendBounce', 'factorBars'],
    composedWith: [],
    example: `<CustomerHealthScore score={82} trend="up" factors={factors} />`,
    importPath: '@premiumui/core/components/saas-platform',
  },
  {
    id: 'saas-platform.changelog-timeline',
    name: 'Changelog Timeline',
    category: 'SaaS Platform',
    description:
      'Public changelog timeline with version nodes, type-coded entries (feature/fix/improvement/breaking), scroll animations, and search.',
    props: [
      { name: 'versions', type: 'ChangelogVersion[]', required: true, description: 'Changelog versions' },
    ],
    variants: ['default'],
    animations: ['scrollStagger', 'newBadgePulse', 'expandMore'],
    composedWith: [],
    example: `<ChangelogTimeline versions={versions} />`,
    importPath: '@premiumui/core/components/saas-platform',
  },

  // ─── AI Ops ───────────────────────────────────────────────
  {
    id: 'ai-ops.llm-playground',
    name: 'LLM Playground',
    category: 'AI Ops',
    description:
      'LLM testing playground with model selector, system prompt, temperature/max tokens controls, multi-turn chat, streaming response, and token/cost display.',
    props: [
      { name: 'models', type: 'ModelOption[]', required: true, description: 'Available models' },
      { name: 'onRun', type: '(config: RunConfig) => Promise<string>', required: true, description: 'Run handler' },
    ],
    variants: ['default'],
    animations: ['streamingText', 'counterAnimate', 'modelSelect'],
    composedWith: ['ai.streaming-text'],
    example: `<LlmPlayground models={models} onRun={handleRun} />`,
    importPath: '@premiumui/core/components/ai-ops',
  },
  {
    id: 'ai-ops.prompt-template-editor',
    name: 'Prompt Template Editor',
    category: 'AI Ops',
    description:
      'Prompt template editor with {{variable}} detection, type selectors, version history, diff view, test execution, and save/publish.',
    props: [
      { name: 'template', type: 'string', required: false, description: 'Initial template' },
      { name: 'onSave', type: 'function', required: true, description: 'Save handler' },
      { name: 'onTest', type: 'function', required: false, description: 'Test handler' },
    ],
    variants: ['default'],
    animations: ['variableHighlight', 'versionSelect', 'diffHighlight', 'publishMorph'],
    composedWith: [],
    example: `<PromptTemplateEditor template="Hello {{name}}" onSave={handle} />`,
    importPath: '@premiumui/core/components/ai-ops',
  },
  {
    id: 'ai-ops.evaluation-results-table',
    name: 'Evaluation Results Table',
    category: 'AI Ops',
    description:
      'LLM evaluation results with pass/fail badges, score bars, expandable rows, diff highlighting, and overall accuracy display.',
    props: [
      { name: 'results', type: 'EvalResult[]', required: true, description: 'Evaluation results' },
      { name: 'runInfo', type: 'RunInfo', required: false, description: 'Run metadata' },
      { name: 'onRerun', type: 'function', required: false, description: 'Rerun handler' },
    ],
    variants: ['default'],
    animations: ['scoreFill', 'passFailScale', 'rowExpand', 'counterAnimate'],
    composedWith: [],
    example: `<EvaluationResultsTable results={results} runInfo={info} />`,
    importPath: '@premiumui/core/components/ai-ops',
  },
  {
    id: 'ai-ops.vector-search-explorer',
    name: 'Vector Search Explorer',
    category: 'AI Ops',
    description:
      'Embedding/vector search interface with similarity score bars, threshold slider, collection selector, expandable results, and skeleton loading.',
    props: [
      { name: 'onSearch', type: '(query, config) => Promise<SearchResult[]>', required: true, description: 'Search handler' },
      { name: 'collections', type: 'string[]', required: false, description: 'Available collections' },
    ],
    variants: ['default'],
    animations: ['scoreFill', 'counterAnimate', 'resultExpand', 'shimmerLoad'],
    composedWith: [],
    example: `<VectorSearchExplorer onSearch={handleSearch} collections={["docs","code"]} />`,
    importPath: '@premiumui/core/components/ai-ops',
  },
  {
    id: 'ai-ops.agent-workflow-builder',
    name: 'Agent Workflow Builder',
    category: 'AI Ops',
    description:
      'Visual agent pipeline builder with node cards, connecting lines, add/delete/reorder nodes, config expansion, status indicators, and run pipeline.',
    props: [
      { name: 'nodes', type: 'WorkflowNode[]', required: false, description: 'Initial workflow nodes' },
      { name: 'onChange', type: 'function', required: true, description: 'Change handler' },
      { name: 'onRun', type: 'function', required: false, description: 'Run handler' },
    ],
    variants: ['default'],
    animations: ['layoutReorder', 'nodeSlideOut', 'configExpand', 'stageActivation'],
    composedWith: [],
    example: `<AgentWorkflowBuilder nodes={nodes} onChange={handle} onRun={handleRun} />`,
    importPath: '@premiumui/core/components/ai-ops',
  },
  {
    id: 'ai-ops.model-comparison-card',
    name: 'Model Comparison Card',
    category: 'AI Ops',
    description:
      'Side-by-side model output comparison with shared prompt, streaming responses, metric counters, winner badges, and diff toggle.',
    props: [
      { name: 'models', type: 'ModelOption[]', required: true, description: 'Available models' },
      { name: 'onRun', type: 'function', required: true, description: 'Run comparison handler' },
    ],
    variants: ['default'],
    animations: ['streamingText', 'counterAnimate', 'winnerBadge'],
    composedWith: ['ai-ops.llm-playground'],
    example: `<ModelComparisonCard models={models} onRun={handleRun} />`,
    importPath: '@premiumui/core/components/ai-ops',
  },
  {
    id: 'ai-ops.cost-tracker-dashboard',
    name: 'Cost Tracker Dashboard',
    category: 'AI Ops',
    description:
      'API cost tracking with animated counters, model cost breakdown bars, budget progress, daily trend, and projected costs.',
    props: [
      { name: 'costs', type: 'CostData', required: true, description: 'Cost data' },
      { name: 'budget', type: 'number', required: false, description: 'Budget limit' },
      { name: 'period', type: 'string', required: true, description: 'Time period' },
      { name: 'onPeriodChange', type: 'function', required: true, description: 'Period change handler' },
    ],
    variants: ['default'],
    animations: ['barGrow', 'counterAnimate', 'budgetColor'],
    composedWith: [],
    example: `<CostTrackerDashboard costs={costs} budget={1000} period="month" onPeriodChange={handle} />`,
    importPath: '@premiumui/core/components/ai-ops',
  },
  {
    id: 'ai-ops.annotation-labeling-tool',
    name: 'Annotation Labeling Tool',
    category: 'AI Ops',
    description:
      'Text annotation with selectable regions, color-coded labels, annotation list, label statistics, undo/redo, and export.',
    props: [
      { name: 'text', type: 'string', required: true, description: 'Text to annotate' },
      { name: 'labels', type: 'LabelCategory[]', required: true, description: 'Label categories' },
      { name: 'onChange', type: 'function', required: true, description: 'Change handler' },
    ],
    variants: ['default'],
    animations: ['labelHighlight', 'popupAppear', 'statsBars'],
    composedWith: [],
    example: `<AnnotationLabelingTool text="Sample text" labels={labels} onChange={handle} />`,
    importPath: '@premiumui/core/components/ai-ops',
  },
  {
    id: 'ai-ops.guardrail-config-panel',
    name: 'Guardrail Config Panel',
    category: 'AI Ops',
    description:
      'AI safety guardrail configuration with categorized rules, toggle switches, severity badges, test area with pass/fail results.',
    props: [
      { name: 'rules', type: 'GuardrailRule[]', required: true, description: 'Guardrail rules' },
      { name: 'onToggle', type: 'function', required: true, description: 'Toggle handler' },
      { name: 'onAddRule', type: 'function', required: true, description: 'Add rule handler' },
      { name: 'onTest', type: 'function', required: false, description: 'Test handler' },
    ],
    variants: ['default'],
    animations: ['toggleSpring', 'categoryCollapse', 'addRuleSlide', 'testResults'],
    composedWith: [],
    example: `<GuardrailConfigPanel rules={rules} onToggle={handle} onAddRule={handle} />`,
    importPath: '@premiumui/core/components/ai-ops',
  },
  {
    id: 'ai-ops.dataset-browser',
    name: 'Dataset Browser',
    category: 'AI Ops',
    description:
      'Paginated dataset viewer with sortable columns, column statistics, row selection, expandable rows, search/filter, and export.',
    props: [
      { name: 'data', type: 'DataRow[]', required: true, description: 'Dataset rows' },
      { name: 'columns', type: 'DataColumn[]', required: true, description: 'Column definitions' },
      { name: 'totalRows', type: 'number', required: true, description: 'Total row count' },
      { name: 'onPageChange', type: 'function', required: true, description: 'Page change handler' },
    ],
    variants: ['default'],
    animations: ['counterAnimate', 'rowExpand', 'skeletonShimmer', 'sortIndicator'],
    composedWith: [],
    example: `<DatasetBrowser data={data} columns={columns} totalRows={1000} onPageChange={handle} />`,
    importPath: '@premiumui/core/components/ai-ops',
  },

  // ─── Internal Tools ───────────────────────────────────────
  {
    id: 'internal-tools.crud-resource-panel',
    name: 'CRUD Resource Panel',
    category: 'Internal Tools',
    description:
      'Full CRUD interface with inline editing, create form, delete confirmation, search/filter, pagination, and row actions.',
    props: [
      { name: 'data', type: 'Record<string, unknown>[]', required: true, description: 'Resource data' },
      { name: 'schema', type: 'FieldSchema[]', required: true, description: 'Field schema' },
      { name: 'onCreate', type: 'function', required: true, description: 'Create handler' },
      { name: 'onUpdate', type: 'function', required: true, description: 'Update handler' },
      { name: 'onDelete', type: 'function', required: true, description: 'Delete handler' },
    ],
    variants: ['default'],
    animations: ['createSlideDown', 'inlineEditTransition', 'deleteModal', 'rowStagger'],
    composedWith: ['feedback.confirmation-dialog', 'feedback.toast'],
    example: `<CrudResourcePanel data={data} schema={schema} onCreate={handle} onUpdate={handle} onDelete={handle} />`,
    importPath: '@premiumui/core/components/internal-tools',
  },
  {
    id: 'internal-tools.approval-workflow',
    name: 'Approval Workflow',
    category: 'Internal Tools',
    description:
      'Multi-step approval chain with timeline, status indicators, comment threads, approve/reject buttons.',
    props: [
      { name: 'steps', type: 'ApprovalStep[]', required: true, description: 'Approval steps' },
      { name: 'onApprove', type: 'function', required: true, description: 'Approve handler' },
      { name: 'onReject', type: 'function', required: true, description: 'Reject handler' },
      { name: 'onComment', type: 'function', required: true, description: 'Comment handler' },
    ],
    variants: ['default'],
    animations: ['checkmarkSpring', 'rejectShake', 'pendingPulse', 'commentExpand'],
    composedWith: [],
    example: `<ApprovalWorkflow steps={steps} onApprove={handle} onReject={handle} onComment={handle} />`,
    importPath: '@premiumui/core/components/internal-tools',
  },
  {
    id: 'internal-tools.bulk-action-toolbar',
    name: 'Bulk Action Toolbar',
    category: 'Internal Tools',
    description:
      'Selection toolbar with animated count, bulk operations, confirmation, progress bar, and responsive dropdown.',
    props: [
      { name: 'selectedCount', type: 'number', required: true, description: 'Selected item count' },
      { name: 'totalCount', type: 'number', required: true, description: 'Total item count' },
      { name: 'actions', type: 'BulkAction[]', required: true, description: 'Available actions' },
      { name: 'onExecuteAction', type: 'function', required: true, description: 'Execute action handler' },
    ],
    variants: ['default'],
    animations: ['toolbarSlideIn', 'counterAnimate', 'progressFill'],
    composedWith: [],
    example: `<BulkActionToolbar selectedCount={5} totalCount={100} actions={actions} onExecuteAction={handle} />`,
    importPath: '@premiumui/core/components/internal-tools',
  },
  {
    id: 'internal-tools.report-builder',
    name: 'Report Builder',
    category: 'Internal Tools',
    description:
      'Drag-and-drop report field selector with available/selected panels, field configuration, chart type selector, and generate button.',
    props: [
      { name: 'availableFields', type: 'ReportField[]', required: true, description: 'Available fields' },
      { name: 'onGenerate', type: '(config: ReportConfig) => void', required: true, description: 'Generate handler' },
    ],
    variants: ['default'],
    animations: ['layoutDrag', 'fieldReorder', 'previewUpdate'],
    composedWith: [],
    example: `<ReportBuilder availableFields={fields} onGenerate={handle} />`,
    importPath: '@premiumui/core/components/internal-tools',
  },
  {
    id: 'internal-tools.notification-center',
    name: 'Notification Center',
    category: 'Internal Tools',
    description:
      'Grouped notification center with read/unread indicators, filter tabs, mark all read, dismiss, and animated badge counter.',
    props: [
      { name: 'notifications', type: 'Notification[]', required: true, description: 'Notifications' },
      { name: 'onMarkRead', type: 'function', required: true, description: 'Mark read handler' },
      { name: 'onMarkAllRead', type: 'function', required: true, description: 'Mark all read handler' },
      { name: 'onDismiss', type: 'function', required: true, description: 'Dismiss handler' },
    ],
    variants: ['default'],
    animations: ['slideRight', 'slideLeftExit', 'unreadPulse', 'tabIndicator'],
    composedWith: [],
    example: `<NotificationCenter notifications={notifs} onMarkRead={handle} onMarkAllRead={handle} onDismiss={handle} />`,
    importPath: '@premiumui/core/components/internal-tools',
  },
  {
    id: 'internal-tools.system-status-dashboard',
    name: 'System Status Dashboard',
    category: 'Internal Tools',
    description:
      'Service health monitoring grid with status indicators, uptime percentage, incident history, and expandable service details.',
    props: [
      { name: 'services', type: 'ServiceStatus[]', required: true, description: 'Service statuses' },
      { name: 'incidents', type: 'Incident[]', required: false, description: 'Incident history' },
    ],
    variants: ['default'],
    animations: ['statusPulse', 'counterAnimate', 'cardExpand', 'colorTransition'],
    composedWith: [],
    example: `<SystemStatusDashboard services={services} incidents={incidents} />`,
    importPath: '@premiumui/core/components/internal-tools',
  },
  {
    id: 'internal-tools.import-export-wizard',
    name: 'Import Export Wizard',
    category: 'Internal Tools',
    description:
      'Multi-step CSV/JSON import wizard with file upload, field mapping, preview, validation, and progress tracking.',
    props: [
      { name: 'targetFields', type: 'FieldDef[]', required: true, description: 'Target field definitions' },
      { name: 'onImport', type: '(data) => Promise<ImportResult>', required: true, description: 'Import handler' },
    ],
    variants: ['default'],
    animations: ['stepProgress', 'dropZoneHighlight', 'validationHighlight', 'progressFill'],
    composedWith: [],
    example: `<ImportExportWizard targetFields={fields} onImport={handleImport} />`,
    importPath: '@premiumui/core/components/internal-tools',
  },
  {
    id: 'internal-tools.role-based-nav-shell',
    name: 'Role-Based Nav Shell',
    category: 'Internal Tools',
    description:
      'Admin shell layout with role-aware sidebar navigation, collapsible sidebar, breadcrumbs, user menu, and page transitions.',
    props: [
      { name: 'navItems', type: 'NavItem[]', required: true, description: 'Navigation items' },
      { name: 'userRole', type: 'string', required: true, description: 'Current user role' },
      { name: 'userName', type: 'string', required: true, description: 'User display name' },
      { name: 'children', type: 'ReactNode', required: true, description: 'Page content' },
    ],
    variants: ['default'],
    animations: ['sidebarCollapse', 'activeIndicator', 'pageTransition', 'menuDropdown'],
    composedWith: ['navigation.collapsible-sidebar', 'navigation.breadcrumb-trail'],
    example: `<RoleBasedNavShell navItems={items} userRole="admin" userName="Admin">{children}</RoleBasedNavShell>`,
    importPath: '@premiumui/core/components/internal-tools',
  },
  {
    id: 'internal-tools.task-queue-monitor',
    name: 'Task Queue Monitor',
    category: 'Internal Tools',
    description:
      'Background job queue monitor with status indicators, retry/cancel controls, auto-refresh, expandable job details, and filter by status.',
    props: [
      { name: 'jobs', type: 'QueueJob[]', required: true, description: 'Queue jobs' },
      { name: 'onRetry', type: 'function', required: true, description: 'Retry handler' },
      { name: 'onCancel', type: 'function', required: true, description: 'Cancel handler' },
    ],
    variants: ['default'],
    animations: ['runningPulse', 'progressFill', 'retryRotate', 'jobExpand'],
    composedWith: [],
    example: `<TaskQueueMonitor jobs={jobs} onRetry={handle} onCancel={handle} />`,
    importPath: '@premiumui/core/components/internal-tools',
  },
  {
    id: 'internal-tools.configuration-panel',
    name: 'Configuration Panel',
    category: 'Internal Tools',
    description:
      'Dynamic settings panel with categorized sections, toggle/text/select/color fields, unsaved changes banner, reset defaults, and search.',
    props: [
      { name: 'categories', type: 'ConfigCategory[]', required: true, description: 'Config categories' },
      { name: 'values', type: 'Record<string, unknown>', required: true, description: 'Current values' },
      { name: 'onSave', type: 'function', required: true, description: 'Save handler' },
      { name: 'onReset', type: 'function', required: false, description: 'Reset handler' },
    ],
    variants: ['default'],
    animations: ['toggleSpring', 'categoryCollapse', 'unsavedSlideIn', 'saveFlash'],
    composedWith: [],
    example: `<ConfigurationPanel categories={categories} values={values} onSave={handle} />`,
    importPath: '@premiumui/core/components/internal-tools',
  },

  // ─── CLI & Web Terminal ───────────────────────────────────
  {
    id: 'cli-web.terminal-emulator',
    name: 'Terminal Emulator',
    category: 'CLI & Web Terminal',
    description:
      'Interactive terminal emulator with command history, blinking cursor, auto-scroll, customizable prompt, and loading dots animation.',
    props: [
      { name: 'onCommand', type: '(cmd: string) => Promise<string>', required: true, description: 'Command execution handler' },
      { name: 'prompt', type: 'string', required: false, default: "'$'", description: 'Terminal prompt' },
      { name: 'welcomeMessage', type: 'string', required: false, description: 'Welcome message' },
    ],
    variants: ['default'],
    animations: ['cursorBlink', 'outputFade', 'clearAnimation', 'loadingDots'],
    composedWith: ['cli-web.cli-output-renderer'],
    example: `<TerminalEmulator onCommand={handleCommand} prompt="user@host:~$" />`,
    importPath: '@premiumui/core/components/cli-web',
  },
  {
    id: 'cli-web.cli-output-renderer',
    name: 'CLI Output Renderer',
    category: 'CLI & Web Terminal',
    description:
      'Structured CLI output renderer with color tokens, table rendering, progress bars, spinners, code blocks, and streaming mode.',
    props: [
      { name: 'blocks', type: 'OutputBlock[]', required: true, description: 'Output blocks to render' },
      { name: 'streaming', type: 'boolean', required: false, default: 'false', description: 'Enable streaming mode' },
    ],
    variants: ['default'],
    animations: ['streamCharacters', 'progressFill', 'spinnerRotate'],
    composedWith: ['cli-web.terminal-emulator'],
    example: `<CliOutputRenderer blocks={blocks} streaming />`,
    importPath: '@premiumui/core/components/cli-web',
  },
  {
    id: 'cli-web.mcp-server-status',
    name: 'MCP Server Status',
    category: 'CLI & Web Terminal',
    description:
      'MCP server connection status with tool lists, heartbeat pulse, reconnect button, masked URLs, and connection summary.',
    props: [
      { name: 'servers', type: 'McpServer[]', required: true, description: 'MCP servers' },
      { name: 'onReconnect', type: 'function', required: true, description: 'Reconnect handler' },
    ],
    variants: ['default'],
    animations: ['heartbeatPulse', 'reconnectRotate', 'toolListExpand'],
    composedWith: [],
    example: `<McpServerStatus servers={servers} onReconnect={handle} />`,
    importPath: '@premiumui/core/components/cli-web',
  },
  {
    id: 'cli-web.agent-chat-terminal',
    name: 'Agent Chat Terminal',
    category: 'CLI & Web Terminal',
    description:
      'AI agent chat with terminal aesthetics, command-style user messages, tool use blocks, thinking sections, streaming text, and model indicator.',
    props: [
      { name: 'messages', type: 'AgentMessage[]', required: true, description: 'Chat messages' },
      { name: 'onSend', type: '(msg: string) => void', required: true, description: 'Send handler' },
      { name: 'isStreaming', type: 'boolean', required: false, description: 'Streaming state' },
      { name: 'model', type: 'string', required: false, description: 'Model name' },
    ],
    variants: ['default'],
    animations: ['typingDots', 'streamingText', 'toolBlockExpand', 'clearBatch'],
    composedWith: ['ai.streaming-text'],
    example: `<AgentChatTerminal messages={messages} onSend={handleSend} model="claude-3" />`,
    importPath: '@premiumui/core/components/cli-web',
  },
  {
    id: 'cli-web.pipeline-log-stream',
    name: 'Pipeline Log Stream',
    category: 'CLI & Web Terminal',
    description:
      'Real-time pipeline log stream with stage headers, level coloring, auto-scroll toggle, jump-to-bottom, and stage/level filters.',
    props: [
      { name: 'logs', type: 'PipelineLog[]', required: true, description: 'Pipeline logs' },
      { name: 'stages', type: 'string[]', required: false, description: 'Stage names' },
      { name: 'autoScroll', type: 'boolean', required: false, default: 'true', description: 'Auto-scroll enabled' },
    ],
    variants: ['default'],
    animations: ['entrySlideIn', 'stageCollapse', 'jumpButton'],
    composedWith: [],
    example: `<PipelineLogStream logs={logs} stages={["build","test","deploy"]} />`,
    importPath: '@premiumui/core/components/cli-web',
  },
  {
    id: 'cli-web.command-builder-form',
    name: 'Command Builder Form',
    category: 'CLI & Web Terminal',
    description:
      'Visual CLI command builder with subcommand selector, flag toggles, option inputs, live preview, and copy/run buttons.',
    props: [
      { name: 'command', type: 'CommandDef', required: true, description: 'Command definition' },
      { name: 'onRun', type: '(cmd: string) => void', required: true, description: 'Run handler' },
    ],
    variants: ['default'],
    animations: ['previewHighlight', 'copyMorph', 'flagToggle'],
    composedWith: ['cli-web.terminal-emulator'],
    example: `<CommandBuilderForm command={commandDef} onRun={handle} />`,
    importPath: '@premiumui/core/components/cli-web',
  },
  {
    id: 'cli-web.diff-viewer',
    name: 'Diff Viewer',
    category: 'CLI & Web Terminal',
    description:
      'Code diff viewer with unified and side-by-side modes, word-level diff highlighting, line numbers, expand context, and navigation.',
    props: [
      { name: 'oldText', type: 'string', required: true, description: 'Original text' },
      { name: 'newText', type: 'string', required: true, description: 'Modified text' },
      { name: 'fileName', type: 'string', required: false, description: 'File name' },
      { name: 'mode', type: "'unified'|'split'", required: false, default: "'unified'", description: 'View mode' },
    ],
    variants: ['unified', 'split'],
    animations: ['modeToggle', 'expandContext'],
    composedWith: [],
    example: `<DiffViewer oldText={old} newText={new} fileName="app.tsx" />`,
    importPath: '@premiumui/core/components/cli-web',
  },
  {
    id: 'cli-web.ssh-connection-manager',
    name: 'SSH Connection Manager',
    category: 'CLI & Web Terminal',
    description:
      'SSH connection management with status indicators, connect/disconnect, add/edit connections, grouping by tag, and terminal launch.',
    props: [
      { name: 'connections', type: 'SshConnection[]', required: true, description: 'SSH connections' },
      { name: 'onConnect', type: 'function', required: true, description: 'Connect handler' },
      { name: 'onDisconnect', type: 'function', required: true, description: 'Disconnect handler' },
      { name: 'onAdd', type: 'function', required: true, description: 'Add handler' },
    ],
    variants: ['default'],
    animations: ['statusPulse', 'connectLoading', 'formSlideDown', 'groupCollapse'],
    composedWith: ['cli-web.terminal-emulator'],
    example: `<SshConnectionManager connections={conns} onConnect={handle} onDisconnect={handle} onAdd={handle} />`,
    importPath: '@premiumui/core/components/cli-web',
  },
  {
    id: 'cli-web.cron-schedule-editor',
    name: 'Cron Schedule Editor',
    category: 'CLI & Web Terminal',
    description:
      'Visual cron expression builder with presets, field selectors, human-readable description, next executions display, and validation.',
    props: [
      { name: 'value', type: 'string', required: false, description: 'Current cron expression' },
      { name: 'onChange', type: '(cron: string) => void', required: true, description: 'Change handler' },
      { name: 'timezone', type: 'string', required: false, description: 'Timezone' },
    ],
    variants: ['default'],
    animations: ['executionStagger', 'modeToggle', 'validationShake'],
    composedWith: [],
    example: `<CronScheduleEditor value="0 * * * *" onChange={handle} />`,
    importPath: '@premiumui/core/components/cli-web',
  },
  {
    id: 'cli-web.webhook-event-log',
    name: 'Webhook Event Log',
    category: 'CLI & Web Terminal',
    description:
      'Incoming webhook event log with expandable payload viewer, status badges, auto-refresh, retry failed, and success rate stats.',
    props: [
      { name: 'events', type: 'WebhookEvent[]', required: true, description: 'Webhook events' },
      { name: 'onRetry', type: 'function', required: false, description: 'Retry handler' },
      { name: 'autoRefresh', type: 'boolean', required: false, default: 'false', description: 'Auto-refresh enabled' },
    ],
    variants: ['default'],
    animations: ['eventExpand', 'statusBadge', 'refreshCountdown', 'statsAnimate'],
    composedWith: ['developer-tools.json-inspector'],
    example: `<WebhookEventLog events={events} onRetry={handle} autoRefresh />`,
    importPath: '@premiumui/core/components/cli-web',
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
