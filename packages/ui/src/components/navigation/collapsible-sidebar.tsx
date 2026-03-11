"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "../../lib/utils"

export interface SidebarItem {
  icon: React.ReactNode
  label: string
  href: string
  badge?: number
  children?: SidebarItem[]
}

export interface SidebarUser {
  name: string
  avatar: string
  email: string
}

export interface CollapsibleSidebarProps {
  items: SidebarItem[]
  collapsed: boolean
  onToggle: () => void
  user: SidebarUser
  logo: React.ReactNode
  activeHref?: string
  onNavigate?: (href: string) => void
  className?: string
}

const sidebarSpring = { type: "spring" as const, stiffness: 400, damping: 30, duration: 0.3 }

function Tooltip({
  children,
  label,
  show,
}: {
  children: React.ReactNode
  label: string
  show: boolean
}) {
  const [hovered, setHovered] = React.useState(false)

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      <AnimatePresence>
        {show && hovered && (
          <motion.div
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 rounded-md bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md border border-border whitespace-nowrap pointer-events-none"
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function SidebarNavItem({
  item,
  collapsed,
  activeHref,
  onNavigate,
  depth = 0,
}: {
  item: SidebarItem
  collapsed: boolean
  activeHref?: string
  onNavigate?: (href: string) => void
  depth?: number
}) {
  const [expanded, setExpanded] = React.useState(false)
  const isActive = activeHref === item.href
  const hasChildren = item.children && item.children.length > 0

  const handleClick = () => {
    if (hasChildren && !collapsed) {
      setExpanded((prev) => !prev)
    }
    onNavigate?.(item.href)
  }

  return (
    <div>
      <Tooltip label={item.label} show={collapsed}>
        <button
          onClick={handleClick}
          className={cn(
            "relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            isActive ? "text-primary" : "text-muted-foreground",
            depth > 0 && !collapsed && "ml-4"
          )}
        >
          {isActive && (
            <motion.div
              layoutId="sidebar-active-indicator"
              className="absolute inset-0 rounded-lg bg-accent"
              transition={sidebarSpring}
            />
          )}
          <span className="relative z-10 flex shrink-0 items-center justify-center w-5 h-5">
            {item.icon}
          </span>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="relative z-10 truncate"
              >
                {item.label}
              </motion.span>
            )}
          </AnimatePresence>
          {!collapsed && item.badge != null && item.badge > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="relative z-10 ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground"
            >
              {item.badge}
            </motion.span>
          )}
          {!collapsed && hasChildren && (
            <motion.span
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 ml-auto"
            >
              <ChevronDown className="h-4 w-4" />
            </motion.span>
          )}
        </button>
      </Tooltip>

      {/* Nested children */}
      <AnimatePresence initial={false}>
        {hasChildren && expanded && !collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {item.children!.map((child) => (
              <SidebarNavItem
                key={child.href}
                item={child}
                collapsed={collapsed}
                activeHref={activeHref}
                onNavigate={onNavigate}
                depth={depth + 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function CollapsibleSidebar({
  items,
  collapsed,
  onToggle,
  user,
  logo,
  activeHref,
  onNavigate,
  className,
}: CollapsibleSidebarProps) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 68 : 260 }}
      transition={sidebarSpring}
      className={cn(
        "flex h-full flex-col border-r border-border bg-card overflow-hidden",
        className
      )}
    >
      {/* Logo & toggle */}
      <div className="flex items-center justify-between px-3 py-4 border-b border-border">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="truncate"
            >
              {logo}
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={onToggle}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {items.map((item) => (
          <SidebarNavItem
            key={item.href}
            item={item}
            collapsed={collapsed}
            activeHref={activeHref}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      {/* User section */}
      <div className="border-t border-border px-3 py-3">
        <div className="flex items-center gap-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="h-8 w-8 shrink-0 rounded-full object-cover"
          />
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <p className="truncate text-sm font-medium text-foreground">
                  {user.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {user.email}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  )
}
