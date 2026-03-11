'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  Search,
  Copy,
  Check,
  ChevronsDownUp,
  ChevronsUpDown,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface JsonInspectorProps {
  data: unknown;
  defaultExpanded?: number;
  searchable?: boolean;
  onPathCopy?: (path: string) => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type JsonValueType = 'string' | 'number' | 'boolean' | 'null' | 'object' | 'array';

function getType(value: unknown): JsonValueType {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value as JsonValueType;
}

const valueColors: Record<string, string> = {
  string: 'text-emerald-600 dark:text-emerald-400',
  number: 'text-purple-600 dark:text-purple-400',
  boolean: 'text-blue-600 dark:text-blue-400',
  null: 'text-gray-400 dark:text-gray-500',
};

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-yellow-300/40 dark:bg-yellow-500/30 text-inherit rounded-sm px-0.5">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

function buildPath(parent: string, key: string | number): string {
  if (parent === '') return String(key);
  if (typeof key === 'number') return `${parent}[${key}]`;
  return `${parent}.${key}`;
}

// ---------------------------------------------------------------------------
// CopyPathButton
// ---------------------------------------------------------------------------

function CopyPathButton({ path, onCopy }: { path: string; onCopy?: (p: string) => void }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCopy) onCopy(path);
    else navigator.clipboard?.writeText(path);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded p-0.5 text-muted-foreground hover:text-foreground transition-colors"
      aria-label={`Copy path: ${path}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="check"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <Check className="h-3 w-3 text-emerald-500" />
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <Copy className="h-3 w-3" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

// ---------------------------------------------------------------------------
// JsonNode (recursive)
// ---------------------------------------------------------------------------

interface JsonNodeProps {
  keyName: string | number | null;
  value: unknown;
  path: string;
  depth: number;
  defaultExpandDepth: number;
  searchQuery: string;
  expandAll: boolean | null;
  onPathCopy?: (path: string) => void;
}

function JsonNode({
  keyName,
  value,
  path,
  depth,
  defaultExpandDepth,
  searchQuery,
  expandAll,
  onPathCopy,
}: JsonNodeProps) {
  const type = getType(value);
  const isExpandable = type === 'object' || type === 'array';
  const [expanded, setExpanded] = React.useState(depth < defaultExpandDepth);
  const [hovered, setHovered] = React.useState(false);

  React.useEffect(() => {
    if (expandAll === true) setExpanded(true);
    else if (expandAll === false) setExpanded(false);
  }, [expandAll]);

  const entries = isExpandable
    ? type === 'array'
      ? (value as unknown[]).map((v, i) => [i, v] as const)
      : Object.entries(value as Record<string, unknown>)
    : [];

  const count = entries.length;

  const renderValue = () => {
    if (type === 'string') return <span className={valueColors.string}>&quot;{highlightMatch(String(value), searchQuery)}&quot;</span>;
    if (type === 'number') return <span className={valueColors.number}>{String(value)}</span>;
    if (type === 'boolean') return <span className={valueColors.boolean}>{String(value)}</span>;
    if (type === 'null') return <span className={valueColors.null}>null</span>;
    return null;
  };

  return (
    <div>
      <div
        className="group flex items-center gap-1 py-0.5 cursor-pointer hover:bg-muted/30 rounded-sm transition-colors"
        style={{ paddingLeft: `${depth * 16}px` }}
        onClick={() => isExpandable && setExpanded(!expanded)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Chevron */}
        {isExpandable ? (
          <motion.span
            animate={{ rotate: expanded ? 90 : 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="shrink-0"
          >
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          </motion.span>
        ) : (
          <span className="w-3.5 shrink-0" />
        )}

        {/* Key */}
        {keyName !== null && (
          <span className="text-xs font-medium text-foreground">
            {typeof keyName === 'number' ? keyName : highlightMatch(String(keyName), searchQuery)}
            <span className="text-muted-foreground">: </span>
          </span>
        )}

        {/* Value or preview */}
        {isExpandable ? (
          <span className="text-xs text-muted-foreground">
            {type === 'array' ? '[' : '{'}
            {!expanded && (
              <span className="text-[10px] ml-0.5 mr-0.5">
                {count} {type === 'array' ? `item${count !== 1 ? 's' : ''}` : `key${count !== 1 ? 's' : ''}`}
              </span>
            )}
            {!expanded && (type === 'array' ? ']' : '}')}
          </span>
        ) : (
          <span className="text-xs font-mono">{renderValue()}</span>
        )}

        {/* Badge count */}
        {isExpandable && expanded && (
          <span className="text-[10px] text-muted-foreground/70 ml-1">
            {type === 'array' ? `[${count}]` : `{${count}}`}
          </span>
        )}

        {/* Hover: path breadcrumb + copy */}
        {hovered && path && (
          <motion.span
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className="ml-auto flex items-center gap-1"
          >
            <span className="font-mono text-[10px] text-muted-foreground/60 truncate max-w-[200px]">
              {path}
            </span>
            <CopyPathButton path={path} onCopy={onPathCopy} />
          </motion.span>
        )}
      </div>

      {/* Children */}
      <AnimatePresence initial={false}>
        {isExpandable && expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            className="overflow-hidden relative"
          >
            {/* Indentation guide */}
            <div
              className="absolute top-0 bottom-0 w-px bg-border"
              style={{ left: `${depth * 16 + 7}px` }}
            />
            {entries.map(([k, v]) => (
              <JsonNode
                key={String(k)}
                keyName={k}
                value={v}
                path={buildPath(path, k)}
                depth={depth + 1}
                defaultExpandDepth={defaultExpandDepth}
                searchQuery={searchQuery}
                expandAll={expandAll}
                onPathCopy={onPathCopy}
              />
            ))}
            <div
              className="text-xs text-muted-foreground"
              style={{ paddingLeft: `${depth * 16}px` }}
            >
              {type === 'array' ? ']' : '}'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// JsonInspector
// ---------------------------------------------------------------------------

export const JsonInspector: React.FC<JsonInspectorProps> = ({
  data,
  defaultExpanded = 2,
  searchable = true,
  onPathCopy,
  className,
}) => {
  const [search, setSearch] = React.useState('');
  const [expandAll, setExpandAll] = React.useState<boolean | null>(null);

  const handleExpandAll = () => setExpandAll(true);
  const handleCollapseAll = () => setExpandAll(false);

  // Reset expandAll trigger after applying
  React.useEffect(() => {
    if (expandAll !== null) {
      const timer = setTimeout(() => setExpandAll(null), 100);
      return () => clearTimeout(timer);
    }
  }, [expandAll]);

  return (
    <div className={cn('rounded-xl border border-border bg-card', className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        {searchable && (
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search keys and values..."
              className="w-full rounded-md border border-border bg-muted/30 py-1.5 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[var(--color-primary,theme(colors.blue.500))]"
            />
          </div>
        )}
        <button
          type="button"
          onClick={handleExpandAll}
          className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Expand all"
        >
          <ChevronsUpDown className="h-3.5 w-3.5" />
          Expand
        </button>
        <button
          type="button"
          onClick={handleCollapseAll}
          className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Collapse all"
        >
          <ChevronsDownUp className="h-3.5 w-3.5" />
          Collapse
        </button>
      </div>

      {/* Tree */}
      <div className="p-4 font-mono text-sm overflow-auto max-h-[600px]">
        <JsonNode
          keyName={null}
          value={data}
          path=""
          depth={0}
          defaultExpandDepth={defaultExpanded}
          searchQuery={search}
          expandAll={expandAll}
          onPathCopy={onPathCopy}
        />
      </div>
    </div>
  );
};

JsonInspector.displayName = 'JsonInspector';
