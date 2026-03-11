import type { ReactNode } from 'react'

/** Base props shared by many components */
export interface BaseComponentProps {
  /** Additional CSS class names */
  className?: string
  /** Children content */
  children?: ReactNode
}

/** Navigation item used in sidebars and menus */
export interface NavItem {
  /** Icon to display */
  icon?: ReactNode
  /** Display label */
  label: string
  /** Link href */
  href: string
  /** Optional badge count */
  badge?: number
  /** Whether this item is active */
  active?: boolean
  /** Nested children items */
  children?: NavItem[]
}

/** User object used across auth and profile components */
export interface User {
  /** User display name */
  name: string
  /** Avatar image URL */
  avatar: string
  /** Email address */
  email: string
}

/** Action button configuration */
export interface ActionConfig {
  /** Button label */
  label: string
  /** Click handler */
  onClick: () => void
  /** Button variant */
  variant?: 'default' | 'primary' | 'destructive' | 'outline'
}

/** Common loading/error state props */
export interface AsyncStateProps {
  /** Whether data is loading */
  loading?: boolean
  /** Error message if any */
  error?: string
}
