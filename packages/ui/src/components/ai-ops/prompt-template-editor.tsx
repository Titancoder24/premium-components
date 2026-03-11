'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save,
  Send,
  Copy,
  Check,
  Clock,
  Hash,
  ChevronRight,
  FileText,
  Upload,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TemplateVar {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  value: string;
}

export interface TemplateVersion {
  id: string;
  label: string;
  content: string;
  timestamp: string;
}

export interface PromptTemplateEditorProps {
  template?: string;
  variables?: TemplateVar[];
  versions?: TemplateVersion[];
  onSave: (template: string, variables: TemplateVar[]) => void;
  onTest?: (rendered: string) => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function extractVariables(text: string): string[] {
  const matches = text.match(/\{\{(\w+)\}\}/g);
  if (!matches) return [];
  return [...new Set(matches.map((m) => m.slice(2, -2)))];
}

function renderTemplate(text: string, vars: TemplateVar[]): string {
  let result = text;
  for (const v of vars) {
    result = result.replace(new RegExp(`\\{\\{${v.name}\\}\\}`, 'g'), v.value);
  }
  return result;
}

function computeDiff(
  a: string,
  b: string,
): { type: 'same' | 'added' | 'removed'; text: string }[] {
  const aLines = a.split('\n');
  const bLines = b.split('\n');
  const diff: { type: 'same' | 'added' | 'removed'; text: string }[] = [];
  const max = Math.max(aLines.length, bLines.length);
  for (let i = 0; i < max; i++) {
    const al = aLines[i];
    const bl = bLines[i];
    if (al === bl) {
      diff.push({ type: 'same', text: al ?? '' });
    } else {
      if (al !== undefined) diff.push({ type: 'removed', text: al });
      if (bl !== undefined) diff.push({ type: 'added', text: bl });
    }
  }
  return diff;
}

// ---------------------------------------------------------------------------
// Syntax-highlighted textarea overlay
// ---------------------------------------------------------------------------

const HighlightedPreview: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(/(\{\{\w+\}\})/g);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden whitespace-pre-wrap break-words px-3 py-2.5 font-mono text-sm text-transparent">
      {parts.map((part, i) =>
        /^\{\{\w+\}\}$/.test(part) ? (
          <span key={i} className="rounded bg-violet-500/20 text-violet-600 dark:text-violet-400">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// PromptTemplateEditor
// ---------------------------------------------------------------------------

export const PromptTemplateEditor: React.FC<PromptTemplateEditorProps> = ({
  template: initialTemplate = '',
  variables: initialVars = [],
  versions = [],
  onSave,
  onTest,
  className,
}) => {
  const [template, setTemplate] = React.useState(initialTemplate);
  const [vars, setVars] = React.useState<TemplateVar[]>(initialVars);
  const [copied, setCopied] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [published, setPublished] = React.useState(false);
  const [selectedVersion, setSelectedVersion] = React.useState<string | null>(null);
  const [diffVersion, setDiffVersion] = React.useState<string | null>(null);

  // Auto-detect variables
  React.useEffect(() => {
    const names = extractVariables(template);
    setVars((prev) => {
      const existing = new Map(prev.map((v) => [v.name, v]));
      return names.map((n) => existing.get(n) ?? { name: n, type: 'string', value: '' });
    });
  }, [template]);

  const updateVar = (name: string, field: 'type' | 'value', val: string) => {
    setVars((prev) =>
      prev.map((v) => (v.name === name ? { ...v, [field]: val } : v)),
    );
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(template);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSave = () => {
    onSave(template, vars);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handlePublish = () => {
    onSave(template, vars);
    setPublished(true);
    setTimeout(() => setPublished(false), 1500);
  };

  const handleTest = () => {
    onTest?.(renderTemplate(template, vars));
  };

  const handleVersionClick = (v: TemplateVersion) => {
    if (selectedVersion === v.id) {
      setDiffVersion(diffVersion ? null : v.id);
    } else {
      setSelectedVersion(v.id);
      setTemplate(v.content);
      setDiffVersion(null);
    }
  };

  const diffLines = React.useMemo(() => {
    if (!diffVersion) return null;
    const ver = versions.find((v) => v.id === diffVersion);
    if (!ver) return null;
    return computeDiff(ver.content, template);
  }, [diffVersion, template, versions]);

  const charCount = template.length;
  const tokenEstimate = Math.ceil(template.split(/\s+/).filter(Boolean).length * 1.3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={cn(
        'flex rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]',
        className,
      )}
    >
      {/* Version sidebar */}
      {versions.length > 0 && (
        <div className="w-52 shrink-0 border-r border-[hsl(var(--border))] p-3">
          <span className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-[hsl(var(--muted-foreground))]">
            <Clock className="h-3 w-3" />
            Versions
          </span>
          <div className="space-y-1">
            {versions.map((v) => (
              <motion.button
                key={v.id}
                onClick={() => handleVersionClick(v)}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  'flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition-colors',
                  selectedVersion === v.id
                    ? 'bg-[hsl(var(--muted))] font-medium text-[hsl(var(--foreground))]'
                    : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]',
                )}
              >
                <ChevronRight className={cn('h-3 w-3 transition-transform', selectedVersion === v.id && 'rotate-90')} />
                <div className="min-w-0 flex-1">
                  <div className="truncate">{v.label}</div>
                  <div className="text-[10px] opacity-60">{v.timestamp}</div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Main editor */}
      <div className="flex flex-1 flex-col p-5">
        {/* Toolbar */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]">
            <FileText className="h-3.5 w-3.5" />
            <span>Template Editor</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[11px] text-[hsl(var(--muted-foreground))]">
              <Hash className="h-3 w-3" />
              {charCount} chars / ~{tokenEstimate} tokens
            </span>
            <motion.button
              onClick={handleCopy}
              whileTap={{ scale: 0.92 }}
              className="flex h-7 items-center gap-1 rounded-md px-2 text-xs text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))]"
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }}>
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  </motion.span>
                ) : (
                  <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }}>
                    <Copy className="h-3.5 w-3.5" />
                  </motion.span>
                )}
              </AnimatePresence>
              {copied ? 'Copied' : 'Copy'}
            </motion.button>
          </div>
        </div>

        {/* Template textarea with syntax highlighting overlay */}
        <div className="relative mb-4">
          <HighlightedPreview text={template} />
          <textarea
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            placeholder="Enter your prompt template... Use {{variable_name}} for variables."
            rows={8}
            className="relative w-full flex-1 resize-none rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2.5 font-mono text-sm text-[hsl(var(--foreground))] outline-none placeholder:text-[hsl(var(--muted-foreground))] focus:ring-2 focus:ring-[hsl(var(--ring))]"
          />
        </div>

        {/* Diff view */}
        <AnimatePresence>
          {diffLines && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-4 overflow-hidden rounded-lg border border-[hsl(var(--border))]"
            >
              <div className="max-h-40 overflow-y-auto font-mono text-xs">
                {diffLines.map((line, i) => (
                  <div
                    key={i}
                    className={cn(
                      'px-3 py-0.5',
                      line.type === 'added' && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                      line.type === 'removed' && 'bg-red-500/10 text-red-600 dark:text-red-400',
                      line.type === 'same' && 'text-[hsl(var(--muted-foreground))]',
                    )}
                  >
                    <span className="mr-2 select-none opacity-50">
                      {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                    </span>
                    {line.text}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Variables panel */}
        <AnimatePresence>
          {vars.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-4 overflow-hidden"
            >
              <span className="mb-2 block text-xs font-semibold text-[hsl(var(--muted-foreground))]">
                Variables ({vars.length})
              </span>
              <div className="space-y-2">
                {vars.map((v, i) => (
                  <motion.div
                    key={v.name}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-2"
                  >
                    <span className="min-w-[100px] rounded bg-[hsl(var(--muted))] px-2 py-1 font-mono text-xs text-[hsl(var(--foreground))]">
                      {`{{${v.name}}}`}
                    </span>
                    <select
                      value={v.type}
                      onChange={(e) => updateVar(v.name, 'type', e.target.value)}
                      className="rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-2 py-1 text-xs text-[hsl(var(--foreground))] outline-none"
                    >
                      <option value="string">string</option>
                      <option value="number">number</option>
                      <option value="boolean">boolean</option>
                      <option value="json">json</option>
                    </select>
                    <input
                      type="text"
                      value={v.value}
                      onChange={(e) => updateVar(v.name, 'value', e.target.value)}
                      placeholder={`Value for ${v.name}`}
                      className="flex-1 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-2 py-1 text-xs text-[hsl(var(--foreground))] outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <motion.button
            onClick={handleSave}
            whileTap={{ scale: 0.92 }}
            className="flex h-9 items-center gap-1.5 rounded-lg bg-[hsl(var(--primary))] px-4 text-sm font-medium text-[hsl(var(--primary-foreground))] transition-colors hover:opacity-90"
          >
            <AnimatePresence mode="wait">
              {saved ? (
                <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }}>
                  <Check className="h-4 w-4" />
                </motion.span>
              ) : (
                <motion.span key="save" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }}>
                  <Save className="h-4 w-4" />
                </motion.span>
              )}
            </AnimatePresence>
            {saved ? 'Saved!' : 'Save'}
          </motion.button>
          <motion.button
            onClick={handlePublish}
            whileTap={{ scale: 0.92 }}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-[hsl(var(--primary))] px-4 text-sm font-medium text-[hsl(var(--primary))] transition-colors hover:bg-[hsl(var(--primary))]/10"
          >
            <AnimatePresence mode="wait">
              {published ? (
                <motion.span key="pub-check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }}>
                  <Check className="h-4 w-4" />
                </motion.span>
              ) : (
                <motion.span key="pub-icon" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }}>
                  <Upload className="h-4 w-4" />
                </motion.span>
              )}
            </AnimatePresence>
            {published ? 'Published!' : 'Publish'}
          </motion.button>
          {onTest && (
            <motion.button
              onClick={handleTest}
              whileTap={{ scale: 0.92 }}
              className="flex h-9 items-center gap-1.5 rounded-lg border border-[hsl(var(--border))] px-4 text-sm font-medium text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--muted))]"
            >
              <Send className="h-4 w-4" />
              Test
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

PromptTemplateEditor.displayName = 'PromptTemplateEditor';
