'use client'

import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.08 },
  }),
}

const steps = [
  {
    title: 'Install the package',
    code: 'npm install @premiumui/core framer-motion lucide-react',
    description: 'Install the core package along with its peer dependencies.',
  },
  {
    title: 'Add Tailwind CSS config',
    code: `// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@premiumui/core/dist/**/*.{js,mjs}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
    },
  },
}
export default config`,
    description: 'Extend your Tailwind config to include Premium UI color tokens.',
  },
  {
    title: 'Import the theme CSS',
    code: `/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@import '@premiumui/core/themes.css';`,
    description: 'Import the theme stylesheet to activate CSS custom properties.',
  },
  {
    title: 'Set your theme',
    code: `<!-- Choose from 22 themes + dark mode -->
<html data-theme="midnight" class="dark">`,
    description: 'Pick one of 22 built-in themes. Add the "dark" class for dark mode.',
  },
  {
    title: 'Import and use',
    code: `import { KpiStatCard, PricingCard } from '@premiumui/core'

export function Dashboard() {
  return (
    <KpiStatCard
      value="$48,290"
      label="Total Revenue"
      trend={12.5}
      trendDirection="up"
      sparklineData={[30, 42, 38, 55, 48, 62, 70]}
    />
  )
}`,
    description: 'Import any component and start building.',
  },
]

const themes = [
  'slate', 'ocean', 'sky', 'cobalt', 'sapphire', 'steel', 'arctic',
  'forest', 'emerald', 'violet', 'rose', 'amber', 'neon', 'terminal',
  'monochrome', 'paper', 'mint', 'teal', 'crimson', 'gold', 'synthwave', 'midnight',
]

export default function GettingStartedPage() {
  return (
    <main className="relative">
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-30" />

      <div className="relative mx-auto max-w-3xl px-6 py-12">
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }}>
          <motion.h1
            variants={fadeUp}
            custom={0}
            className="mb-2 text-3xl font-bold tracking-tight text-foreground"
          >
            Getting Started
          </motion.h1>
          <motion.p
            variants={fadeUp}
            custom={1}
            className="mb-12 text-muted-foreground"
          >
            Get Premium UI running in your project in under 2 minutes.
          </motion.p>

          {/* Steps */}
          <div className="space-y-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                variants={fadeUp}
                custom={i + 2}
                className="group rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur transition-all hover:border-primary/20"
              >
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">
                    {i + 1}
                  </span>
                  <h2 className="text-base font-semibold text-foreground">{step.title}</h2>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">{step.description}</p>
                <pre className="overflow-x-auto rounded-lg bg-background/80 p-4 text-xs leading-relaxed text-foreground/90">
                  <code>{step.code}</code>
                </pre>
              </motion.div>
            ))}
          </div>

          {/* Available themes */}
          <motion.div
            variants={fadeUp}
            custom={8}
            className="mt-12 rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur"
          >
            <h2 className="mb-4 text-base font-semibold text-foreground">Available Themes</h2>
            <div className="flex flex-wrap gap-2">
              {themes.map((t) => (
                <span
                  key={t}
                  className="rounded-lg border border-border/50 bg-muted/30 px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </motion.div>

          {/* CLI */}
          <motion.div
            variants={fadeUp}
            custom={9}
            className="mt-8 rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur"
          >
            <h2 className="mb-4 text-base font-semibold text-foreground">CLI — Add Individual Components</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Use the CLI to add only the components you need. No bloat.
            </p>
            <pre className="overflow-x-auto rounded-lg bg-background/80 p-4 text-xs leading-relaxed text-foreground/90">
              <code>{`# Add a single component
npx premiumui add kpi-stat-card

# Add multiple components
npx premiumui add kpi-stat-card pricing-card chat-interface

# List all available components
npx premiumui list`}</code>
            </pre>
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}
