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
export { AIResponseCard } from './components/ai'
export { RAGSourceCitation } from './components/ai'
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

// ─── Developer Tools Components ────────────────────────────
export { ApiKeyManager } from './components/developer-tools'
export { WebhookTester } from './components/developer-tools'
export { EnvironmentVariableEditor } from './components/developer-tools'
export { LogViewer } from './components/developer-tools'
export { JsonInspector } from './components/developer-tools'
export { ApiPlayground } from './components/developer-tools'
export { DeploymentPipeline } from './components/developer-tools'
export { SchemaVisualizer } from './components/developer-tools'
export { CodeSnippetBlock } from './components/developer-tools'
export { FeatureFlagPanel } from './components/developer-tools'

// ─── SaaS Platform Components ──────────────────────────────
export { SubscriptionManager } from './components/saas-platform'
export { UsageBillingDashboard } from './components/saas-platform'
export { TeamManagementPanel } from './components/saas-platform'
export { AuditLogViewer } from './components/saas-platform'
export { PermissionsMatrix } from './components/saas-platform'
export { OnboardingChecklist } from './components/saas-platform'
export { TenantSwitcher } from './components/saas-platform'
export { QuotaUsageCard } from './components/saas-platform'
export { CustomerHealthScore } from './components/saas-platform'
export { ChangelogTimeline } from './components/saas-platform'

// ─── AI Ops Components ─────────────────────────────────────
export { LlmPlayground } from './components/ai-ops'
export { PromptTemplateEditor } from './components/ai-ops'
export { EvaluationResultsTable } from './components/ai-ops'
export { VectorSearchExplorer } from './components/ai-ops'
export { AgentWorkflowBuilder } from './components/ai-ops'
export { ModelComparisonCard } from './components/ai-ops'
export { CostTrackerDashboard } from './components/ai-ops'
export { AnnotationLabelingTool } from './components/ai-ops'
export { GuardrailConfigPanel } from './components/ai-ops'
export { DatasetBrowser } from './components/ai-ops'

// ─── Internal Tools Components ─────────────────────────────
export { CrudResourcePanel } from './components/internal-tools'
export { ApprovalWorkflow } from './components/internal-tools'
export { BulkActionToolbar } from './components/internal-tools'
export { ReportBuilder } from './components/internal-tools'
export { NotificationCenter } from './components/internal-tools'
export { SystemStatusDashboard } from './components/internal-tools'
export { ImportExportWizard } from './components/internal-tools'
export { RoleBasedNavShell } from './components/internal-tools'
export { TaskQueueMonitor } from './components/internal-tools'
export { ConfigurationPanel } from './components/internal-tools'

// ─── CLI & Web Terminal Components ─────────────────────────
export { TerminalEmulator } from './components/cli-web'
export { CliOutputRenderer } from './components/cli-web'
export { McpServerStatus } from './components/cli-web'
export { AgentChatTerminal } from './components/cli-web'
export { PipelineLogStream } from './components/cli-web'
export { CommandBuilderForm } from './components/cli-web'
export { DiffViewer } from './components/cli-web'
export { SshConnectionManager } from './components/cli-web'
export { CronScheduleEditor } from './components/cli-web'
export { WebhookEventLog } from './components/cli-web'

// ─── Collaboration & Social Components ──────────────────────
export { CommentThread } from './components/collaboration'
export { MentionInput } from './components/collaboration'
export { PresenceIndicator } from './components/collaboration'
export { SharedCursor } from './components/collaboration'
export { ReactionPicker } from './components/collaboration'
export { ActivityTimeline } from './components/collaboration'
export { InviteLinkCard } from './components/collaboration'
export { VotingPoll } from './components/collaboration'
export { LiveBadge } from './components/collaboration'
export { CollaborativeEditorToolbar } from './components/collaboration'

// ─── Media & File Management Components ────────────────────
export { ImageCropper } from './components/media'
export { VideoPlayer } from './components/media'
export { AudioWaveform } from './components/media'
export { FileBrowser } from './components/media'
export { DocumentViewer } from './components/media'
export { MediaGrid } from './components/media'
export { UploadProgressCard } from './components/media'
export { CloudStorageMeter } from './components/media'
export { AttachmentChip } from './components/media'
export { ScreenRecordingCard } from './components/media'

// ─── Scheduling & Calendar Components ──────────────────────
export { MonthCalendar } from './components/scheduling'
export { WeekPlanner } from './components/scheduling'
export { EventCard } from './components/scheduling'
export { AvailabilityPicker } from './components/scheduling'
export { TimezoneSelector } from './components/scheduling'
export { CountdownTimer } from './components/scheduling'
export { BookingConfirmation } from './components/scheduling'
export { RecurringScheduleEditor } from './components/scheduling'
export { GanttRow } from './components/scheduling'
export { AgendaList } from './components/scheduling'

// ─── Maps & Location Components ────────────────────────────
export { LocationPicker } from './components/maps'
export { AddressAutocomplete } from './components/maps'
export { StoreLocatorCard } from './components/maps'
export { RouteSummary } from './components/maps'
export { GeofenceEditor } from './components/maps'
export { DeliveryTracker } from './components/maps'
export { HeatmapOverlay } from './components/maps'
export { CoordinatesDisplay } from './components/maps'
export { RegionSelector } from './components/maps'
export { EtaCard } from './components/maps'

// ─── Messaging & Notifications Components ──────────────────
export { InboxPanel } from './components/messaging'
export { PushNotificationCard } from './components/messaging'
export { EmailComposer } from './components/messaging'
export { SmsPreview } from './components/messaging'
export { NotificationPreferences } from './components/messaging'
export { MessageStatusRow } from './components/messaging'
export { BroadcastComposer } from './components/messaging'
export { UnreadBadgeStack } from './components/messaging'
export { DigestSummaryCard } from './components/messaging'
export { WebhookNotificationCard } from './components/messaging'
