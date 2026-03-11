"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Search } from "lucide-react"
import { cn } from "../../lib/utils"

export interface Command {
  id: string
  label: string
  icon?: React.ReactNode
  shortcut?: string
  action: () => void
  group: string
}

export interface CommandPaletteProps {
  commands: Command[]
  onSelect?: (command: Command) => void
  placeholder?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

export function CommandPalette({
  commands,
  onSelect,
  placeholder = "Type a command or search...",
  open: controlledOpen,
  onOpenChange,
  className,
}: CommandPaletteProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [activeIndex, setActiveIndex] = React.useState(0)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const listRef = React.useRef<HTMLDivElement>(null)

  const isOpen = controlledOpen ?? internalOpen
  const setOpen = (value: boolean) => {
    setInternalOpen(value)
    onOpenChange?.(value)
  }

  // Filter commands
  const filtered = React.useMemo(() => {
    if (!query.trim()) return commands
    const lower = query.toLowerCase()
    return commands.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(lower) ||
        cmd.group.toLowerCase().includes(lower)
    )
  }, [commands, query])

  // Group filtered commands
  const grouped = React.useMemo(() => {
    const groups: Record<string, Command[]> = {}
    for (const cmd of filtered) {
      if (!groups[cmd.group]) groups[cmd.group] = []
      groups[cmd.group].push(cmd)
    }
    return groups
  }, [filtered])

  const flatFiltered = React.useMemo(() => {
    return Object.values(grouped).flat()
  }, [grouped])

  // Cmd+K shortcut
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen(!isOpen)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  // Focus input when opened
  React.useEffect(() => {
    if (isOpen) {
      setQuery("")
      setActiveIndex(0)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [isOpen])

  // Reset active index on filter
  React.useEffect(() => {
    setActiveIndex(0)
  }, [query])

  // Scroll active item into view
  React.useEffect(() => {
    if (!listRef.current) return
    const active = listRef.current.querySelector("[data-active='true']")
    active?.scrollIntoView({ block: "nearest" })
  }, [activeIndex])

  const handleSelect = (cmd: Command) => {
    cmd.action()
    onSelect?.(cmd)
    setOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setActiveIndex((prev) => (prev + 1) % flatFiltered.length)
        break
      case "ArrowUp":
        e.preventDefault()
        setActiveIndex((prev) => (prev - 1 + flatFiltered.length) % flatFiltered.length)
        break
      case "Enter":
        e.preventDefault()
        if (flatFiltered[activeIndex]) {
          handleSelect(flatFiltered[activeIndex])
        }
        break
      case "Escape":
        e.preventDefault()
        setOpen(false)
        break
    }
  }

  let itemCounter = -1

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
          onClick={() => setOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "relative z-10 w-full max-w-lg overflow-hidden rounded-xl border border-border bg-popover shadow-2xl",
              className
            )}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="flex-1 bg-transparent py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
              <kbd className="hidden sm:inline-flex h-5 items-center rounded border border-border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div
              ref={listRef}
              className="max-h-72 overflow-y-auto p-2"
              role="listbox"
            >
              {flatFiltered.length === 0 && (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No results found.
                </p>
              )}
              {Object.entries(grouped).map(([group, cmds]) => (
                <div key={group}>
                  <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {group}
                  </p>
                  {cmds.map((cmd) => {
                    itemCounter++
                    const idx = itemCounter
                    const isActive = idx === activeIndex
                    return (
                      <button
                        key={cmd.id}
                        data-active={isActive}
                        onClick={() => handleSelect(cmd)}
                        onMouseEnter={() => setActiveIndex(idx)}
                        className="relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-left transition-colors"
                        role="option"
                        aria-selected={isActive}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="command-active"
                            className="absolute inset-0 rounded-lg bg-accent"
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          />
                        )}
                        {cmd.icon && (
                          <span className="relative z-10 flex h-5 w-5 items-center justify-center text-muted-foreground">
                            {cmd.icon}
                          </span>
                        )}
                        <span className="relative z-10 flex-1 text-foreground">
                          {cmd.label}
                        </span>
                        {cmd.shortcut && (
                          <kbd className="relative z-10 text-xs text-muted-foreground">
                            {cmd.shortcut}
                          </kbd>
                        )}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
