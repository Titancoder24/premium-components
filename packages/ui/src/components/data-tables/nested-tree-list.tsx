"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, FileText } from "lucide-react"
import { cn } from "../../lib/utils"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TreeNode {
  id: string
  label: string
  children?: TreeNode[]
  icon?: React.ReactNode
}

export interface NestedTreeListProps {
  /** Hierarchical tree data. */
  data: TreeNode[]
  /** IDs of nodes expanded by default. */
  defaultExpanded?: string[]
  /** Called when a leaf or node is selected. */
  onSelect?: (node: TreeNode) => void
  /** Extra class name on wrapper. */
  className?: string
}

// ---------------------------------------------------------------------------
// Tree Node Component
// ---------------------------------------------------------------------------

interface TreeNodeRowProps {
  node: TreeNode
  depth: number
  expandedSet: Set<string>
  selectedId: string | null
  onToggle: (id: string) => void
  onSelect?: (node: TreeNode) => void
  index: number
}

function TreeNodeRow({
  node,
  depth,
  expandedSet,
  selectedId,
  onToggle,
  onSelect,
  index,
}: TreeNodeRowProps) {
  const hasChildren = node.children && node.children.length > 0
  const isExpanded = expandedSet.has(node.id)
  const isSelected = selectedId === node.id

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
    >
      {/* Row */}
      <button
        type="button"
        onClick={() => {
          if (hasChildren) onToggle(node.id)
          onSelect?.(node)
        }}
        className={cn(
          "group flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
          isSelected
            ? "bg-primary/10 text-primary"
            : "text-foreground hover:bg-muted"
        )}
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
      >
        {/* Chevron or spacer */}
        {hasChildren ? (
          <motion.span
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="inline-flex flex-shrink-0"
          >
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </motion.span>
        ) : (
          <span className="inline-flex h-4 w-4 flex-shrink-0" />
        )}

        {/* Icon */}
        <span className="flex-shrink-0 text-muted-foreground">
          {node.icon ?? (
            hasChildren ? null : <FileText className="h-4 w-4" />
          )}
        </span>

        {/* Label */}
        <span className="truncate">{node.label}</span>
      </button>

      {/* Children */}
      <AnimatePresence initial={false}>
        {hasChildren && isExpanded && (
          <motion.div
            key={`children-${node.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {node.children!.map((child, childIndex) => (
              <TreeNodeRow
                key={child.id}
                node={child}
                depth={depth + 1}
                expandedSet={expandedSet}
                selectedId={selectedId}
                onToggle={onToggle}
                onSelect={onSelect}
                index={childIndex}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// NestedTreeList Component
// ---------------------------------------------------------------------------

export function NestedTreeList({
  data,
  defaultExpanded = [],
  onSelect,
  className,
}: NestedTreeListProps) {
  const [expandedSet, setExpandedSet] = React.useState<Set<string>>(
    () => new Set(defaultExpanded)
  )
  const [selectedId, setSelectedId] = React.useState<string | null>(null)

  const handleToggle = React.useCallback((id: string) => {
    setExpandedSet((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const handleSelect = React.useCallback(
    (node: TreeNode) => {
      setSelectedId(node.id)
      onSelect?.(node)
    },
    [onSelect]
  )

  return (
    <div
      className={cn(
        "w-full rounded-lg border border-border bg-card p-2",
        className
      )}
      role="tree"
    >
      {data.map((node, index) => (
        <TreeNodeRow
          key={node.id}
          node={node}
          depth={0}
          expandedSet={expandedSet}
          selectedId={selectedId}
          onToggle={handleToggle}
          onSelect={handleSelect}
          index={index}
        />
      ))}
    </div>
  )
}

NestedTreeList.displayName = "NestedTreeList"
