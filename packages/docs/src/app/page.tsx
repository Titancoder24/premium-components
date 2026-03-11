'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  KpiStatCard,
  PricingCard,
  ProgressIndicator,
  GoalProgressCard,
  AlertBanner,
} from '@premiumui/core'

// ─── Animation presets ─────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
}

// ─── Categories for the grid ──────────────────────────────
const categories = [
  { title: 'Dashboard', desc: 'KPI cards, charts, activity feeds', count: 12, href: '/components', icon: '◈' },
  { title: 'Data Tables', desc: 'Sortable, editable, Kanban, virtual', count: 10, href: '/components', icon: '▦' },
  { title: 'Forms', desc: 'Login, multi-step, payments, uploads', count: 12, href: '/components', icon: '◱' },
  { title: 'AI & LLM', desc: 'Chat, streaming, agents, RAG', count: 10, href: '/components', icon: '◎' },
  { title: 'Navigation', desc: 'Sidebar, command palette, tabs', count: 10, href: '/components', icon: '☰' },
  { title: 'Feedback', desc: 'Toast, modal, skeleton, progress', count: 10, href: '/components', icon: '◌' },
  { title: 'Cards', desc: 'Pricing, testimonial, blog, product', count: 10, href: '/components', icon: '▢' },
  { title: 'E-Commerce', desc: 'Cart, checkout, gallery, reviews', count: 8, href: '/components', icon: '◇' },
  { title: 'Developer Tools', desc: 'API playground, logs, JSON, flags', count: 10, href: '/components', icon: '⌥' },
  { title: 'SaaS Platform', desc: 'Billing, teams, permissions, audit', count: 10, href: '/components', icon: '⬡' },
  { title: 'AI Ops', desc: 'LLM playground, prompts, eval, cost', count: 10, href: '/components', icon: '⊛' },
  { title: 'Internal Tools', desc: 'CRUD, approval, reports, config', count: 10, href: '/components', icon: '⚙' },
  { title: 'CLI & Terminal', desc: 'Terminal, diff viewer, cron, MCP', count: 10, href: '/components', icon: '⌨' },
  { title: 'Collaboration', desc: 'Comments, reactions, presence', count: 10, href: '/components', icon: '◉' },
  { title: 'Media', desc: 'Image crop, video, file browser', count: 10, href: '/components', icon: '▶' },
  { title: 'Scheduling', desc: 'Calendar, planner, countdown', count: 10, href: '/components', icon: '◷' },
  { title: 'Maps', desc: 'Location, delivery, geofence', count: 10, href: '/components', icon: '⊕' },
  { title: 'Messaging', desc: 'Inbox, email, SMS, broadcasts', count: 10, href: '/components', icon: '✉' },
  { title: 'Auth', desc: 'Social auth, 2FA, onboarding', count: 6, href: '/components', icon: '⊘' },
  { title: 'Utility', desc: 'Theme switcher, shortcuts, errors', count: 12, href: '/components', icon: '⚡' },
]

// ─── Stats ────────────────────────────────────────────────
const stats = [
  { value: '200+', label: 'Components' },
  { value: '22', label: 'Themes' },
  { value: '100%', label: 'TypeScript' },
  { value: '0', label: 'Dependencies*' },
]

export default function HomePage() {
  const [hoveredCat, setHoveredCat] = useState<string | null>(null)

  return (
    <main className="relative overflow-hidden">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-40" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />

      {/* ─── Hero ─────────────────────────────────────── */}
      <section className="relative mx-auto max-w-7xl px-6 pb-24 pt-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div
            variants={fadeUp}
            custom={0}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            200+ production-ready components
          </motion.div>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="mb-6 text-5xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-6xl lg:text-7xl"
          >
            Build faster with{' '}
            <span className="gradient-text-animated">premium</span>{' '}
            components
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-muted-foreground"
          >
            Production-grade React components with Framer Motion animations,
            22 color themes, dark mode, and full TypeScript support. Copy, paste, ship.
          </motion.p>

          <motion.div variants={fadeUp} custom={3} className="flex items-center justify-center gap-3">
            <Link
              href="/components"
              className="group relative inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:shadow-primary/25 hover:shadow-xl"
            >
              Browse Components
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <div className="flex items-center gap-2 rounded-xl border border-border/50 bg-card/50 px-5 py-3 font-mono text-sm text-muted-foreground backdrop-blur">
              <span className="text-primary">$</span>
              npx premiumui add
            </div>
          </motion.div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mx-auto mt-16 flex max-w-2xl items-center justify-center gap-8 sm:gap-12"
        >
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-bold text-foreground sm:text-3xl">{s.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ─── Live Component Showcase ──────────────────── */}
      <section className="relative border-t border-border/40 bg-muted/20">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-3 text-3xl font-bold tracking-tight text-foreground">
              Live Preview
            </h2>
            <p className="text-muted-foreground">
              Real components, real animations. Not screenshots.
            </p>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* KPI Cards demo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <div className="mb-3 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <span className="h-1 w-1 rounded-full bg-primary" />
                KpiStatCard
              </div>
              <KpiStatCard
                value="$48,290"
                label="Total Revenue"
                trend={12.5}
                trendDirection="up"
                sparklineData={[30, 42, 38, 55, 48, 62, 70, 65, 78]}
              />
              <KpiStatCard
                value="2,847"
                label="Active Users"
                trend={-3.2}
                trendDirection="down"
                sparklineData={[65, 60, 55, 58, 50, 48, 45, 42, 40]}
                variant="compact"
              />
              <KpiStatCard
                value="99.9%"
                label="Uptime"
                trend={0}
                trendDirection="neutral"
                variant="highlighted"
              />
            </motion.div>

            {/* Pricing Card demo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="mb-3 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <span className="h-1 w-1 rounded-full bg-primary" />
                PricingCard
              </div>
              <PricingCard
                planName="Pro"
                price={29}
                period="monthly"
                highlighted
                features={[
                  { text: 'Unlimited components', included: true },
                  { text: '22 color themes', included: true },
                  { text: 'Framer Motion animations', included: true },
                  { text: 'TypeScript support', included: true },
                  { text: 'Priority support', included: true },
                  { text: 'Custom themes', included: false },
                ]}
              />
            </motion.div>

            {/* Mixed components demo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <div className="mb-3 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <span className="h-1 w-1 rounded-full bg-primary" />
                More components
              </div>
              <GoalProgressCard
                label="Q1 Revenue Target"
                current={73500}
                target={100000}
                unit="$"
              />
              <AlertBanner
                variant="info"
                title="New release"
                description="Version 2.0 with 50 new components is now available."
              />
              <div className="rounded-xl border border-border bg-card p-4">
                <ProgressIndicator value={72} showLabel variant="linear" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Category Grid ────────────────────────────── */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-3 text-3xl font-bold tracking-tight text-foreground">
              20 Categories, 200+ Blocks
            </h2>
            <p className="text-muted-foreground">
              Every component you need, organized and ready to ship.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.03 } } }}
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          >
            {categories.map((cat) => (
              <motion.div
                key={cat.title}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
                }}
              >
                <Link
                  href={cat.href}
                  onMouseEnter={() => setHoveredCat(cat.title)}
                  onMouseLeave={() => setHoveredCat(null)}
                  className="group relative flex flex-col gap-2 rounded-xl border border-border/50 bg-card/50 p-4 backdrop-blur transition-all duration-200 hover:border-primary/30 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg opacity-60 transition-opacity group-hover:opacity-100">
                      {cat.icon}
                    </span>
                    <span className="rounded-full bg-muted/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      {cat.count}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">{cat.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{cat.desc}</p>
                  <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    Explore
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Install Section ──────────────────────────── */}
      <section className="border-t border-border/40 bg-muted/10">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="mb-3 text-3xl font-bold tracking-tight text-foreground">
              Get started in seconds
            </h2>
            <p className="mb-10 text-muted-foreground">
              Install individual components or the full package.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2"
          >
            {[
              { title: 'Add a component', code: 'npx premiumui add kpi-stat-card' },
              { title: 'Install package', code: 'npm install @premiumui/core' },
              { title: 'Set theme', code: '<html data-theme="midnight" class="dark">' },
              { title: 'Import & use', code: "import { KpiStatCard } from '@premiumui/core'" },
            ].map((item) => (
              <div
                key={item.title}
                className="group rounded-xl border border-border/50 bg-card/50 p-4 backdrop-blur transition-all hover:border-primary/20"
              >
                <p className="mb-2 text-xs font-medium text-muted-foreground">{item.title}</p>
                <code className="block rounded-lg bg-background/80 p-3 font-mono text-xs text-foreground">
                  {item.code}
                </code>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────── */}
      <footer className="border-t border-border/40">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-2 w-2 rounded-sm bg-primary" />
              <span className="font-semibold text-foreground">Premium<span className="text-primary">UI</span></span>
              <span className="mx-2">·</span>
              <span>200+ components · 22 themes · TypeScript</span>
            </div>
            <div className="flex gap-6 text-xs text-muted-foreground">
              <span className="cursor-pointer transition-colors hover:text-foreground">Changelog</span>
              <span className="cursor-pointer transition-colors hover:text-foreground">License</span>
              <span className="cursor-pointer transition-colors hover:text-foreground">GitHub</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
