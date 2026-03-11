'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Folder, FolderOpen, File, FileText, FileImage, ChevronRight, Search } from 'lucide-react'
import { cn } from '../../lib/utils'

// ---- Types ----

export interface FileNode {
  name: string
  type: 'file' | 'folder'
  children?: FileNode[]
  size?: string
}

export interface FileBrowserProps {
  files: FileNode[]
  onSelect?: (path: string) => void
  selectedPath?: string
  className?: string
}

// ---- Component ----

function getFileIcon(name: string): React.ReactNode {
  const ext = name.split('.').pop()?.toLowerCase()
  if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(ext || ''))
    return <FileImage className="h-4 w-4 text-[hsl(var(--primary))]" />
  if (['md', 'txt', 'doc', 'pdf'].includes(ext || ''))
    return <FileText className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
  return <File className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
}

const TreeNode: React.FC<{
  node: FileNode
  depth: number
  path: string
  selectedPath?: string
  onSelect?: (path: string) => void
}> = ({ node, depth, path, selectedPath, onSelect }) => {
  const [isOpen, setIsOpen] = useState(depth < 1)
  const fullPath = path ? `${path}/${node.name}` : node.name
  const isSelected = selectedPath === fullPath
  const isFolder = node.type === 'folder'

  const handleClick = useCallback(() => {
    if (isFolder) {
      setIsOpen((p) => !p)
    }
    onSelect?.(fullPath)
  }, [isFolder, fullPath, onSelect])

  return (
    <div>
      <button
        onClick={handleClick}
        className={cn(
          'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors',
          isSelected
            ? 'bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]'
            : 'text-[hsl(var(--card-foreground))] hover:bg-[hsl(var(--muted))]',
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {isFolder && (
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.15 }}
          >
            <ChevronRight className="h-3 w-3 text-[hsl(var(--muted-foreground))]" />
          </motion.div>
        )}
        {!isFolder && <span className="w-3" />}
        {isFolder ? (
          isOpen ? (
            <FolderOpen className="h-4 w-4 text-[hsl(var(--primary))]" />
          ) : (
            <Folder className="h-4 w-4 text-[hsl(var(--primary))]" />
          )
        ) : (
          getFileIcon(node.name)
        )}
        <span className="flex-1 truncate">{node.name}</span>
        {node.size && (
          <span className="text-xs text-[hsl(var(--muted-foreground))]">{node.size}</span>
        )}
      </button>

      <AnimatePresence initial={false}>
        {isFolder && isOpen && node.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            {node.children.map((child, i) => (
              <TreeNode
                key={`${fullPath}/${child.name}-${i}`}
                node={child}
                depth={depth + 1}
                path={fullPath}
                selectedPath={selectedPath}
                onSelect={onSelect}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export const FileBrowser: React.FC<FileBrowserProps> = ({
  files,
  onSelect,
  selectedPath,
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState('')

  const filterTree = useCallback(
    (nodes: FileNode[], query: string): FileNode[] => {
      if (!query) return nodes
      return nodes.reduce<FileNode[]>((acc, node) => {
        if (node.name.toLowerCase().includes(query.toLowerCase())) {
          acc.push(node)
        } else if (node.type === 'folder' && node.children) {
          const filtered = filterTree(node.children, query)
          if (filtered.length > 0) {
            acc.push({ ...node, children: filtered })
          }
        }
        return acc
      }, [])
    },
    [],
  )

  const filteredFiles = filterTree(files, searchQuery)

  return (
    <div
      className={cn(
        'flex flex-col rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]',
        className,
      )}
    >
      <div className="border-b border-[hsl(var(--border))] p-3">
        <div className="flex items-center gap-2 rounded-md bg-[hsl(var(--muted))] px-3 py-1.5">
          <Search className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-[hsl(var(--card-foreground))] placeholder:text-[hsl(var(--muted-foreground))] outline-none"
          />
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto p-2">
        {filteredFiles.length === 0 ? (
          <p className="py-8 text-center text-sm text-[hsl(var(--muted-foreground))]">No files found</p>
        ) : (
          filteredFiles.map((node, i) => (
            <TreeNode
              key={`${node.name}-${i}`}
              node={node}
              depth={0}
              path=""
              selectedPath={selectedPath}
              onSelect={onSelect}
            />
          ))
        )}
      </div>

      <div className="border-t border-[hsl(var(--border))] px-3 py-2">
        <p className="text-xs text-[hsl(var(--muted-foreground))]">
          {files.length} items {selectedPath && `\u2022 ${selectedPath}`}
        </p>
      </div>
    </div>
  )
}

FileBrowser.displayName = 'FileBrowser'
