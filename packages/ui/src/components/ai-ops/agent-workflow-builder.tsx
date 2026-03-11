'use client';

import * as React from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  Plus,
  Trash2,
  Play,
  ChevronDown,
  Settings2,
  CheckCircle2,
  AlertCircle,
  ArrowDown,
  Loader2,
  MessageSquare,
  Cpu,
  Wrench,
  GitBranch,
  LogOut,
  LogIn,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type NodeType = 'input' | 'llm_call' | 'tool_use' | 'condition' | 'output';

export interface WorkflowNode {
  id: string;
  type: NodeType;
  label: string;
  config: Record<string, string>;
  configured: boolean;
}

export interface AgentWorkflowBuilderProps {
  nodes?: WorkflowNode[];
  onChange: (nodes: WorkflowNode[]) => void;
  onRun?: (nodes: WorkflowNode[]) => Promise<void>;
  className?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const NODE_TYPE_META: Record<NodeType, { icon: React.FC<{ className?: string }>; label: string; color: string }> = {
  input: { icon: LogIn, label: 'Input', color: 'text-blue-500' },
  llm_call: { icon: Cpu, label: 'LLM Call', color: 'text-violet-500' },
  tool_use: { icon: Wrench, label: 'Tool Use', color: 'text-amber-500' },
  condition: { icon: GitBranch, label: 'Condition', color: 'text-cyan-500' },
  output: { icon: LogOut, label: 'Output', color: 'text-emerald-500' },
};

const NODE_TYPES: NodeType[] = ['input', 'llm_call', 'tool_use', 'condition', 'output'];

function makeId(): string {
  return `node-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function defaultConfig(type: NodeType): Record<string, string> {
  switch (type) {
    case 'input': return { source: '' };
    case 'llm_call': return { model: '', prompt: '' };
    case 'tool_use': return { tool: '', parameters: '' };
    case 'condition': return { expression: '' };
    case 'output': return { destination: '' };
  }
}

// ---------------------------------------------------------------------------
// AddNodeButton
// ---------------------------------------------------------------------------

const AddNodeButton: React.FC<{
  onAdd: (type: NodeType) => void;
}> = ({ onAdd }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} className="relative flex justify-center">
      {/* Connecting line */}
      <div className="absolute -top-3 h-3 w-px bg-[hsl(var(--border))]" />
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--muted-foreground))] transition-colors hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
      >
        <Plus className="h-3.5 w-3.5" />
      </motion.button>
      {/* Connecting line below */}
      <div className="absolute -bottom-3 h-3 w-px bg-[hsl(var(--border))]" />

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-9 z-20 w-44 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-1 shadow-lg"
          >
            {NODE_TYPES.map((t) => {
              const meta = NODE_TYPE_META[t];
              const Icon = meta.icon;
              return (
                <button
                  key={t}
                  onClick={() => { onAdd(t); setOpen(false); }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition-colors hover:bg-[hsl(var(--muted))]"
                >
                  <Icon className={cn('h-3.5 w-3.5', meta.color)} />
                  <span className="font-medium text-[hsl(var(--foreground))]">{meta.label}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ---------------------------------------------------------------------------
// NodeCard
// ---------------------------------------------------------------------------

const NodeCard: React.FC<{
  node: WorkflowNode;
  active: boolean;
  onToggleConfig: () => void;
  expanded: boolean;
  onUpdateConfig: (key: string, value: string) => void;
  onDelete: () => void;
}> = ({ node, active, onToggleConfig, expanded, onUpdateConfig, onDelete }) => {
  const meta = NODE_TYPE_META[node.type];
  const Icon = meta.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, x: -60, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(
        'rounded-lg border bg-[hsl(var(--background))] transition-shadow',
        active
          ? 'border-[hsl(var(--primary))] shadow-md shadow-[hsl(var(--primary))]/10'
          : 'border-[hsl(var(--border))]',
      )}
    >
      <div
        className="flex cursor-pointer items-center gap-3 px-4 py-3"
        onClick={onToggleConfig}
      >
        <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--muted))]', meta.color)}>
          {active ? (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="inline-flex"
            >
              <Loader2 className="h-4 w-4" />
            </motion.span>
          ) : (
            <Icon className="h-4 w-4" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-[hsl(var(--foreground))]">{node.label}</div>
          <div className="text-[10px] text-[hsl(var(--muted-foreground))]">{meta.label}</div>
        </div>
        {/* Status indicator */}
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
        >
          {node.configured ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          ) : (
            <AlertCircle className="h-4 w-4 text-amber-500" />
          )}
        </motion.span>
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Settings2 className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" />
        </motion.span>
      </div>

      {/* Config panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-[hsl(var(--border))] px-4 py-3 space-y-2">
              {Object.entries(node.config).map(([key, val]) => (
                <div key={key} className="flex items-center gap-2">
                  <label className="min-w-[80px] text-xs font-medium text-[hsl(var(--muted-foreground))] capitalize">
                    {key}
                  </label>
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => onUpdateConfig(key, e.target.value)}
                    placeholder={`Enter ${key}...`}
                    className="flex-1 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-2 py-1 text-xs text-[hsl(var(--foreground))] outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                  />
                </div>
              ))}
              <div className="flex justify-end pt-1">
                <motion.button
                  onClick={(e) => { e.stopPropagation(); onDelete(); }}
                  whileTap={{ scale: 0.92 }}
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-red-500 transition-colors hover:bg-red-500/10"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ---------------------------------------------------------------------------
// AgentWorkflowBuilder
// ---------------------------------------------------------------------------

export const AgentWorkflowBuilder: React.FC<AgentWorkflowBuilderProps> = ({
  nodes: initialNodes = [],
  onChange,
  onRun,
  className,
}) => {
  const [nodes, setNodes] = React.useState<WorkflowNode[]>(initialNodes);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [running, setRunning] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);

  const update = (next: WorkflowNode[]) => {
    setNodes(next);
    onChange(next);
  };

  const addNode = (afterIndex: number, type: NodeType) => {
    const newNode: WorkflowNode = {
      id: makeId(),
      type,
      label: NODE_TYPE_META[type].label,
      config: defaultConfig(type),
      configured: false,
    };
    const next = [...nodes];
    next.splice(afterIndex + 1, 0, newNode);
    update(next);
    setExpandedId(newNode.id);
  };

  const deleteNode = (id: string) => {
    update(nodes.filter((n) => n.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const updateConfig = (id: string, key: string, value: string) => {
    const next = nodes.map((n) => {
      if (n.id !== id) return n;
      const config = { ...n.config, [key]: value };
      const configured = Object.values(config).every((v) => v.trim().length > 0);
      return { ...n, config, configured };
    });
    update(next);
  };

  const handleReorder = (reordered: WorkflowNode[]) => {
    setNodes(reordered);
    onChange(reordered);
  };

  const handleRun = async () => {
    if (!onRun || running || nodes.length === 0) return;
    setRunning(true);
    setActiveIndex(0);

    // Sequential stage activation animation
    for (let i = 0; i < nodes.length; i++) {
      setActiveIndex(i);
      await new Promise((r) => setTimeout(r, 600));
    }

    try {
      await onRun(nodes);
    } finally {
      setActiveIndex(-1);
      setRunning(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={cn(
        'rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5',
        className,
      )}
    >
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
          <h2 className="text-base font-semibold text-[hsl(var(--foreground))]">Agent Workflow</h2>
        </div>
        {onRun && (
          <motion.button
            onClick={handleRun}
            disabled={running || nodes.length === 0}
            whileTap={{ scale: 0.92 }}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              !running && nodes.length > 0
                ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] cursor-not-allowed',
            )}
          >
            {running ? (
              <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="inline-flex">
                <Loader2 className="h-4 w-4" />
              </motion.span>
            ) : (
              <Play className="h-4 w-4" />
            )}
            {running ? 'Running...' : 'Run Pipeline'}
          </motion.button>
        )}
      </div>

      {/* Empty state */}
      {nodes.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 flex flex-col items-center gap-3 py-8"
        >
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            No steps yet. Add your first node to start building.
          </p>
          <div className="flex gap-2">
            {NODE_TYPES.map((t) => {
              const meta = NODE_TYPE_META[t];
              const Icon = meta.icon;
              return (
                <motion.button
                  key={t}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addNode(-1, t)}
                  className="flex items-center gap-1.5 rounded-lg border border-[hsl(var(--border))] px-3 py-2 text-xs font-medium text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--muted))]"
                >
                  <Icon className={cn('h-3.5 w-3.5', meta.color)} />
                  {meta.label}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Node list with reorder */}
      {nodes.length > 0 && (
        <Reorder.Group axis="y" values={nodes} onReorder={handleReorder} className="space-y-0">
          {nodes.map((node, i) => (
            <React.Fragment key={node.id}>
              {/* Connecting line above */}
              {i > 0 && (
                <div className="flex justify-center py-1">
                  <ArrowDown className="h-4 w-4 text-[hsl(var(--border))]" />
                </div>
              )}
              <Reorder.Item
                value={node}
                className="list-none"
                whileDrag={{ scale: 1.02, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
              >
                <NodeCard
                  node={node}
                  active={running && activeIndex === i}
                  expanded={expandedId === node.id}
                  onToggleConfig={() => setExpandedId(expandedId === node.id ? null : node.id)}
                  onUpdateConfig={(key, value) => updateConfig(node.id, key, value)}
                  onDelete={() => deleteNode(node.id)}
                />
              </Reorder.Item>
              {/* Add button between nodes */}
              <div className="py-2">
                <AddNodeButton onAdd={(type) => addNode(i, type)} />
              </div>
            </React.Fragment>
          ))}
        </Reorder.Group>
      )}
    </motion.div>
  );
};

AgentWorkflowBuilder.displayName = 'AgentWorkflowBuilder';
