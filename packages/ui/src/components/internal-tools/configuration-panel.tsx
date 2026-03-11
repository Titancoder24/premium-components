'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Search,
  RotateCcw,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ConfigFieldType = 'toggle' | 'text' | 'number' | 'select' | 'color';

export interface ConfigField {
  key: string;
  label: string;
  type: ConfigFieldType;
  description?: string;
  options?: string[];
  min?: number;
  max?: number;
  validation?: (value: unknown) => string | undefined;
}

export interface ConfigCategory {
  id: string;
  label: string;
  icon?: React.ElementType;
  fields: ConfigField[];
}

export interface ConfigurationPanelProps {
  categories: ConfigCategory[];
  values: Record<string, unknown>;
  onSave: (values: Record<string, unknown>) => void | Promise<void>;
  onReset?: (categoryId: string) => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Toggle switch
// ---------------------------------------------------------------------------

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-6 w-11 rounded-full transition-colors',
        checked ? 'bg-primary' : 'bg-muted',
      )}
    >
      <motion.div
        animate={{ x: checked ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm"
      />
    </button>
  );
}

// ---------------------------------------------------------------------------
// Field renderer
// ---------------------------------------------------------------------------

function FieldRenderer({
  field,
  value,
  error,
  onChange,
}: {
  field: ConfigField;
  value: unknown;
  error?: string;
  onChange: (key: string, value: unknown) => void;
}) {
  const inputBase =
    'rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/40';

  switch (field.type) {
    case 'toggle':
      return <Toggle checked={!!value} onChange={(v) => onChange(field.key, v)} />;
    case 'text':
      return (
        <input
          type="text"
          value={String(value ?? '')}
          onChange={(e) => onChange(field.key, e.target.value)}
          className={cn(inputBase, 'w-full max-w-xs')}
        />
      );
    case 'number':
      return (
        <input
          type="number"
          value={value !== undefined && value !== null ? Number(value) : ''}
          min={field.min}
          max={field.max}
          onChange={(e) => onChange(field.key, Number(e.target.value))}
          className={cn(inputBase, 'w-28')}
        />
      );
    case 'select':
      return (
        <select
          value={String(value ?? '')}
          onChange={(e) => onChange(field.key, e.target.value)}
          className={cn(inputBase, 'w-full max-w-xs')}
        >
          <option value="">Select...</option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    case 'color':
      return (
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={String(value ?? '#000000')}
            onChange={(e) => onChange(field.key, e.target.value)}
            className="h-8 w-8 cursor-pointer rounded border border-border bg-transparent"
          />
          <span className="text-xs text-muted-foreground">{String(value ?? '#000000')}</span>
        </div>
      );
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Category section
// ---------------------------------------------------------------------------

function CategorySection({
  category,
  values,
  errors,
  search,
  onChange,
  onReset,
}: {
  category: ConfigCategory;
  values: Record<string, unknown>;
  errors: Record<string, string>;
  search: string;
  onChange: (key: string, value: unknown) => void;
  onReset?: () => void;
}) {
  const [expanded, setExpanded] = React.useState(true);
  const Icon = category.icon;

  const filteredFields = React.useMemo(() => {
    if (!search.trim()) return category.fields;
    const q = search.toLowerCase();
    return category.fields.filter(
      (f) =>
        f.label.toLowerCase().includes(q) ||
        f.description?.toLowerCase().includes(q),
    );
  }, [category.fields, search]);

  if (filteredFields.length === 0) return null;

  return (
    <div className="rounded-lg border border-border bg-card">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left"
      >
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        <span className="flex-1 text-sm font-semibold text-foreground">{category.label}</span>
        {onReset && (
          <motion.button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onReset();
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mr-2 rounded px-2 py-0.5 text-[10px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <RotateCcw className="mr-1 inline h-3 w-3" />
            Reset
          </motion.button>
        )}
        <motion.span
          animate={{ rotate: expanded ? 0 : -90 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </motion.span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="space-y-4 border-t border-border px-4 py-4">
              {filteredFields.map((field) => (
                <div key={field.key} className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-foreground">{field.label}</label>
                    {field.description && (
                      <p className="mt-0.5 text-xs text-muted-foreground">{field.description}</p>
                    )}
                    {errors[field.key] && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 flex items-center gap-1 text-xs text-red-500"
                      >
                        <AlertCircle className="h-3 w-3" /> {errors[field.key]}
                      </motion.p>
                    )}
                  </div>
                  <div className="shrink-0">
                    <FieldRenderer
                      field={field}
                      value={values[field.key]}
                      error={errors[field.key]}
                      onChange={onChange}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ConfigurationPanel
// ---------------------------------------------------------------------------

export function ConfigurationPanel({
  categories,
  values: initialValues,
  onSave,
  onReset,
  className,
}: ConfigurationPanelProps) {
  const [values, setValues] = React.useState<Record<string, unknown>>(initialValues);
  const [search, setSearch] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [activeCategoryId, setActiveCategoryId] = React.useState(categories[0]?.id ?? '');

  const hasChanges = React.useMemo(
    () => JSON.stringify(values) !== JSON.stringify(initialValues),
    [values, initialValues],
  );

  const errors = React.useMemo(() => {
    const errs: Record<string, string> = {};
    categories.forEach((cat) => {
      cat.fields.forEach((field) => {
        if (field.validation) {
          const msg = field.validation(values[field.key]);
          if (msg) errs[field.key] = msg;
        }
      });
    });
    return errs;
  }, [categories, values]);

  const handleChange = (key: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (Object.keys(errors).length > 0) return;
    setSaving(true);
    try {
      await onSave(values);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 1500);
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    setValues(initialValues);
  };

  const handleReset = (categoryId: string) => {
    onReset?.(categoryId);
  };

  return (
    <div className={cn('flex gap-6', className)}>
      {/* Category navigation sidebar */}
      <nav className="hidden w-44 shrink-0 space-y-1 md:block">
        {categories.map((cat) => {
          const CatIcon = cat.icon;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategoryId(cat.id)}
              className={cn(
                'flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition-colors',
                activeCategoryId === cat.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {CatIcon && <CatIcon className="h-3.5 w-3.5" />}
              {cat.label}
            </button>
          );
        })}
      </nav>

      {/* Main content */}
      <div className="flex-1 space-y-4">
        {/* Unsaved changes banner */}
        <AnimatePresence>
          {hasChanges && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="overflow-hidden"
            >
              <div
                className={cn(
                  'flex items-center justify-between rounded-lg border px-4 py-2.5',
                  saveSuccess
                    ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950'
                    : 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950',
                )}
              >
                {saveSuccess ? (
                  <motion.span
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-300"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Settings saved successfully
                  </motion.span>
                ) : (
                  <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                    You have unsaved changes
                  </span>
                )}
                <div className="flex items-center gap-2">
                  <motion.button
                    type="button"
                    onClick={handleDiscard}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                  >
                    <X className="h-3 w-3" /> Discard
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={handleSave}
                    disabled={saving || Object.keys(errors).length > 0}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={cn(
                      'flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground',
                      (saving || Object.keys(errors).length > 0) && 'cursor-not-allowed opacity-50',
                    )}
                  >
                    <Save className="h-3 w-3" /> {saving ? 'Saving...' : 'Save'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search settings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-border bg-background py-1.5 pl-8 pr-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {/* Categories */}
        <div className="space-y-3">
          {categories.map((cat) => (
            <CategorySection
              key={cat.id}
              category={cat}
              values={values}
              errors={errors}
              search={search}
              onChange={handleChange}
              onReset={onReset ? () => handleReset(cat.id) : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

ConfigurationPanel.displayName = 'ConfigurationPanel';
