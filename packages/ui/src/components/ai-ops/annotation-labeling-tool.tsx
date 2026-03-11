'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tag,
  Trash2,
  Edit3,
  Undo2,
  Redo2,
  Download,
  Keyboard,
  Check,
  X,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LabelCategory {
  id: string;
  name: string;
  color: string;
}

export interface Annotation {
  id: string;
  start: number;
  end: number;
  labelId: string;
  text: string;
}

export interface AnnotationLabelingToolProps {
  text: string;
  labels: LabelCategory[];
  annotations?: Annotation[];
  onChange: (annotations: Annotation[]) => void;
  onExport?: (annotations: Annotation[]) => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

let annotationIdCounter = 0;
function nextAnnotationId(): string {
  annotationIdCounter += 1;
  return `ann-${annotationIdCounter}-${Date.now()}`;
}

interface HistoryState {
  past: Annotation[][];
  present: Annotation[];
  future: Annotation[][];
}

function useUndoRedo(initial: Annotation[]) {
  const [state, setState] = React.useState<HistoryState>({
    past: [],
    present: initial,
    future: [],
  });

  const set = React.useCallback((next: Annotation[]) => {
    setState((s) => ({
      past: [...s.past, s.present],
      present: next,
      future: [],
    }));
  }, []);

  const undo = React.useCallback(() => {
    setState((s) => {
      if (s.past.length === 0) return s;
      const previous = s.past[s.past.length - 1]!;
      return {
        past: s.past.slice(0, -1),
        present: previous,
        future: [s.present, ...s.future],
      };
    });
  }, []);

  const redo = React.useCallback(() => {
    setState((s) => {
      if (s.future.length === 0) return s;
      const next = s.future[0]!;
      return {
        past: [...s.past, s.present],
        present: next,
        future: s.future.slice(1),
      };
    });
  }, []);

  return { annotations: state.present, set, undo, redo, canUndo: state.past.length > 0, canRedo: state.future.length > 0 };
}

// ---------------------------------------------------------------------------
// AnnotationLabelingTool
// ---------------------------------------------------------------------------

export const AnnotationLabelingTool: React.FC<AnnotationLabelingToolProps> = ({
  text,
  labels,
  annotations: initialAnnotations = [],
  onChange,
  onExport,
  className,
}) => {
  const { annotations, set, undo, redo, canUndo, canRedo } = useUndoRedo(initialAnnotations);
  const [selectedLabel, setSelectedLabel] = React.useState<string>(labels[0]?.id ?? '');
  const [popup, setPopup] = React.useState<{ x: number; y: number; start: number; end: number } | null>(null);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editLabelId, setEditLabelId] = React.useState('');
  const [showShortcuts, setShowShortcuts] = React.useState(false);
  const textRef = React.useRef<HTMLDivElement>(null);

  // Sync onChange
  React.useEffect(() => {
    onChange(annotations);
  }, [annotations, onChange]);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
      if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); redo(); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [undo, redo]);

  const handleTextMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !textRef.current) return;

    const range = selection.getRangeAt(0);
    const preRange = document.createRange();
    preRange.selectNodeContents(textRef.current);
    preRange.setEnd(range.startContainer, range.startOffset);
    const start = preRange.toString().length;
    const end = start + range.toString().length;

    if (end <= start) return;

    const rect = range.getBoundingClientRect();
    const parentRect = textRef.current.getBoundingClientRect();
    setPopup({
      x: rect.left - parentRect.left + rect.width / 2,
      y: rect.top - parentRect.top - 8,
      start,
      end,
    });
  };

  const confirmAnnotation = (labelId: string) => {
    if (!popup) return;
    const newAnn: Annotation = {
      id: nextAnnotationId(),
      start: popup.start,
      end: popup.end,
      labelId,
      text: text.slice(popup.start, popup.end),
    };
    set([...annotations, newAnn]);
    setPopup(null);
    window.getSelection()?.removeAllRanges();
  };

  const removeAnnotation = (id: string) => {
    set(annotations.filter((a) => a.id !== id));
  };

  const updateAnnotationLabel = (id: string, labelId: string) => {
    set(annotations.map((a) => (a.id === id ? { ...a, labelId } : a)));
    setEditingId(null);
  };

  // Build highlighted text segments
  const segments = React.useMemo(() => {
    const sorted = [...annotations].sort((a, b) => a.start - b.start);
    const result: { text: string; annotation?: Annotation }[] = [];
    let cursor = 0;
    for (const ann of sorted) {
      if (ann.start > cursor) {
        result.push({ text: text.slice(cursor, ann.start) });
      }
      result.push({ text: text.slice(ann.start, ann.end), annotation: ann });
      cursor = ann.end;
    }
    if (cursor < text.length) {
      result.push({ text: text.slice(cursor) });
    }
    return result;
  }, [text, annotations]);

  const labelMap = React.useMemo(() => {
    const map = new Map<string, LabelCategory>();
    labels.forEach((l) => map.set(l.id, l));
    return map;
  }, [labels]);

  // Label stats
  const labelStats = React.useMemo(() => {
    const counts = new Map<string, number>();
    labels.forEach((l) => counts.set(l.id, 0));
    annotations.forEach((a) => counts.set(a.labelId, (counts.get(a.labelId) ?? 0) + 1));
    const max = Math.max(...counts.values(), 1);
    return labels.map((l) => ({ ...l, count: counts.get(l.id) ?? 0, ratio: (counts.get(l.id) ?? 0) / max }));
  }, [labels, annotations]);

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
      {/* Toolbar */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          <h2 className="text-sm font-semibold text-[hsl(var(--foreground))]">Annotation Tool</h2>
        </div>
        <div className="flex items-center gap-1.5">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={undo}
            disabled={!canUndo}
            className={cn(
              'rounded-md p-1.5 transition-colors',
              canUndo ? 'text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]' : 'text-[hsl(var(--muted-foreground))] opacity-40',
            )}
          >
            <Undo2 className="h-4 w-4" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={redo}
            disabled={!canRedo}
            className={cn(
              'rounded-md p-1.5 transition-colors',
              canRedo ? 'text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]' : 'text-[hsl(var(--muted-foreground))] opacity-40',
            )}
          >
            <Redo2 className="h-4 w-4" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setShowShortcuts((v) => !v)}
            className="rounded-md p-1.5 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))]"
          >
            <Keyboard className="h-4 w-4" />
          </motion.button>
          {onExport && (
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => onExport(annotations)}
              className="flex items-center gap-1.5 rounded-lg border border-[hsl(var(--border))] px-3 py-1.5 text-xs font-medium text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--muted))]"
            >
              <Download className="h-3.5 w-3.5" />
              Export
            </motion.button>
          )}
        </div>
      </div>

      {/* Keyboard shortcuts */}
      <AnimatePresence>
        {showShortcuts && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="mb-4 overflow-hidden"
          >
            <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-3 text-xs text-[hsl(var(--muted-foreground))]">
              <div className="grid grid-cols-2 gap-2">
                <div><kbd className="rounded bg-[hsl(var(--muted))] px-1.5 py-0.5 font-mono text-[10px]">Ctrl+Z</kbd> Undo</div>
                <div><kbd className="rounded bg-[hsl(var(--muted))] px-1.5 py-0.5 font-mono text-[10px]">Ctrl+Y</kbd> Redo</div>
                <div><kbd className="rounded bg-[hsl(var(--muted))] px-1.5 py-0.5 font-mono text-[10px]">Select text</kbd> Add annotation</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-4">
        {/* Label sidebar */}
        <div className="w-40 shrink-0">
          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-wide text-[hsl(var(--muted-foreground))]">
            Labels
          </span>
          <div className="space-y-1.5">
            {labelStats.map((l) => (
              <motion.button
                key={l.id}
                onClick={() => setSelectedLabel(l.id)}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  'flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition-colors',
                  selectedLabel === l.id
                    ? 'bg-[hsl(var(--muted))] font-medium text-[hsl(var(--foreground))]'
                    : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]',
                )}
              >
                <span
                  className="h-3 w-3 shrink-0 rounded-sm"
                  style={{ backgroundColor: l.color }}
                />
                <span className="flex-1 truncate">{l.name}</span>
                <span className="text-[10px] opacity-60">{l.count}</span>
              </motion.button>
            ))}
          </div>

          {/* Label stats bars */}
          <div className="mt-4 space-y-2">
            <span className="block text-[10px] font-semibold uppercase tracking-wide text-[hsl(var(--muted-foreground))]">
              Statistics
            </span>
            {labelStats.map((l) => (
              <div key={l.id} className="space-y-0.5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[hsl(var(--muted-foreground))]">{l.name}</span>
                  <span className="font-medium text-[hsl(var(--foreground))]">{l.count}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[hsl(var(--muted))]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${l.ratio * 100}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: l.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Text area */}
        <div className="flex-1">
          <div
            ref={textRef}
            onMouseUp={handleTextMouseUp}
            className="relative mb-4 min-h-[200px] cursor-text rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-4 text-sm leading-relaxed text-[hsl(var(--foreground))] selection:bg-[hsl(var(--primary))]/20"
          >
            {segments.map((seg, i) => {
              if (seg.annotation) {
                const label = labelMap.get(seg.annotation.labelId);
                return (
                  <span
                    key={i}
                    className="rounded-sm px-0.5"
                    style={{
                      backgroundColor: label ? `${label.color}30` : undefined,
                      borderBottom: `2px solid ${label?.color ?? 'transparent'}`,
                    }}
                    title={label?.name}
                  >
                    {seg.text}
                  </span>
                );
              }
              return <span key={i}>{seg.text}</span>;
            })}

            {/* Label popup */}
            <AnimatePresence>
              {popup && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute z-30 flex items-center gap-1 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-1.5 shadow-lg"
                  style={{ left: popup.x, top: popup.y, transform: 'translate(-50%, -100%)' }}
                >
                  {labels.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => confirmAnnotation(l.id)}
                      className="flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors hover:bg-[hsl(var(--muted))]"
                    >
                      <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: l.color }} />
                      <span className="text-[hsl(var(--foreground))]">{l.name}</span>
                    </button>
                  ))}
                  <button
                    onClick={() => { setPopup(null); window.getSelection()?.removeAllRanges(); }}
                    className="rounded-md p-1 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))]"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Annotation list */}
          <div className="space-y-1.5">
            <span className="block text-[10px] font-semibold uppercase tracking-wide text-[hsl(var(--muted-foreground))]">
              Annotations ({annotations.length})
            </span>
            <AnimatePresence initial={false}>
              {annotations.map((ann) => {
                const label = labelMap.get(ann.labelId);
                return (
                  <motion.div
                    key={ann.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-xs"
                  >
                    <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: label?.color }} />
                    {editingId === ann.id ? (
                      <div className="flex flex-1 items-center gap-2">
                        <select
                          value={editLabelId}
                          onChange={(e) => setEditLabelId(e.target.value)}
                          className="rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-1.5 py-0.5 text-xs text-[hsl(var(--foreground))] outline-none"
                        >
                          {labels.map((l) => (
                            <option key={l.id} value={l.id}>{l.name}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => updateAnnotationLabel(ann.id, editLabelId)}
                          className="rounded p-0.5 text-emerald-500 transition-colors hover:bg-emerald-500/10"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="rounded p-0.5 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))]"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="flex-1 truncate font-medium text-[hsl(var(--foreground))]">
                          &ldquo;{ann.text}&rdquo;
                        </span>
                        <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ backgroundColor: `${label?.color}20`, color: label?.color }}>
                          {label?.name}
                        </span>
                        <button
                          onClick={() => { setEditingId(ann.id); setEditLabelId(ann.labelId); }}
                          className="rounded p-0.5 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))]"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => removeAnnotation(ann.id)}
                          className="rounded p-0.5 text-[hsl(var(--muted-foreground))] transition-colors hover:text-red-500 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

AnnotationLabelingTool.displayName = 'AnnotationLabelingTool';
