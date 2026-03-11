"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "../../lib/utils"

export interface TabItem {
  id: string
  label: string
  icon?: React.ReactNode
  content: React.ReactNode
}

export interface TabNavigationProps {
  tabs: TabItem[]
  defaultTab?: string
  onChange?: (tabId: string) => void
  variant?: "underline" | "pill"
  className?: string
}

export function TabNavigation({
  tabs,
  defaultTab,
  onChange,
  variant = "underline",
  className,
}: TabNavigationProps) {
  const [activeTab, setActiveTab] = React.useState(defaultTab ?? tabs[0]?.id ?? "")

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    onChange?.(tabId)
  }

  const activeContent = tabs.find((t) => t.id === activeTab)?.content

  return (
    <div className={cn("w-full", className)}>
      {/* Tab list */}
      <div
        role="tablist"
        className={cn(
          "flex",
          variant === "underline"
            ? "border-b border-border gap-0"
            : "gap-1 rounded-lg bg-muted p-1"
        )}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "relative flex items-center gap-2 text-sm font-medium transition-colors",
                variant === "underline"
                  ? cn(
                      "px-4 py-2.5 -mb-px",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )
                  : cn(
                      "rounded-md px-3 py-1.5",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )
              )}
            >
              {/* Active indicator */}
              {isActive && variant === "underline" && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute inset-x-0 -bottom-px h-0.5 bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {isActive && variant === "pill" && (
                <motion.div
                  layoutId="tab-pill"
                  className="absolute inset-0 rounded-md bg-background shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {tab.icon && <span className="relative z-10">{tab.icon}</span>}
              <span className="relative z-10">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <div className="mt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            id={`tabpanel-${activeTab}`}
            role="tabpanel"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeContent}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
