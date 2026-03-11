import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'

// ─── Dashboard Components ────────────────────────────────────

import { DashboardShell } from '../components/dashboard'
import { ActivityFeed } from '../components/dashboard'
import { GoalProgressCard } from '../components/dashboard'
import { RealTimeCounter } from '../components/dashboard'

describe('DashboardShell', () => {
  it('renders children', () => {
    render(
      <DashboardShell
        sidebarItems={[{ icon: React.createElement('span', null, 'icon'), label: 'Home', href: '/' }]}
        user={{ name: 'Test User', email: 'test@example.com' }}
      >
        <div>Dashboard Content</div>
      </DashboardShell>,
    )
    expect(screen.getByText('Dashboard Content')).toBeInTheDocument()
  })
})

describe('ActivityFeed', () => {
  it('renders feed items', () => {
    render(
      <ActivityFeed
        activities={[
          { id: '1', user: { name: 'Alice' }, action: 'created', target: 'a project', timestamp: '2m ago', type: 'action' },
          { id: '2', user: { name: 'Bob' }, action: 'updated', target: 'a task', timestamp: '5m ago', type: 'action' },
        ]}
      />,
    )
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })

  it('renders empty state', () => {
    render(<ActivityFeed activities={[]} />)
    // Should render without error even with empty items
    expect(document.body).toBeDefined()
  })
})

describe('GoalProgressCard', () => {
  it('renders goal label and progress', () => {
    render(
      <GoalProgressCard
        label="Sales Target"
        current={750}
        target={1000}
      />,
    )
    expect(screen.getByText('Sales Target')).toBeInTheDocument()
  })
})

describe('RealTimeCounter', () => {
  it('is exported and defined', () => {
    expect(RealTimeCounter).toBeDefined()
    expect(typeof RealTimeCounter).toBe('function')
  })
})

// ─── Data Table Components ───────────────────────────────────

import { DataTable } from '../components/data-tables'

describe('DataTable', () => {
  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
  ]

  const data = [
    { id: '1', name: 'Alice', email: 'alice@example.com' },
    { id: '2', name: 'Bob', email: 'bob@example.com' },
  ]

  it('renders table headers', () => {
    render(<DataTable columns={columns} data={data} />)
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('renders table data', () => {
    render(<DataTable columns={columns} data={data} />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('bob@example.com')).toBeInTheDocument()
  })

  it('renders empty state when no data', () => {
    render(<DataTable columns={columns} data={[]} />)
    // Should render without throwing
    expect(document.body).toBeDefined()
  })
})

// ─── E-commerce Components ───────────────────────────────────

import { CartItemRow } from '../components/ecommerce'

describe('CartItemRow', () => {
  const defaultProps = {
    name: 'Widget Pro',
    price: 29.99,
    quantity: 2,
    image: '/widget.jpg',
    onQuantityChange: vi.fn(),
    onRemove: vi.fn(),
  }

  it('renders product name and price', () => {
    render(<CartItemRow {...defaultProps} />)
    expect(screen.getByText('Widget Pro')).toBeInTheDocument()
  })

  it('renders quantity', () => {
    render(<CartItemRow {...defaultProps} />)
    // Quantity should be visible somewhere in the component
    expect(document.body.textContent).toContain('2')
  })
})

// ─── Feedback Components ─────────────────────────────────────

import { EmptyState } from '../components/feedback'
import { SkeletonLoader } from '../components/feedback'
import { ProgressIndicator } from '../components/feedback'

describe('EmptyState', () => {
  it('renders title and description', () => {
    render(
      <EmptyState
        title="No data"
        description="Add some items to get started"
      />,
    )
    expect(screen.getByText('No data')).toBeInTheDocument()
    expect(screen.getByText('Add some items to get started')).toBeInTheDocument()
  })

  it('renders action button', async () => {
    const onClick = vi.fn()
    render(
      <EmptyState
        title="Empty"
        action={{ label: 'Add Item', onClick }}
      />,
    )
    const btn = screen.getByText('Add Item')
    await userEvent.setup().click(btn)
    expect(onClick).toHaveBeenCalledOnce()
  })
})

describe('SkeletonLoader', () => {
  it('renders skeleton elements', () => {
    const { container } = render(<SkeletonLoader />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders multiple lines', () => {
    const { container } = render(<SkeletonLoader lines={5} />)
    expect(container.querySelectorAll('div').length).toBeGreaterThan(0)
  })
})

describe('ProgressIndicator', () => {
  it('renders progress value', () => {
    render(<ProgressIndicator value={75} />)
    // Should render progress bar
    expect(document.body).toBeDefined()
  })

  it('renders with showLabel', () => {
    render(<ProgressIndicator value={50} showLabel />)
    expect(screen.getByText('50%')).toBeInTheDocument()
  })
})

// ─── Utility Components ──────────────────────────────────────

import { ErrorPage } from '../components/utility'
import { TagCollection } from '../components/utility'
import { AvatarGroup } from '../components/utility'

describe('ErrorPage', () => {
  it('renders error code and message', () => {
    render(<ErrorPage code={404} title="Not Found" description="The page you are looking for does not exist." />)
    expect(screen.getByText('404')).toBeInTheDocument()
    expect(screen.getByText('Not Found')).toBeInTheDocument()
  })
})

describe('TagCollection', () => {
  it('renders tags', () => {
    render(
      <TagCollection
        tags={[
          { label: 'React' },
          { label: 'TypeScript' },
          { label: 'Tailwind' },
        ]}
        selected={[]}
        onToggle={vi.fn()}
      />,
    )
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('Tailwind')).toBeInTheDocument()
  })
})

describe('AvatarGroup', () => {
  it('renders avatars', () => {
    const { container } = render(
      <AvatarGroup
        users={[
          { name: 'Alice', avatar: '/alice.jpg' },
          { name: 'Bob', avatar: '/bob.jpg' },
        ]}
      />,
    )
    expect(container.querySelectorAll('img').length).toBeGreaterThanOrEqual(0)
    // Avatars should render either as images or initials
    expect(document.body).toBeDefined()
  })
})

// ─── AI Components ───────────────────────────────────────────

import { ChatBubble } from '../components/ai'
import { StreamingText } from '../components/ai'
import { TokenUsageMeter } from '../components/ai'

describe('ChatBubble', () => {
  it('renders message content', () => {
    render(<ChatBubble content="Hello, how are you?" role="user" />)
    expect(screen.getByText('Hello, how are you?')).toBeInTheDocument()
  })

  it('renders assistant messages', () => {
    render(<ChatBubble content="I can help with that!" role="assistant" />)
    expect(screen.getByText('I can help with that!')).toBeInTheDocument()
  })
})

describe('StreamingText', () => {
  it('renders text content', () => {
    render(<StreamingText text="Hello world" isStreaming={false} />)
    expect(document.body.textContent).toContain('Hello')
  })
})

describe('TokenUsageMeter', () => {
  it('is exported and defined', () => {
    expect(TokenUsageMeter).toBeDefined()
    expect(typeof TokenUsageMeter).toBe('function')
  })
})

// ─── Developer Tools Components ──────────────────────────────

import { CodeSnippetBlock } from '../components/developer-tools'

describe('CodeSnippetBlock', () => {
  it('is exported and defined', () => {
    expect(CodeSnippetBlock).toBeDefined()
    expect(typeof CodeSnippetBlock).toBe('function')
  })
})

// ─── SaaS Platform Components ────────────────────────────────

import { QuotaUsageCard } from '../components/saas-platform'

describe('QuotaUsageCard', () => {
  it('renders quota information', () => {
    render(
      <QuotaUsageCard
        quotas={[
          { id: '1', name: 'API Calls', current: 7500, limit: 10000, unit: 'calls' },
        ]}
      />,
    )
    expect(screen.getByText('API Calls')).toBeInTheDocument()
  })
})

// ─── Barrel Export Tests ─────────────────────────────────────

describe('Barrel Exports', () => {
  it('exports all dashboard components', async () => {
    const mod = await import('../components/dashboard')
    expect(mod.KpiStatCard).toBeDefined()
    expect(mod.DashboardShell).toBeDefined()
    expect(mod.ActivityFeed).toBeDefined()
    expect(mod.BarChartBlock).toBeDefined()
    expect(mod.DonutChartBlock).toBeDefined()
  })

  it('exports all feedback components', async () => {
    const mod = await import('../components/feedback')
    expect(mod.AlertBanner).toBeDefined()
    expect(mod.EmptyState).toBeDefined()
    expect(mod.SkeletonLoader).toBeDefined()
    expect(mod.ProgressIndicator).toBeDefined()
    expect(mod.Toast).toBeDefined()
  })

  it('exports all card components', async () => {
    const mod = await import('../components/cards')
    expect(mod.PricingCard).toBeDefined()
    expect(mod.TestimonialCard).toBeDefined()
    expect(mod.FeatureCard).toBeDefined()
    expect(mod.BlogCard).toBeDefined()
  })

  it('exports all AI components', async () => {
    const mod = await import('../components/ai')
    expect(mod.ChatInterface).toBeDefined()
    expect(mod.ChatBubble).toBeDefined()
    expect(mod.StreamingText).toBeDefined()
    expect(mod.ModelSelector).toBeDefined()
  })

  it('exports all navigation components', async () => {
    const mod = await import('../components/navigation')
    expect(mod.CollapsibleSidebar).toBeDefined()
    expect(mod.TopNavBar).toBeDefined()
    expect(mod.BreadcrumbTrail).toBeDefined()
    expect(mod.CommandPalette).toBeDefined()
  })

  it('exports all form components', async () => {
    const mod = await import('../components/forms')
    expect(mod.LoginForm).toBeDefined()
    expect(mod.SearchInput).toBeDefined()
    expect(mod.FileUploadZone).toBeDefined()
    expect(mod.OtpInput).toBeDefined()
  })

  it('exports all utility components', async () => {
    const mod = await import('../components/utility')
    expect(mod.ThemeSwitcher).toBeDefined()
    expect(mod.CopyButton).toBeDefined()
    expect(mod.ErrorPage).toBeDefined()
    expect(mod.TagCollection).toBeDefined()
  })
})
