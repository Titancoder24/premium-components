'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertCircle,
  Download,
  Loader2,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FieldDef {
  key: string;
  label: string;
  required?: boolean;
  type?: 'string' | 'number' | 'date' | 'boolean';
}

export interface ImportResult {
  success: number;
  failed: number;
  errors?: Array<{ row: number; field: string; message: string }>;
}

export interface ImportExportWizardProps {
  targetFields: FieldDef[];
  onImport: (data: Record<string, unknown>[]) => Promise<ImportResult>;
  onExport?: () => void;
  className?: string;
}

type WizardStep = 'upload' | 'map' | 'preview' | 'import';

// ---------------------------------------------------------------------------
// Step indicator
// ---------------------------------------------------------------------------

const steps: { key: WizardStep; label: string }[] = [
  { key: 'upload', label: 'Upload' },
  { key: 'map', label: 'Map Fields' },
  { key: 'preview', label: 'Preview' },
  { key: 'import', label: 'Import' },
];

function StepIndicator({ current }: { current: WizardStep }) {
  const currentIdx = steps.findIndex((s) => s.key === current);

  return (
    <div className="flex items-center gap-2">
      {steps.map((step, i) => (
        <React.Fragment key={step.key}>
          <div className="flex items-center gap-1.5">
            <motion.div
              animate={{
                backgroundColor: i <= currentIdx ? 'var(--color-primary, #3b82f6)' : 'var(--color-muted, #e5e7eb)',
              }}
              transition={{ duration: 0.3 }}
              className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold text-white"
            >
              {i < currentIdx ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </motion.div>
            <span
              className={cn(
                'text-xs font-medium',
                i <= currentIdx ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className="relative h-0.5 w-8 overflow-hidden rounded bg-muted">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: i < currentIdx ? '100%' : '0%' }}
                transition={{ duration: 0.4 }}
                className="absolute left-0 top-0 h-full bg-[var(--color-primary,#3b82f6)]"
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// CSV parser (simple)
// ---------------------------------------------------------------------------

function parseCSV(text: string): { headers: string[]; rows: string[][] } {
  const lines = text.trim().split('\n');
  if (lines.length === 0) return { headers: [], rows: [] };
  const headers = lines[0]!.split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
  const rows = lines.slice(1).map((line) =>
    line.split(',').map((cell) => cell.trim().replace(/^"|"$/g, '')),
  );
  return { headers, rows };
}

// ---------------------------------------------------------------------------
// ImportExportWizard
// ---------------------------------------------------------------------------

export const ImportExportWizard: React.FC<ImportExportWizardProps> = ({
  targetFields,
  onImport,
  onExport,
  className,
}) => {
  const [step, setStep] = React.useState<WizardStep>('upload');
  const [dragOver, setDragOver] = React.useState(false);
  const [sourceHeaders, setSourceHeaders] = React.useState<string[]>([]);
  const [sourceRows, setSourceRows] = React.useState<string[][]>([]);
  const [mapping, setMapping] = React.useState<Record<string, string>>({});
  const [importing, setImporting] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [result, setResult] = React.useState<ImportResult | null>(null);

  const handleFile = React.useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (file.name.endsWith('.json')) {
        try {
          const data = JSON.parse(text);
          const arr = Array.isArray(data) ? data : [data];
          if (arr.length > 0) {
            setSourceHeaders(Object.keys(arr[0] as Record<string, unknown>));
            setSourceRows(arr.map((item) => Object.values(item as Record<string, unknown>).map(String)));
          }
        } catch {
          /* invalid JSON */
        }
      } else {
        const { headers, rows } = parseCSV(text);
        setSourceHeaders(headers);
        setSourceRows(rows);
      }
      setStep('map');
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const mappedData = React.useMemo(() => {
    return sourceRows.map((row) => {
      const record: Record<string, unknown> = {};
      targetFields.forEach((field) => {
        const sourceCol = mapping[field.key];
        if (sourceCol) {
          const idx = sourceHeaders.indexOf(sourceCol);
          record[field.key] = idx >= 0 ? row[idx] ?? undefined : undefined;
        }
      });
      return record;
    });
  }, [sourceRows, sourceHeaders, mapping, targetFields]);

  const validationErrors = React.useMemo(() => {
    const errs: Array<{ row: number; field: string }> = [];
    mappedData.forEach((record, ri) => {
      targetFields.forEach((f) => {
        if (f.required && (record[f.key] === undefined || record[f.key] === '')) {
          errs.push({ row: ri, field: f.key });
        }
      });
    });
    return errs;
  }, [mappedData, targetFields]);

  const doImport = React.useCallback(async () => {
    setImporting(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 8, 90));
    }, 120);
    try {
      const res = await onImport(mappedData);
      clearInterval(interval);
      setProgress(100);
      setResult(res);
    } catch {
      clearInterval(interval);
      setResult({ success: 0, failed: mappedData.length });
    } finally {
      setImporting(false);
    }
  }, [onImport, mappedData]);

  const hasErrors = (row: number, field: string) =>
    validationErrors.some((e) => e.row === row && e.field === field);

  return (
    <div className={cn('space-y-6 rounded-xl border border-border bg-card p-6 dark:bg-card', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <StepIndicator current={step} />
        {onExport && (
          <button
            type="button"
            onClick={onExport}
            className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
          >
            <Download className="h-3.5 w-3.5" /> Export
          </button>
        )}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        {step === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={cn(
                'flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-12 transition-colors',
                dragOver
                  ? 'border-[var(--color-primary,#3b82f6)] bg-[var(--color-primary,#3b82f6)]/5'
                  : 'border-border',
              )}
            >
              <motion.div animate={{ scale: dragOver ? 1.1 : 1 }} transition={{ type: 'spring', stiffness: 300 }}>
                <Upload className="h-10 w-10 text-muted-foreground" />
              </motion.div>
              <p className="text-sm text-muted-foreground">Drag & drop a CSV or JSON file here</p>
              <label className="cursor-pointer rounded-md bg-[var(--color-primary,#3b82f6)] px-4 py-2 text-xs font-medium text-white hover:opacity-90">
                Browse Files
                <input type="file" accept=".csv,.json" className="hidden" onChange={handleInputChange} />
              </label>
            </div>
          </motion.div>
        )}

        {step === 'map' && (
          <motion.div
            key="map"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-3"
          >
            <p className="text-sm text-muted-foreground">
              <FileText className="mr-1 inline h-4 w-4" />
              {sourceRows.length} rows detected. Map source columns to target fields.
            </p>
            <div className="space-y-2">
              {targetFields.map((field) => (
                <div key={field.key} className="flex items-center gap-3">
                  <span className="w-36 text-xs font-medium text-foreground">
                    {field.label}
                    {field.required && <span className="text-red-500"> *</span>}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  <select
                    value={mapping[field.key] || ''}
                    onChange={(e) => setMapping((m) => ({ ...m, [field.key]: e.target.value }))}
                    className="rounded-md border border-border bg-card px-2 py-1.5 text-xs text-foreground dark:bg-card"
                  >
                    <option value="">— Select column —</option>
                    {sourceHeaders.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'preview' && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {validationErrors.length > 0 && (
              <div className="mb-3 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
                <AlertCircle className="h-4 w-4" /> {validationErrors.length} validation error(s)
              </div>
            )}
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">#</th>
                    {targetFields.map((f) => (
                      <th key={f.key} className="px-3 py-2 text-left font-medium text-muted-foreground">
                        {f.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mappedData.slice(0, 10).map((row, ri) => (
                    <tr key={ri} className="border-b border-border last:border-0">
                      <td className="px-3 py-2 text-muted-foreground">{ri + 1}</td>
                      {targetFields.map((f) => (
                        <td
                          key={f.key}
                          className={cn(
                            'px-3 py-2 text-foreground',
                            hasErrors(ri, f.key) && 'bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400',
                          )}
                        >
                          {String(row[f.key] ?? '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {mappedData.length > 10 && (
              <p className="mt-2 text-xs text-muted-foreground">
                Showing 10 of {mappedData.length} rows
              </p>
            )}
          </motion.div>
        )}

        {step === 'import' && (
          <motion.div
            key="import"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {!result ? (
              <div className="space-y-3">
                <div className="h-3 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full bg-[var(--color-primary,#3b82f6)]"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  {importing ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Importing... {Math.round(progress)}%
                    </span>
                  ) : (
                    'Ready to import'
                  )}
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="space-y-2 rounded-lg border border-border p-4"
              >
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-emerald-500" />
                  <span className="text-sm font-semibold text-foreground">Import Complete</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {result.success} succeeded, {result.failed} failed
                </p>
                {result.errors && result.errors.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {result.errors.slice(0, 5).map((err, i) => (
                      <p key={i} className="text-xs text-red-500">
                        Row {err.row}: {err.field} — {err.message}
                      </p>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between border-t border-border pt-4">
        <button
          type="button"
          onClick={() => {
            const idx = steps.findIndex((s) => s.key === step);
            if (idx > 0) setStep(steps[idx - 1]!.key);
          }}
          disabled={step === 'upload'}
          className={cn(
            'flex items-center gap-1.5 rounded-md px-4 py-2 text-xs font-medium',
            step === 'upload'
              ? 'cursor-not-allowed text-muted-foreground'
              : 'text-foreground hover:bg-muted',
          )}
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </button>
        {step === 'import' ? (
          <button
            type="button"
            onClick={doImport}
            disabled={importing || !!result}
            className={cn(
              'flex items-center gap-1.5 rounded-md bg-[var(--color-primary,#3b82f6)] px-4 py-2 text-xs font-medium text-white',
              (importing || !!result) && 'cursor-not-allowed opacity-50',
            )}
          >
            {importing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            {result ? 'Done' : importing ? 'Importing...' : 'Start Import'}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              const idx = steps.findIndex((s) => s.key === step);
              if (idx < steps.length - 1) setStep(steps[idx + 1]!.key);
            }}
            disabled={step === 'upload'}
            className={cn(
              'flex items-center gap-1.5 rounded-md bg-[var(--color-primary,#3b82f6)] px-4 py-2 text-xs font-medium text-white',
              step === 'upload' && 'cursor-not-allowed opacity-50',
            )}
          >
            Next <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

ImportExportWizard.displayName = 'ImportExportWizard';
