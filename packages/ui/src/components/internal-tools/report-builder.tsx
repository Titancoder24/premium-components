'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GripVertical,
  Plus,
  X,
  Table,
  BarChart3,
  LineChart,
  PieChart,
  Calendar,
  Play,
  Loader2,
  Settings2,
  ChevronDown,
  FileBarChart,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ChartType = 'table' | 'bar' | 'line' | 'pie';
export type AggregationType = 'none' | 'sum' | 'avg' | 'count' | 'min' | 'max';
export type FieldFormatType = 'default' | 'currency' | 'percent' | 'number' | 'date';

export interface ReportField {
  id: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'boolean';
}

export interface SelectedField {
  fieldId: string;
  aggregation: AggregationType;
  format: FieldFormatType;
}

export interface ReportConfig {
  fields: SelectedField[];
  chartType: ChartType;
  dateRange: { from: string; to: string };
}

export interface ReportBuilderProps {
  availableFields: ReportField[];
  onGenerate: (config: ReportConfig) => void | Promise<void>;
  className?: string;
}

// ---------------------------------------------------------------------------
// Chart type config
// ---------------------------------------------------------------------------

const chartTypes: { type: ChartType; icon: React.ElementType; label: string }[] = [
  { type: 'table', icon: Table, label: 'Table' },
  { type: 'bar', icon: BarChart3, label: 'Bar' },
  { type: 'line', icon: LineChart, label: 'Line' },
  { type: 'pie', icon: PieChart, label: 'Pie' },
];

const aggregations: AggregationType[] = ['none', 'sum', 'avg', 'count', 'min', 'max'];
const formats: FieldFormatType[] = ['default', 'currency', 'percent', 'number', 'date'];

// ---------------------------------------------------------------------------
// Field config popover
// ---------------------------------------------------------------------------

function FieldConfig({
  field,
  onUpdate,
}: {
  field: SelectedField;
  onUpdate: (f: SelectedField) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        <Settings2 className="h-3.5 w-3.5" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="absolute right-0 top-8 z-20 w-48 rounded-md border border-border bg-card p-3 shadow-lg"
          >
            <div className="space-y-2">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Aggregation</label>
                <select
                  value={field.aggregation}
                  onChange={(e) => onUpdate({ ...field, aggregation: e.target.value as AggregationType })}
                  className="mt-1 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {aggregations.map((a) => (
                    <option key={a} value={a}>{a === 'none' ? 'None' : a.toUpperCase()}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Format</label>
                <select
                  value={field.format}
                  onChange={(e) => onUpdate({ ...field, format: e.target.value as FieldFormatType })}
                  className="mt-1 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {formats.map((f) => (
                    <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ReportBuilder
// ---------------------------------------------------------------------------

export function ReportBuilder({
  availableFields,
  onGenerate,
  className,
}: ReportBuilderProps) {
  const [selected, setSelected] = React.useState<SelectedField[]>([]);
  const [chartType, setChartType] = React.useState<ChartType>('table');
  const [dateFrom, setDateFrom] = React.useState('');
  const [dateTo, setDateTo] = React.useState('');
  const [generating, setGenerating] = React.useState(false);
  const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null);

  const selectedIds = new Set(selected.map((s) => s.fieldId));
  const unselected = availableFields.filter((f) => !selectedIds.has(f.id));

  const addField = (fieldId: string) => {
    setSelected((prev) => [...prev, { fieldId, aggregation: 'none', format: 'default' }]);
  };

  const removeField = (fieldId: string) => {
    setSelected((prev) => prev.filter((f) => f.fieldId !== fieldId));
  };

  const updateField = (index: number, field: SelectedField) => {
    setSelected((prev) => prev.map((f, i) => (i === index ? field : f)));
  };

  const moveField = (from: number, to: number) => {
    setSelected((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await onGenerate({ fields: selected, chartType, dateRange: { from: dateFrom, to: dateTo } });
    } finally {
      setGenerating(false);
    }
  };

  const getFieldLabel = (fieldId: string) =>
    availableFields.find((f) => f.id === fieldId)?.label ?? fieldId;

  return (
    <div className={cn('w-full rounded-lg border border-border bg-card', className)}>
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <FileBarChart className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">Report Builder</h3>
      </div>

      <div className="grid gap-0 md:grid-cols-2">
        {/* Available fields */}
        <div className="border-b border-border p-4 md:border-b-0 md:border-r">
          <h4 className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Available Fields
          </h4>
          <div className="space-y-1.5">
            <AnimatePresence>
              {unselected.map((field) => (
                <motion.div
                  key={field.id}
                  layout
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                  className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-3.5 w-3.5 text-muted-foreground/50" />
                    <span className="text-sm text-foreground">{field.label}</span>
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                      {field.type}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => addField(field.id)}
                    className="rounded p-0.5 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
            {unselected.length === 0 && (
              <p className="py-4 text-center text-xs text-muted-foreground">All fields selected</p>
            )}
          </div>
        </div>

        {/* Selected fields */}
        <div className="p-4">
          <h4 className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Selected Fields ({selected.length})
          </h4>
          <div className="space-y-1.5">
            <AnimatePresence>
              {selected.map((sf, i) => (
                <motion.div
                  key={sf.fieldId}
                  layout
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12, transition: { duration: 0.15 } }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                  draggable
                  onDragStart={(e) => {
                    (e as unknown as DragEvent).dataTransfer?.setData('text/plain', String(i));
                  }}
                  onDragOver={(e) => {
                    (e as unknown as DragEvent).preventDefault?.();
                    setDragOverIndex(i);
                  }}
                  onDragLeave={() => setDragOverIndex(null)}
                  onDrop={(e) => {
                    (e as unknown as DragEvent).preventDefault?.();
                    const from = Number((e as unknown as DragEvent).dataTransfer?.getData('text/plain'));
                    if (!isNaN(from) && from !== i) moveField(from, i);
                    setDragOverIndex(null);
                  }}
                  className={cn(
                    'flex items-center justify-between rounded-md border px-3 py-2 transition-colors',
                    dragOverIndex === i
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-background',
                  )}
                >
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-3.5 w-3.5 cursor-grab text-muted-foreground/50" />
                    <span className="text-sm font-medium text-foreground">
                      {getFieldLabel(sf.fieldId)}
                    </span>
                    {sf.aggregation !== 'none' && (
                      <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                        {sf.aggregation.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <FieldConfig field={sf} onUpdate={(f) => updateField(i, f)} />
                    <button
                      type="button"
                      onClick={() => removeField(sf.fieldId)}
                      className="rounded p-0.5 text-muted-foreground hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {selected.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-1 py-8 text-muted-foreground"
              >
                <Plus className="h-8 w-8 opacity-30" />
                <p className="text-xs">Add fields from the left panel</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Configuration bar */}
      <div className="flex flex-wrap items-center gap-4 border-t border-border px-4 py-3">
        {/* Chart type */}
        <div className="flex items-center gap-1">
          {chartTypes.map(({ type, icon: Icon, label }) => (
            <motion.button
              key={type}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setChartType(type)}
              className={cn(
                'inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors',
                chartType === type
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </motion.button>
          ))}
        </div>

        {/* Date range */}
        <div className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground outline-none focus:ring-2 focus:ring-primary/40"
          />
          <span className="text-xs text-muted-foreground">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {/* Generate button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="button"
          disabled={selected.length === 0 || generating}
          onClick={handleGenerate}
          className="ml-auto inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50"
        >
          {generating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          {generating ? 'Generating...' : 'Generate Report'}
        </motion.button>
      </div>

      {/* Preview panel */}
      <AnimatePresence>
        {selected.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 28 } }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.2 } }}
            className="overflow-hidden border-t border-border"
          >
            <div className="bg-muted/20 px-4 py-3">
              <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Preview
              </h4>
              <div className="overflow-x-auto rounded-md border border-border bg-background">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      {selected.map((sf) => (
                        <th key={sf.fieldId} className="px-3 py-2 text-left font-medium text-muted-foreground">
                          {getFieldLabel(sf.fieldId)}
                          {sf.aggregation !== 'none' && (
                            <span className="ml-1 text-[10px] opacity-60">({sf.aggregation})</span>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[0, 1, 2].map((row) => (
                      <tr key={row} className="border-b border-border last:border-0">
                        {selected.map((sf) => (
                          <td key={sf.fieldId} className="px-3 py-2">
                            <div className="h-3 w-16 animate-pulse rounded bg-muted" />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

ReportBuilder.displayName = 'ReportBuilder';
