'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  KpiStatCard,
  KpiGrid,
  PricingCard,
  AlertBanner,
  GoalProgressCard,
  ProgressIndicator,
  OtpInput,
  SkeletonLoader,
  EmptyState,
  CopyButton,
} from '@premiumui/core'

// ─── Component registry with live demos ──────────────────
interface DemoConfig {
  name: string
  category: string
  description: string
  component: React.ReactNode
  code: string
  props: { name: string; type: string; default?: string }[]
}

const demos: Record<string, DemoConfig> = {
  'kpi-stat-card': {
    name: 'KPI Stat Card',
    category: 'Dashboard & Analytics',
    description: 'Animated stat card with trend indicator, sparkline chart, and smooth number counting animation.',
    component: (
      <div className="grid gap-4 sm:grid-cols-2">
        <KpiStatCard value="$48,290" label="Total Revenue" trend={12.5} trendDirection="up" sparklineData={[30,42,38,55,48,62,70,65,78]} />
        <KpiStatCard value="2,847" label="Active Users" trend={-3.2} trendDirection="down" sparklineData={[65,60,55,58,50,48,45,42,40]} />
        <KpiStatCard value="99.9%" label="Uptime" trend={0} trendDirection="neutral" variant="highlighted" />
        <KpiStatCard value="$12.40" label="Avg Order" trend={5.8} trendDirection="up" variant="compact" sparklineData={[8,10,9,12,11,14,13]} />
      </div>
    ),
    code: `import { KpiStatCard } from '@premiumui/core'

<KpiStatCard
  value="$48,290"
  label="Total Revenue"
  trend={12.5}
  trendDirection="up"
  sparklineData={[30, 42, 38, 55, 48, 62, 70, 65, 78]}
/>`,
    props: [
      { name: 'value', type: 'string | number' },
      { name: 'label', type: 'string' },
      { name: 'trend', type: 'number' },
      { name: 'trendDirection', type: "'up' | 'down' | 'neutral'" },
      { name: 'icon', type: 'ReactNode', default: 'undefined' },
      { name: 'sparklineData', type: 'number[]', default: 'undefined' },
      { name: 'loading', type: 'boolean', default: 'false' },
      { name: 'variant', type: "'default' | 'compact' | 'highlighted'", default: "'default'" },
    ],
  },
  'kpi-grid': {
    name: 'KPI Grid',
    category: 'Dashboard & Analytics',
    description: 'Responsive grid layout for KPI stat cards with staggered entrance animations.',
    component: (
      <KpiGrid cards={[
        { value: '$48,290', label: 'Revenue', trend: 12.5, trendDirection: 'up' as const, sparklineData: [30,42,38,55,48,62,70] },
        { value: '2,847', label: 'Users', trend: -3.2, trendDirection: 'down' as const, sparklineData: [65,60,55,58,50,48,45] },
        { value: '99.9%', label: 'Uptime', trend: 0, trendDirection: 'neutral' as const },
        { value: '342', label: 'Orders', trend: 8.1, trendDirection: 'up' as const, sparklineData: [20,25,30,28,35,40,38] },
      ]} />
    ),
    code: `import { KpiGrid } from '@premiumui/core'

<KpiGrid
  cards={[
    { value: '$48,290', label: 'Revenue', trend: 12.5, trendDirection: 'up' },
    { value: '2,847', label: 'Users', trend: -3.2, trendDirection: 'down' },
  ]}
  columns="auto"
/>`,
    props: [
      { name: 'cards', type: 'KpiStatCardProps[]' },
      { name: 'columns', type: "2 | 3 | 4 | 'auto'", default: "'auto'" },
      { name: 'loading', type: 'boolean', default: 'false' },
    ],
  },
  'pricing-card': {
    name: 'Pricing Card',
    category: 'Cards & Content',
    description: 'Animated pricing card with feature list, highlighted variant with pulsing glow, and smooth price transitions.',
    component: (
      <div className="grid gap-4 sm:grid-cols-2">
        <PricingCard planName="Starter" price={0} period="monthly" features={[{text:'5 components',included:true},{text:'1 theme',included:true},{text:'Community support',included:true},{text:'Priority support',included:false}]} ctaLabel="Get Started Free" />
        <PricingCard planName="Pro" price={29} period="monthly" highlighted features={[{text:'All 200 components',included:true},{text:'22 themes',included:true},{text:'Priority support',included:true},{text:'Custom themes',included:true}]} ctaLabel="Upgrade to Pro" />
      </div>
    ),
    code: `import { PricingCard } from '@premiumui/core'

<PricingCard
  planName="Pro"
  price={29}
  period="monthly"
  highlighted
  features={[
    { text: 'All 200 components', included: true },
    { text: '22 themes', included: true },
  ]}
/>`,
    props: [
      { name: 'planName', type: 'string' },
      { name: 'price', type: 'number' },
      { name: 'period', type: "'monthly' | 'annually'" },
      { name: 'features', type: 'PricingFeature[]' },
      { name: 'highlighted', type: 'boolean', default: 'false' },
      { name: 'ctaLabel', type: 'string', default: "'Get Started'" },
      { name: 'onSelect', type: '() => void', default: 'undefined' },
    ],
  },
  'alert-banner': {
    name: 'Alert Banner',
    category: 'Feedback & Overlays',
    description: 'Animated alert banners with four variants, optional dismiss button and action.',
    component: (
      <div className="space-y-3">
        <AlertBanner variant="info" title="Info" description="This is an informational message." />
        <AlertBanner variant="success" title="Success" description="Operation completed successfully." />
        <AlertBanner variant="warning" title="Warning" description="Please review before proceeding." />
        <AlertBanner variant="error" title="Error" description="Something went wrong. Please try again." dismissible />
      </div>
    ),
    code: `import { AlertBanner } from '@premiumui/core'

<AlertBanner
  variant="info"
  title="Info"
  description="This is an informational message."
  dismissible
/>`,
    props: [
      { name: 'title', type: 'string', default: 'undefined' },
      { name: 'description', type: 'string', default: 'undefined' },
      { name: 'variant', type: "'info' | 'success' | 'warning' | 'error'", default: "'info'" },
      { name: 'dismissible', type: 'boolean', default: 'false' },
      { name: 'action', type: '{ label: string; onClick: () => void }', default: 'undefined' },
    ],
  },
  'goal-progress': {
    name: 'Goal Progress Card',
    category: 'Dashboard & Analytics',
    description: 'Animated progress card showing current vs target with visual bar and percentage.',
    component: (
      <div className="grid gap-4 sm:grid-cols-2">
        <GoalProgressCard label="Q1 Revenue" current={73500} target={100000} unit="$" />
        <GoalProgressCard label="New Signups" current={450} target={500} />
      </div>
    ),
    code: `import { GoalProgressCard } from '@premiumui/core'

<GoalProgressCard
  label="Q1 Revenue"
  current={73500}
  target={100000}
  unit="$"
/>`,
    props: [
      { name: 'label', type: 'string' },
      { name: 'current', type: 'number' },
      { name: 'target', type: 'number' },
      { name: 'unit', type: 'string', default: 'undefined' },
      { name: 'deadline', type: 'Date', default: 'undefined' },
      { name: 'variant', type: "'circular' | 'linear'", default: "'linear'" },
    ],
  },
  'progress-indicator': {
    name: 'Progress Indicator',
    category: 'Feedback & Overlays',
    description: 'Smooth animated progress bar with linear and circular variants.',
    component: (
      <div className="space-y-6">
        <ProgressIndicator value={72} showLabel variant="linear" />
        <ProgressIndicator value={45} showLabel variant="linear" size="lg" />
        <div className="flex gap-6">
          <ProgressIndicator value={88} showLabel variant="circular" />
          <ProgressIndicator value={45} showLabel variant="circular" size="sm" />
          <ProgressIndicator indeterminate variant="circular" />
        </div>
      </div>
    ),
    code: `import { ProgressIndicator } from '@premiumui/core'

<ProgressIndicator value={72} showLabel variant="linear" />
<ProgressIndicator value={88} showLabel variant="circular" />
<ProgressIndicator indeterminate variant="circular" />`,
    props: [
      { name: 'value', type: 'number', default: '0' },
      { name: 'variant', type: "'linear' | 'circular'", default: "'linear'" },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'" },
      { name: 'showLabel', type: 'boolean', default: 'false' },
      { name: 'indeterminate', type: 'boolean', default: 'false' },
    ],
  },
}

// ─── Fallback for components without live demo ───────────
function FallbackDemo({ id }: { id: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-border/50 bg-muted/10 p-12 text-center">
      <div className="mb-4 text-5xl opacity-20">◎</div>
      <p className="text-sm font-medium text-muted-foreground">
        Live demo for <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{id}</code> is being added
      </p>
      <p className="mt-2 text-xs text-muted-foreground/60">
        Import and use it directly in your project
      </p>
    </div>
  )
}

// ─── Component metadata lookup ───────────────────────────
const allComponentNames: Record<string, { name: string; category: string }> = {
  'kpi-stat-card': { name: 'KPI Stat Card', category: 'Dashboard & Analytics' },
  'kpi-grid': { name: 'KPI Grid', category: 'Dashboard & Analytics' },
  'revenue-chart': { name: 'Revenue Chart', category: 'Dashboard & Analytics' },
  'bar-chart': { name: 'Bar Chart', category: 'Dashboard & Analytics' },
  'donut-chart': { name: 'Donut Chart', category: 'Dashboard & Analytics' },
  'activity-feed': { name: 'Activity Feed', category: 'Dashboard & Analytics' },
  'pricing-card': { name: 'Pricing Card', category: 'Cards & Content' },
  'pricing-table': { name: 'Pricing Table', category: 'Cards & Content' },
  'testimonial-card': { name: 'Testimonial Card', category: 'Cards & Content' },
  'feature-card': { name: 'Feature Card', category: 'Cards & Content' },
  'blog-card': { name: 'Blog Card', category: 'Cards & Content' },
  'chat-interface': { name: 'Chat Interface', category: 'AI & LLM Patterns' },
  'chat-bubble': { name: 'Chat Bubble', category: 'AI & LLM Patterns' },
  'alert-banner': { name: 'Alert Banner', category: 'Feedback & Overlays' },
  'progress-indicator': { name: 'Progress Indicator', category: 'Feedback & Overlays' },
  'goal-progress': { name: 'Goal Progress Card', category: 'Dashboard & Analytics' },
  'login-form': { name: 'Login Form', category: 'Forms & Inputs' },
  'data-table': { name: 'Data Table', category: 'Data Tables & Lists' },
}

export default function ComponentDetailPage() {
  const params = useParams()
  const id = params.id as string
  const demo = demos[id]
  const meta = demo
    ? { name: demo.name, category: demo.category }
    : allComponentNames[id] ?? { name: id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), category: 'Component' }

  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'props'>('preview')

  return (
    <main className="relative">
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-30" />

      <div className="relative mx-auto max-w-5xl px-6 py-12">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 flex items-center gap-2 text-xs text-muted-foreground"
        >
          <Link href="/components" className="hover:text-foreground transition-colors">Components</Link>
          <span>/</span>
          <span className="text-foreground">{meta.name}</span>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="mb-2 flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{meta.name}</h1>
            <span className="rounded-full bg-muted/60 px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              {meta.category}
            </span>
          </div>
          {demo && <p className="text-muted-foreground">{demo.description}</p>}
        </motion.div>

        {/* Install */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 rounded-xl border border-border/50 bg-card/50 p-4 backdrop-blur"
        >
          <div className="flex items-center justify-between">
            <code className="text-xs text-muted-foreground">
              npx premiumui add {id}
            </code>
            <CopyButton text={`npx premiumui add ${id}`} />
          </div>
        </motion.div>

        {demo ? (
          <>
            {/* Tabs */}
            <div className="mb-6 flex gap-1 rounded-lg border border-border/50 bg-card/30 p-1 backdrop-blur">
              {(['preview', 'code', 'props'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-md px-4 py-2 text-xs font-medium capitalize transition-all ${
                    activeTab === tab
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'preview' && (
                <div className="rounded-xl border border-border/50 bg-card/30 p-8 backdrop-blur">
                  {demo.component}
                </div>
              )}
              {activeTab === 'code' && (
                <div className="rounded-xl border border-border/50 bg-background/80 backdrop-blur">
                  <div className="flex items-center justify-between border-b border-border/30 px-4 py-2">
                    <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Usage</span>
                    <CopyButton text={demo.code} />
                  </div>
                  <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-foreground/90">
                    <code>{demo.code}</code>
                  </pre>
                </div>
              )}
              {activeTab === 'props' && (
                <div className="rounded-xl border border-border/50 bg-card/30 backdrop-blur overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/30 bg-muted/20">
                        <th className="px-4 py-3 text-left font-semibold text-foreground">Prop</th>
                        <th className="px-4 py-3 text-left font-semibold text-foreground">Type</th>
                        <th className="px-4 py-3 text-left font-semibold text-foreground">Default</th>
                      </tr>
                    </thead>
                    <tbody>
                      {demo.props.map((p) => (
                        <tr key={p.name} className="border-b border-border/20 last:border-0">
                          <td className="px-4 py-2.5 font-mono text-primary">{p.name}</td>
                          <td className="px-4 py-2.5 text-muted-foreground">{p.type}</td>
                          <td className="px-4 py-2.5 text-muted-foreground/60">{p.default ?? '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </>
        ) : (
          <FallbackDemo id={id} />
        )}
      </div>
    </main>
  )
}
