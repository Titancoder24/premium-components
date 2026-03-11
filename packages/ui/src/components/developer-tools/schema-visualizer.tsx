'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  KeyRound,
  Link2,
  ChevronDown,
  Plus,
  Table2,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type FieldType = 'string' | 'number' | 'boolean' | 'date' | 'uuid' | 'json' | 'enum' | 'text';

export type RelationType = 'one-to-one' | 'one-to-many' | 'many-to-many';

export interface SchemaField {
  name: string;
  type: FieldType;
  primaryKey?: boolean;
  foreignKey?: { table: string; field: string };
  nullable?: boolean;
  unique?: boolean;
}

export interface SchemaTable {
  id: string;
  name: string;
  fields: SchemaField[];
}

export interface SchemaRelation {
  id: string;
  from: { table: string; field: string };
  to: { table: string; field: string };
  type: RelationType;
}

export interface SchemaVisualizerProps {
  tables: SchemaTable[];
  relationships: SchemaRelation[];
  onAddTable?: () => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const fieldTypeColors: Record<string, string> = {
  string: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  text: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  number: 'bg-purple-500/15 text-purple-600 dark:text-purple-400',
  boolean: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  date: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  uuid: 'bg-pink-500/15 text-pink-600 dark:text-pink-400',
  json: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400',
  enum: 'bg-orange-500/15 text-orange-600 dark:text-orange-400',
};

const relationLabels: Record<RelationType, string> = {
  'one-to-one': '1:1',
  'one-to-many': '1:N',
  'many-to-many': 'N:N',
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 400, damping: 25 },
  },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};

const fieldVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto', transition: { type: 'spring', stiffness: 500, damping: 30 } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.15 } },
};

// ---------------------------------------------------------------------------
// FieldRow
// ---------------------------------------------------------------------------

function FieldRow({
  field,
  isHighlighted,
  onHover,
  onLeave,
}: {
  field: SchemaField;
  isHighlighted: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  const typeColor = fieldTypeColors[field.type] ?? 'bg-gray-500/15 text-gray-600 dark:text-gray-400';

  return (
    <motion.div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={cn(
        'flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs transition-colors',
        isHighlighted
          ? 'bg-primary/10 ring-1 ring-primary/30'
          : 'hover:bg-[hsl(var(--muted))]/60',
      )}
    >
      <div className="flex w-4 shrink-0 items-center justify-center">
        {field.primaryKey ? (
          <KeyRound className="h-3 w-3 text-amber-500" />
        ) : field.foreignKey ? (
          <Link2 className="h-3 w-3 text-blue-500" />
        ) : (
          <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--muted-foreground))]/40" />
        )}
      </div>
      <span className="flex-1 font-mono text-[hsl(var(--foreground))]">{field.name}</span>
      <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-semibold', typeColor)}>
        {field.type}
      </span>
      {field.nullable && (
        <span className="text-[10px] text-[hsl(var(--muted-foreground))]">null</span>
      )}
      {field.unique && (
        <span className="text-[10px] font-medium text-violet-500">uniq</span>
      )}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// TableCard
// ---------------------------------------------------------------------------

function TableCard({
  table,
  relationships,
  highlightedField,
  onFieldHover,
  onFieldLeave,
}: {
  table: SchemaTable;
  relationships: SchemaRelation[];
  highlightedField: { table: string; field: string } | null;
  onFieldHover: (table: string, field: string) => void;
  onFieldLeave: () => void;
}) {
  const [expanded, setExpanded] = React.useState(true);
  const visibleFields = expanded ? table.fields : table.fields.slice(0, 3);
  const hasMore = table.fields.length > 3;

  const isFieldHighlighted = (fieldName: string) => {
    if (!highlightedField) return false;
    if (highlightedField.table === table.id && highlightedField.field === fieldName) return true;
    return relationships.some(
      (r) =>
        (r.from.table === highlightedField.table &&
          r.from.field === highlightedField.field &&
          r.to.table === table.id &&
          r.to.field === fieldName) ||
        (r.to.table === highlightedField.table &&
          r.to.field === highlightedField.field &&
          r.from.table === table.id &&
          r.from.field === fieldName),
    );
  };

  return (
    <motion.div
      variants={cardVariants}
      layout
      whileHover={{ y: -4, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="w-64 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-sm"
    >
      {/* Table Header */}
      <div className="flex items-center gap-2 border-b border-[hsl(var(--border))] px-3 py-2.5">
        <Table2 className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
        <span className="flex-1 text-sm font-semibold text-[hsl(var(--foreground))]">
          {table.name}
        </span>
        <span className="text-[10px] text-[hsl(var(--muted-foreground))]">
          {table.fields.length} fields
        </span>
      </div>

      {/* Fields */}
      <div className="p-1.5">
        <AnimatePresence initial={false}>
          {visibleFields.map((field) => (
            <motion.div
              key={field.name}
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="overflow-hidden"
            >
              <FieldRow
                field={field}
                isHighlighted={isFieldHighlighted(field.name)}
                onHover={() => onFieldHover(table.id, field.name)}
                onLeave={onFieldLeave}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {hasMore && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-1 flex w-full items-center justify-center gap-1 rounded-md py-1.5 text-[11px] font-medium text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))]/60 hover:text-[hsl(var(--foreground))]"
          >
            {expanded ? 'Show less' : `Show ${table.fields.length - 3} more`}
            <ChevronDown
              className={cn(
                'h-3 w-3 transition-transform',
                expanded && 'rotate-180',
              )}
            />
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// RelationBadge
// ---------------------------------------------------------------------------

function RelationBadge({ relation }: { relation: SchemaRelation }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/40 px-3 py-2 text-xs">
      <span className="font-mono text-[hsl(var(--foreground))]">
        {relation.from.table}.{relation.from.field}
      </span>
      <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold text-primary">
        {relationLabels[relation.type]}
      </span>
      <span className="font-mono text-[hsl(var(--foreground))]">
        {relation.to.table}.{relation.to.field}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SchemaVisualizer
// ---------------------------------------------------------------------------

export const SchemaVisualizer: React.FC<SchemaVisualizerProps> = ({
  tables,
  relationships,
  onAddTable,
  className,
}) => {
  const [highlightedField, setHighlightedField] = React.useState<{
    table: string;
    field: string;
  } | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5',
        className,
      )}
    >
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Table2 className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">Schema</h3>
          <span className="text-xs text-[hsl(var(--muted-foreground))]">
            {tables.length} tables &middot; {relationships.length} relations
          </span>
        </div>
        {onAddTable && (
          <motion.button
            type="button"
            onClick={onAddTable}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[hsl(var(--primary))] px-3 py-1.5 text-xs font-medium text-[hsl(var(--primary-foreground))] transition-opacity hover:opacity-90"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Table
          </motion.button>
        )}
      </div>

      {/* Table Cards Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
        className="mb-5 flex flex-wrap gap-4"
      >
        <AnimatePresence>
          {tables.map((table) => (
            <TableCard
              key={table.id}
              table={table}
              relationships={relationships}
              highlightedField={highlightedField}
              onFieldHover={(t, f) => setHighlightedField({ table: t, field: f })}
              onFieldLeave={() => setHighlightedField(null)}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Relationships */}
      {relationships.length > 0 && (
        <div>
          <span className="mb-2 block text-xs font-medium text-[hsl(var(--muted-foreground))]">
            Relationships
          </span>
          <div className="flex flex-wrap gap-2">
            {relationships.map((rel) => (
              <motion.div
                key={rel.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  boxShadow:
                    highlightedField &&
                    ((rel.from.table === highlightedField.table &&
                      rel.from.field === highlightedField.field) ||
                      (rel.to.table === highlightedField.table &&
                        rel.to.field === highlightedField.field))
                      ? '0 0 12px rgba(var(--primary), 0.4)'
                      : '0 0 0px transparent',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <RelationBadge relation={rel} />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {tables.length === 0 && (
        <div className="py-8 text-center text-sm text-[hsl(var(--muted-foreground))]">
          No tables defined. Add a table to get started.
        </div>
      )}
    </motion.div>
  );
};

SchemaVisualizer.displayName = 'SchemaVisualizer';
