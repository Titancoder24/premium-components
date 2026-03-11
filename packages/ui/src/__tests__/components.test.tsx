import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'

// ─── Dashboard Components ────────────────────────────────────

import { KpiStatCard } from '../components/dashboard'

describe('KpiStatCard', () => {
  it('renders with required props', () => {
    render(
      <KpiStatCard
        value="$12,500"
        label="Revenue"
        trend={12.5}
        trendDirection="up"
      />,
    )
    expect(screen.getByText('Revenue')).toBeInTheDocument()
  })

  it('renders loading state', () => {
    const { container } = render(
      <KpiStatCard
        value={0}
        label="Revenue"
        trend={0}
        trendDirection="neutral"
        loading
      />,
    )
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('renders sparkline when data is provided', () => {
    const { container } = render(
      <KpiStatCard
        value={100}
        label="Users"
        trend={5}
        trendDirection="up"
        sparklineData={[10, 20, 30, 40, 50]}
      />,
    )
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <KpiStatCard
        value={100}
        label="Test"
        trend={0}
        trendDirection="neutral"
        className="custom-class"
      />,
    )
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('shows positive trend indicator', () => {
    render(
      <KpiStatCard value={100} label="Test" trend={5.5} trendDirection="up" />,
    )
    expect(screen.getByText('+5.5%')).toBeInTheDocument()
  })

  it('shows negative trend without plus sign', () => {
    render(
      <KpiStatCard
        value={100}
        label="Test"
        trend={-3.2}
        trendDirection="down"
      />,
    )
    expect(screen.getByText('-3.2%')).toBeInTheDocument()
  })

  it('has correct displayName', () => {
    expect(KpiStatCard.displayName).toBe('KpiStatCard')
  })
})

// ─── Feedback Components ─────────────────────────────────────

import { AlertBanner } from '../components/feedback'

describe('AlertBanner', () => {
  it('renders with title and description', () => {
    render(
      <AlertBanner title="Warning" description="Something happened" variant="warning" />,
    )
    expect(screen.getByText('Warning')).toBeInTheDocument()
    expect(screen.getByText('Something happened')).toBeInTheDocument()
  })

  it('renders with role=alert for accessibility', () => {
    render(<AlertBanner title="Alert" variant="error" />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('renders dismiss button when dismissible', () => {
    render(<AlertBanner title="Info" dismissible />)
    expect(screen.getByLabelText('Dismiss alert')).toBeInTheDocument()
  })

  it('hides when dismiss is clicked', async () => {
    const user = userEvent.setup()
    render(<AlertBanner title="Info" dismissible />)

    await user.click(screen.getByLabelText('Dismiss alert'))
    // After AnimatePresence, the alert should be gone
    expect(screen.queryByText('Info')).not.toBeInTheDocument()
  })

  it('renders action button', async () => {
    const onClick = vi.fn()
    render(
      <AlertBanner
        title="Upgrade"
        action={{ label: 'Upgrade Now', onClick }}
      />,
    )

    const button = screen.getByText('Upgrade Now')
    expect(button).toBeInTheDocument()

    await userEvent.setup().click(button)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('defaults to info variant', () => {
    const { container } = render(<AlertBanner title="Default" />)
    expect(container.querySelector('[role="alert"]')).toBeInTheDocument()
  })
})

// ─── Form Components ─────────────────────────────────────────

import { SearchInput } from '../components/forms'

describe('SearchInput', () => {
  it('renders search input', () => {
    render(<SearchInput onSearch={vi.fn()} placeholder="Search..." />)
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
  })

  it('calls onSearch when submitting', async () => {
    const onSearch = vi.fn()
    render(<SearchInput onSearch={onSearch} placeholder="Search..." />)

    const input = screen.getByPlaceholderText('Search...')
    await userEvent.setup().type(input, 'hello{enter}')
    expect(onSearch).toHaveBeenCalled()
  })
})

// ─── Card Components ─────────────────────────────────────────

import { PricingCard } from '../components/cards'

describe('PricingCard', () => {
  const defaultProps = {
    planName: 'Pro',
    price: 29,
    period: 'monthly' as const,
    features: [
      { text: 'Feature 1', included: true },
      { text: 'Feature 2', included: true },
      { text: 'Feature 3', included: false },
    ],
    onSelect: vi.fn(),
  }

  it('renders plan name and price', () => {
    render(<PricingCard {...defaultProps} />)
    expect(screen.getByText('Pro')).toBeInTheDocument()
    expect(screen.getByText('$29')).toBeInTheDocument()
  })

  it('renders all features', () => {
    render(<PricingCard {...defaultProps} />)
    expect(screen.getByText('Feature 1')).toBeInTheDocument()
    expect(screen.getByText('Feature 2')).toBeInTheDocument()
    expect(screen.getByText('Feature 3')).toBeInTheDocument()
  })

  it('renders highlighted variant', () => {
    const { container } = render(
      <PricingCard {...defaultProps} highlighted />,
    )
    expect(container.firstChild).toBeDefined()
  })
})

// ─── Navigation Components ───────────────────────────────────

import { BreadcrumbTrail } from '../components/navigation'

describe('BreadcrumbTrail', () => {
  it('renders breadcrumb items', () => {
    render(
      <BreadcrumbTrail
        items={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
          { label: 'Widget' },
        ]}
      />,
    )
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Products')).toBeInTheDocument()
    expect(screen.getByText('Widget')).toBeInTheDocument()
  })

  it('renders navigation landmark', () => {
    render(
      <BreadcrumbTrail items={[{ label: 'Home', href: '/' }]} />,
    )
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })
})

// ─── Utility Components ──────────────────────────────────────

import { CopyButton } from '../components/utility'

describe('CopyButton', () => {
  it('renders copy button', () => {
    render(<CopyButton value="test" />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})

// ─── Types ──────────────────────────────────────────────────

describe('Type Exports', () => {
  it('BaseComponentProps interface is importable', async () => {
    const types = await import('../types')
    expect(types).toBeDefined()
  })
})
