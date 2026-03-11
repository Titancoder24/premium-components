'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  KpiStatCard,
  PricingCard,
  AlertBanner,
  GoalProgressCard,
} from '@premiumui/core'

// ─── All components metadata ─────────────────────────────
interface ComponentMeta {
  id: string
  name: string
  category: string
  blocks: number
  updated?: boolean
  preview?: React.ReactNode
}

const componentPreviews: Record<string, React.ReactNode> = {
  'kpi-stat-card': (
    <KpiStatCard value="$48.2k" label="Revenue" trend={12.5} trendDirection="up" sparklineData={[30,42,38,55,48,62,70]} variant="compact" />
  ),
  'pricing-card': (
    <div className="scale-[0.85] origin-top-left">
      <PricingCard planName="Pro" price={29} period="monthly" highlighted features={[{text:'All components',included:true},{text:'22 themes',included:true},{text:'Priority support',included:false}]} />
    </div>
  ),
  'alert-banner': (
    <AlertBanner variant="info" title="Update available" description="New version 2.0 is ready." />
  ),
  'goal-progress': (
    <GoalProgressCard label="Q1 Target" current={73500} target={100000} unit="$" />
  ),
}

const allComponents: ComponentMeta[] = [
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
  { id: 'environment-variable-editor', name: 'Env Variable Editor', category: 'Developer Tools', blocks: 2 },
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

// ─── Component card ──────────────────────────────────────
function ComponentCard({ comp }: { comp: ComponentMeta }) {
  const preview = componentPreviews[comp.id]

  return (
    <Link
      href={`/components/${comp.id}`}
      className="group relative flex flex-col rounded-xl border border-border/50 bg-card/50 backdrop-blur transition-all duration-200 hover:border-primary/30 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5"
    >
      {comp.updated && (
        <span className="absolute -top-2 left-3 z-10 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
          NEW
        </span>
      )}

      {/* Preview area */}
      <div className="relative flex min-h-[140px] items-center justify-center overflow-hidden rounded-t-xl border-b border-border/30 bg-muted/20 p-4">
        {preview ? (
          <div className="w-full">{preview}</div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-1">
              <div className="h-2 w-8 rounded-full bg-muted-foreground/10" />
              <div className="h-2 w-12 rounded-full bg-muted-foreground/10" />
              <div className="h-2 w-6 rounded-full bg-muted-foreground/10" />
            </div>
            <div className="h-8 w-24 rounded-lg bg-muted-foreground/5 ring-1 ring-muted-foreground/10" />
            <div className="flex gap-1">
              <div className="h-1.5 w-10 rounded-full bg-muted-foreground/10" />
              <div className="h-1.5 w-14 rounded-full bg-muted-foreground/10" />
            </div>
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
          <span className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-lg">
            View Component
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
          {comp.name}
        </h3>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">
            {comp.blocks} {comp.blocks === 1 ? 'variant' : 'variants'}
          </span>
          <svg className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}

// ─── Main page ───────────────────────────────────────────
export default function ComponentsPage() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = useMemo(
    () => [...new Set(allComponents.map((c) => c.category))],
    [],
  )

  const filtered = useMemo(() => {
    let result = allComponents
    if (selectedCategory) {
      result = result.filter((c) => c.category === selectedCategory)
    }
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.id.includes(q),
      )
    }
    return result
  }, [search, selectedCategory])

  const groupedByCategory = useMemo(() => {
    const groups: Record<string, ComponentMeta[]> = {}
    for (const comp of filtered) {
      if (!groups[comp.category]) groups[comp.category] = []
      groups[comp.category].push(comp)
    }
    return groups
  }, [filtered])

  return (
    <main className="relative">
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-30" />

      <div className="relative mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
            Components
          </h1>
          <p className="text-muted-foreground">
            {allComponents.length} production-ready blocks across {categories.length} categories.
          </p>
        </motion.div>

        {/* Search + Filter */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center"
        >
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search components..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border/50 bg-card/50 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 backdrop-blur outline-none transition-all focus:border-primary/30 focus:ring-2 focus:ring-primary/10"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                !selectedCategory
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'border border-border/50 text-muted-foreground hover:border-primary/30 hover:text-foreground'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'border border-border/50 text-muted-foreground hover:border-primary/30 hover:text-foreground'
                }`}
              >
                {cat.split(' ')[0]}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results count */}
        <div className="mb-6 text-xs text-muted-foreground">
          Showing {filtered.length} of {allComponents.length} components
        </div>

        {/* Component grid by category */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory ?? 'all' + search}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {Object.entries(groupedByCategory).map(([category, comps]) => (
              <section key={category} className="mb-12">
                <div className="mb-4 flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-foreground">{category}</h2>
                  <span className="rounded-full bg-muted/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {comps.length}
                  </span>
                  <div className="h-px flex-1 bg-border/30" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {comps.map((comp) => (
                    <ComponentCard key={comp.id} comp={comp} />
                  ))}
                </div>
              </section>
            ))}

            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 text-4xl opacity-20">&#x2205;</div>
                <p className="text-lg font-medium text-muted-foreground">No components found</p>
                <p className="text-sm text-muted-foreground/60">Try a different search term</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  )
}
