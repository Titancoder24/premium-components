'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Copy,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  FileX2,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type FieldType = 'text' | 'number' | 'email' | 'select' | 'date';

export interface FieldSchema {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  width?: string;
}

export interface CrudResourcePanelProps {
  data: Record<string, unknown>[];
  schema: FieldSchema[];
  onCreate?: (values: Record<string, unknown>) => void | Promise<void>;
  onUpdate?: (index: number, values: Record<string, unknown>) => void | Promise<void>;
  onDelete?: (index: number) => void | Promise<void>;
  loading?: boolean;
  className?: string;
}

type RowAction = 'edit' | 'delete' | 'duplicate' | 'view';

interface ToastState {
  id: number;
  message: string;
  variant: 'success' | 'error';
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const rowVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.03, type: 'spring', stiffness: 300, damping: 24 },
  }),
  exit: { opacity: 0, x: -20, transition: { duration: 0.15 } },
};

let toastId = 0;

// ---------------------------------------------------------------------------
// CrudResourcePanel
// ---------------------------------------------------------------------------

export function CrudResourcePanel({
  data,
  schema,
  onCreate,
  onUpdate,
  onDelete,
  loading = false,
  className,
}: CrudResourcePanelProps) {
  const pageSize = 8;
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [showCreate, setShowCreate] = React.useState(false);
  const [editIndex, setEditIndex] = React.useState<number | null>(null);
  const [editValues, setEditValues] = React.useState<Record<string, unknown>>({});
  const [createValues, setCreateValues] = React.useState<Record<string, unknown>>({});
  const [deleteIndex, setDeleteIndex] = React.useState<number | null>(null);
  const [menuIndex, setMenuIndex] = React.useState<number | null>(null);
  const [toasts, setToasts] = React.useState<ToastState[]>([]);

  const addToast = (message: string, variant: 'success' | 'error') => {
    const id = ++toastId;
    setToasts((p) => [...p, { id, message, variant }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3000);
  };

  const filtered = React.useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((row) =>
      schema.some((f) => String(row[f.key] ?? '').toLowerCase().includes(q))
    );
  }, [data, search, schema]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice(page * pageSize, (page + 1) * pageSize);

  React.useEffect(() => {
    if (page >= totalPages) setPage(Math.max(0, totalPages - 1));
  }, [page, totalPages]);

  const handleCreate = async () => {
    try {
      await onCreate?.(createValues);
      setShowCreate(false);
      setCreateValues({});
      addToast('Resource created successfully', 'success');
    } catch {
      addToast('Failed to create resource', 'error');
    }
  };

  const handleUpdate = async () => {
    if (editIndex === null) return;
    try {
      await onUpdate?.(editIndex, editValues);
      setEditIndex(null);
      setEditValues({});
      addToast('Resource updated successfully', 'success');
    } catch {
      addToast('Failed to update resource', 'error');
    }
  };

  const handleDelete = async () => {
    if (deleteIndex === null) return;
    try {
      await onDelete?.(deleteIndex);
      setDeleteIndex(null);
      addToast('Resource deleted successfully', 'success');
    } catch {
      addToast('Failed to delete resource', 'error');
    }
  };

  const handleAction = (action: RowAction, idx: number) => {
    setMenuIndex(null);
    if (action === 'edit') {
      setEditIndex(idx);
      setEditValues({ ...data[idx] });
    } else if (action === 'delete') {
      setDeleteIndex(idx);
    } else if (action === 'duplicate') {
      onCreate?.({ ...data[idx] });
      addToast('Resource duplicated', 'success');
    } else if (action === 'view') {
      setEditIndex(idx);
      setEditValues({ ...data[idx] });
    }
  };

  const renderInput = (
    field: FieldSchema,
    values: Record<string, unknown>,
    onChange: (v: Record<string, unknown>) => void
  ) => {
    const val = String(values[field.key] ?? '');
    const base =
      'w-full rounded-md border border-border bg-background px-2 py-1 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/40';
    if (field.type === 'select') {
      return (
        <select
          className={base}
          value={val}
          onChange={(e) => onChange({ ...values, [field.key]: e.target.value })}
        >
          <option value="">Select...</option>
          {field.options?.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      );
    }
    return (
      <input
        type={field.type === 'number' ? 'number' : field.type === 'email' ? 'email' : field.type === 'date' ? 'date' : 'text'}
        className={base}
        value={val}
        onChange={(e) => onChange({ ...values, [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value })}
        placeholder={field.label}
      />
    );
  };

  return (
    <div className={cn('w-full rounded-lg border border-border bg-card', className)}>
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search resources..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full rounded-md border border-border bg-background py-1.5 pl-8 pr-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={() => { setShowCreate(!showCreate); setCreateValues({}); }}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Create
        </motion.button>
      </div>

      {/* Create form */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 28 } }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.2 } }}
            className="overflow-hidden border-b border-border bg-muted/30"
          >
            <div className="flex flex-wrap items-end gap-3 px-4 py-3">
              {schema.map((field) => (
                <div key={field.key} className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-muted-foreground">{field.label}</label>
                  {renderInput(field, createValues, setCreateValues)}
                </div>
              ))}
              <div className="flex gap-2">
                <button type="button" onClick={handleCreate} className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">Save</button>
                <button type="button" onClick={() => setShowCreate(false)} className="rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted">Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {schema.map((f) => (
                <th key={f.key} style={f.width ? { width: f.width } : undefined} className="px-4 py-3 text-left font-medium text-muted-foreground">
                  {f.label}
                </th>
              ))}
              <th className="w-12 px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-b border-border">
                  {schema.map((f) => (
                    <td key={f.key} className="px-4 py-3"><div className="h-4 w-3/4 animate-pulse rounded bg-muted" /></td>
                  ))}
                  <td className="px-4 py-3" />
                </motion.tr>
              ))
            ) : pageData.length === 0 ? (
              <tr>
                <td colSpan={schema.length + 1} className="px-4 py-16 text-center">
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-2 text-muted-foreground">
                    <FileX2 className="h-10 w-10 opacity-40" />
                    <p className="text-sm font-medium">No resources found</p>
                    <p className="text-xs">Try adjusting your search or create a new resource.</p>
                  </motion.div>
                </td>
              </tr>
            ) : (
              <AnimatePresence mode="popLayout">
                {pageData.map((row, i) => {
                  const globalIdx = page * pageSize + i;
                  const isEditing = editIndex === globalIdx;
                  return (
                    <motion.tr
                      key={globalIdx}
                      custom={i}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                      onClick={() => !isEditing && handleAction('edit', globalIdx)}
                      className={cn('border-b border-border cursor-pointer transition-colors', isEditing ? 'bg-primary/5' : 'hover:bg-muted/50')}
                    >
                      {schema.map((field) => (
                        <td key={field.key} className="px-4 py-2.5">
                          <AnimatePresence mode="wait">
                            {isEditing ? (
                              <motion.div key="input" initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -10, opacity: 0 }} transition={{ duration: 0.15 }}>
                                {renderInput(field, editValues, setEditValues)}
                              </motion.div>
                            ) : (
                              <motion.span key="text" initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 10, opacity: 0 }} transition={{ duration: 0.15 }} className="text-foreground">
                                {String(row[field.key] ?? '')}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </td>
                      ))}
                      <td className="px-4 py-2.5">
                        {isEditing ? (
                          <div className="flex gap-1">
                            <button type="button" onClick={(e) => { e.stopPropagation(); handleUpdate(); }} className="rounded p-1 text-primary hover:bg-primary/10"><CheckCircle2 className="h-4 w-4" /></button>
                            <button type="button" onClick={(e) => { e.stopPropagation(); setEditIndex(null); }} className="rounded p-1 text-muted-foreground hover:bg-muted"><X className="h-4 w-4" /></button>
                          </div>
                        ) : (
                          <div className="relative">
                            <button type="button" onClick={(e) => { e.stopPropagation(); setMenuIndex(menuIndex === globalIdx ? null : globalIdx); }} className="rounded p-1 text-muted-foreground hover:bg-muted">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                            <AnimatePresence>
                              {menuIndex === globalIdx && (
                                <motion.div
                                  initial={{ scale: 0.9, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0.9, opacity: 0 }}
                                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                  className="absolute right-0 top-8 z-20 w-36 rounded-md border border-border bg-card py-1 shadow-lg"
                                >
                                  {([['edit', Pencil, 'Edit'], ['duplicate', Copy, 'Duplicate'], ['view', Eye, 'View'], ['delete', Trash2, 'Delete']] as const).map(([action, Icon, label]) => (
                                    <button
                                      key={action}
                                      type="button"
                                      onClick={(e) => { e.stopPropagation(); handleAction(action, globalIdx); }}
                                      className={cn('flex w-full items-center gap-2 px-3 py-1.5 text-sm hover:bg-muted', action === 'delete' && 'text-red-500')}
                                    >
                                      <Icon className="h-3.5 w-3.5" /> {label}
                                    </button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border px-4 py-3 text-sm text-muted-foreground">
          <span>Page {page + 1} of {totalPages} ({filtered.length} results)</span>
          <div className="flex items-center gap-1">
            <button type="button" disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background transition-colors hover:bg-muted disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
            <button type="button" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)} className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background transition-colors hover:bg-muted disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      <AnimatePresence>
        {deleteIndex !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="w-full max-w-sm rounded-lg border border-border bg-card p-6 shadow-xl"
            >
              <h3 className="text-lg font-semibold text-foreground">Delete Resource</h3>
              <p className="mt-2 text-sm text-muted-foreground">Are you sure? This action cannot be undone.</p>
              <div className="mt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setDeleteIndex(null)} className="rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted">Cancel</button>
                <button type="button" onClick={handleDelete} className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toasts */}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[9999] flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className={cn(
                'pointer-events-auto flex items-center gap-2 rounded-md border px-4 py-2.5 text-sm shadow-lg',
                t.variant === 'success' ? 'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200' : 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200'
              )}
            >
              {t.variant === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

CrudResourcePanel.displayName = 'CrudResourcePanel';
