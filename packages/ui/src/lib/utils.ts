import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS classes with proper precedence handling.
 * Combines clsx for conditional classes with tailwind-merge for deduplication.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Format a number with locale-aware separators.
 */
export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat('en-US', options).format(value)
}

/**
 * Format a number as currency.
 */
export function formatCurrency(
  value: number,
  currency = 'USD',
): string {
  return formatNumber(value, { style: 'currency', currency })
}

/**
 * Format a number as a percentage.
 */
export function formatPercent(value: number): string {
  return formatNumber(value / 100, {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })
}

/**
 * Generate a unique ID for component instances.
 */
let counter = 0
export function uniqueId(prefix = 'pui'): string {
  counter += 1
  return `${prefix}-${counter}`
}
