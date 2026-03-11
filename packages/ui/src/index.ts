// ─── Utilities ──────────────────────────────────────────────
export { cn, formatNumber, formatCurrency, formatPercent, uniqueId } from './lib/utils'

// ─── Hooks ──────────────────────────────────────────────────
export { useTheme, useReducedMotion, useAnimatedNumber } from './hooks'
export type { ThemeName, ColorMode, ThemeState } from './hooks'

// ─── Animations ─────────────────────────────────────────────
export {
  springSnappy,
  springGentle,
  springBouncy,
  springHeavy,
  fadeVariants,
  fadeUpVariants,
  fadeDownVariants,
  scaleInVariants,
  scaleInBounceVariants,
  slideRightVariants,
  slideLeftVariants,
  slideUpVariants,
  staggerContainerVariants,
  staggerFastVariants,
  hoverLiftProps,
  hoverPressProps,
  backdropVariants,
  modalVariants,
  reducedMotionVariants,
  createStaggerVariants,
} from './animations'

// ─── Themes ─────────────────────────────────────────────────
export { themes, themeNames, themeFamilies } from './themes'
export type { ThemeDefinition, ThemeFamily } from './themes'

// ─── Types ──────────────────────────────────────────────────
export type { BaseComponentProps, NavItem, User, ActionConfig, AsyncStateProps } from './types'

// ─── Dashboard Components ───────────────────────────────────
export { KpiStatCard } from './components/dashboard'
export { KpiGrid } from './components/dashboard'
export { RevenueChart } from './components/dashboard'
export { BarChartBlock } from './components/dashboard'
export { DonutChartBlock } from './components/dashboard'
export { ActivityFeed } from './components/dashboard'
export { MiniSparklineRow } from './components/dashboard'
export { MetricComparisonCard } from './components/dashboard'
export { GoalProgressCard } from './components/dashboard'
export { HeatmapCalendar } from './components/dashboard'
export { RealTimeCounter } from './components/dashboard'
export { DashboardShell } from './components/dashboard'

// ─── Data Table Components ──────────────────────────────────
export { DataTable } from './components/data-tables'
export { ExpandableRowTable } from './components/data-tables'
export { EditableTable } from './components/data-tables'
export { CardListView } from './components/data-tables'
export { SortableList } from './components/data-tables'
export { VirtualList } from './components/data-tables'
export { KanbanBoard } from './components/data-tables'
export { TimelineList } from './components/data-tables'
export { NestedTreeList } from './components/data-tables'
export { CommandPaletteList } from './components/data-tables'

// ─── Form Components ────────────────────────────────────────
export { LoginForm } from './components/forms'
export { RegistrationForm } from './components/forms'
export { MultiStepForm } from './components/forms'
export { SettingsForm } from './components/forms'
export { SearchInput } from './components/forms'
export { DateRangePicker } from './components/forms'
export { FileUploadZone } from './components/forms'
export { PaymentForm } from './components/forms'
export { AddressForm } from './components/forms'
export { InlineEditField } from './components/forms'
export { TagMultiSelect } from './components/forms'
export { OtpInput } from './components/forms'

// ─── Navigation Components ──────────────────────────────────
export { CollapsibleSidebar } from './components/navigation'
export { TopNavBar } from './components/navigation'
export { BreadcrumbTrail } from './components/navigation'
export { TabNavigation } from './components/navigation'
export { CommandPalette } from './components/navigation'
export { MobileBottomNav } from './components/navigation'
export { MegaMenu } from './components/navigation'
export { PageTransition } from './components/navigation'
export { FloatingActionMenu } from './components/navigation'
export { StepperNavigation } from './components/navigation'

// ─── Feedback Components ────────────────────────────────────
export { Toast, useToast } from './components/feedback'
export { ModalDialog } from './components/feedback'
export { SlideOverPanel } from './components/feedback'
export { ConfirmationDialog } from './components/feedback'
export { Tooltip } from './components/feedback'
export { Popover } from './components/feedback'
export { AlertBanner } from './components/feedback'
export { SkeletonLoader } from './components/feedback'
export { EmptyState } from './components/feedback'
export { ProgressIndicator } from './components/feedback'

// ─── Card Components ────────────────────────────────────────
export { PricingCard } from './components/cards'
export { PricingTable } from './components/cards'
export { TestimonialCard } from './components/cards'
export { FeatureCard } from './components/cards'
export { BlogCard } from './components/cards'
export { UserProfileCard } from './components/cards'
export { ProductCard } from './components/cards'
export { NotificationCard } from './components/cards'
export { StatCard } from './components/cards'
export { CtaBannerCard } from './components/cards'

// ─── AI Components ──────────────────────────────────────────
export { ChatInterface } from './components/ai'
export { ChatBubble } from './components/ai'
export { StreamingText } from './components/ai'
export { PromptInputBar } from './components/ai'
export { AiResponseCard } from './components/ai'
export { RagSourceCitation } from './components/ai'
export { AgentStatusCard } from './components/ai'
export { ModelSelector } from './components/ai'
export { TokenUsageMeter } from './components/ai'
export { KnowledgeBaseList } from './components/ai'

// ─── E-Commerce Components ──────────────────────────────────
export { ShoppingCartDrawer } from './components/ecommerce'
export { ProductQuickView } from './components/ecommerce'
export { CheckoutSummary } from './components/ecommerce'
export { ProductImageGallery } from './components/ecommerce'
export { ReviewBlock } from './components/ecommerce'
export { CartItemRow } from './components/ecommerce'
export { WishlistGrid } from './components/ecommerce'
export { PromoCodeInput } from './components/ecommerce'

// ─── Auth Components ────────────────────────────────────────
export { SocialAuthButtons } from './components/auth'
export { TwoFactorAuth } from './components/auth'
export { OnboardingWizard } from './components/auth'
export { PasswordResetFlow } from './components/auth'
export { TeamInviteForm } from './components/auth'
export { ProfileSetupCard } from './components/auth'

// ─── Utility Components ─────────────────────────────────────
export { ThemeSwitcher } from './components/utility'
export { KeyboardShortcutDisplay } from './components/utility'
export { ChangelogModal } from './components/utility'
export { CookieConsentBanner } from './components/utility'
export { FeedbackWidget } from './components/utility'
export { CopyButton } from './components/utility'
export { AvatarGroup } from './components/utility'
export { TagCollection } from './components/utility'
export { AnnouncementBar } from './components/utility'
export { ErrorPage } from './components/utility'
export { MaintenancePage } from './components/utility'
export { IntegrationsGrid } from './components/utility'
