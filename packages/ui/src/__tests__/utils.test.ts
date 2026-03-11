import { describe, it, expect, beforeEach } from 'vitest'
import { cn, formatNumber, formatCurrency, formatPercent, uniqueId } from '../lib/utils'

// ─── cn() utility ───────────────────────────────────────────

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'extra')).toBe('base extra')
  })

  it('deduplicates conflicting Tailwind classes', () => {
    expect(cn('p-4', 'p-8')).toBe('p-8')
  })

  it('handles undefined and null gracefully', () => {
    expect(cn('foo', undefined, null, 'bar')).toBe('foo bar')
  })

  it('handles empty inputs', () => {
    expect(cn()).toBe('')
  })

  it('handles arrays of class names', () => {
    expect(cn(['foo', 'bar'])).toBe('foo bar')
  })

  it('merges complex Tailwind conflicts correctly', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('preserves non-conflicting classes', () => {
    expect(cn('bg-red-500', 'text-blue-500', 'p-4')).toBe('bg-red-500 text-blue-500 p-4')
  })
})

// ─── formatNumber() ─────────────────────────────────────────

describe('formatNumber', () => {
  it('formats integers with locale separators', () => {
    expect(formatNumber(1000)).toBe('1,000')
  })

  it('formats large numbers', () => {
    expect(formatNumber(1234567)).toBe('1,234,567')
  })

  it('formats decimals', () => {
    expect(formatNumber(1234.56, { minimumFractionDigits: 2 })).toBe('1,234.56')
  })

  it('formats zero', () => {
    expect(formatNumber(0)).toBe('0')
  })

  it('formats negative numbers', () => {
    expect(formatNumber(-1234)).toBe('-1,234')
  })

  it('accepts custom Intl options', () => {
    const result = formatNumber(0.5, { style: 'percent' })
    expect(result).toBe('50%')
  })
})

// ─── formatCurrency() ───────────────────────────────────────

describe('formatCurrency', () => {
  it('formats USD by default', () => {
    const result = formatCurrency(1234.5)
    expect(result).toContain('1,234.50')
    expect(result).toContain('$')
  })

  it('formats other currencies', () => {
    const result = formatCurrency(1234, 'EUR')
    expect(result).toContain('1,234')
    expect(result).toContain('€')
  })

  it('formats zero', () => {
    const result = formatCurrency(0)
    expect(result).toContain('0.00')
  })

  it('formats negative amounts', () => {
    const result = formatCurrency(-99.99)
    expect(result).toContain('99.99')
  })
})

// ─── formatPercent() ────────────────────────────────────────

describe('formatPercent', () => {
  it('formats a whole number percentage', () => {
    expect(formatPercent(50)).toBe('50.0%')
  })

  it('formats a decimal percentage', () => {
    expect(formatPercent(33.3)).toBe('33.3%')
  })

  it('formats zero', () => {
    expect(formatPercent(0)).toBe('0.0%')
  })

  it('formats 100%', () => {
    expect(formatPercent(100)).toBe('100.0%')
  })

  it('formats values over 100', () => {
    expect(formatPercent(150)).toBe('150.0%')
  })
})

// ─── uniqueId() ─────────────────────────────────────────────

describe('uniqueId', () => {
  it('returns a string with default prefix', () => {
    const id = uniqueId()
    expect(id).toMatch(/^pui-\d+$/)
  })

  it('accepts custom prefix', () => {
    const id = uniqueId('test')
    expect(id).toMatch(/^test-\d+$/)
  })

  it('generates unique IDs on each call', () => {
    const ids = new Set(Array.from({ length: 100 }, () => uniqueId()))
    expect(ids.size).toBe(100)
  })

  it('increments monotonically', () => {
    const id1 = uniqueId()
    const id2 = uniqueId()
    const num1 = parseInt(id1.split('-')[1]!, 10)
    const num2 = parseInt(id2.split('-')[1]!, 10)
    expect(num2).toBeGreaterThan(num1)
  })
})
