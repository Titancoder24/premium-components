'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  X,
  Shield,
  ChevronDown,
  Lock,
  Minus,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Permission {
  id: string;
  label: string;
  description?: string;
}

export interface PermissionGroup {
  id: string;
  label: string;
  permissions: Permission[];
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

export type PermissionValue = 'granted' | 'denied' | 'inherited';

export interface PermissionsMatrixProps {
  roles: Role[];
  permissionGroups: PermissionGroup[];
  values: Record<string, Record<string, PermissionValue>>;
  onChange?: (roleId: string, permissionId: string, value: PermissionValue) => void;
  readOnly?: boolean;
  className?: string;
}

// ---------------------------------------------------------------------------
// Permission Cell
// ---------------------------------------------------------------------------

function PermissionCell({
  value,
  onChange,
  readOnly,
}: {
  value: PermissionValue;
  onChange?: (v: PermissionValue) => void;
  readOnly?: boolean;
}) {
  const cycle = () => {
    if (readOnly || !onChange) return;
    const next: PermissionValue =
      value === 'granted' ? 'denied' : value === 'denied' ? 'inherited' : 'granted';
    onChange(next);
  };

  return (
    <motion.button
      type="button"
      disabled={readOnly}
      onClick={cycle}
      whileHover={readOnly ? {} : { scale: 1.15 }}
      whileTap={readOnly ? {} : { scale: 0.9 }}
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
        value === 'granted'
          ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400'
          : value === 'denied'
            ? 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400'
            : 'bg-muted text-muted-foreground',
        !readOnly && 'cursor-pointer hover:ring-2 hover:ring-primary/30',
      )}
    >
      <AnimatePresence mode="wait">
        {value === 'granted' ? (
          <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }}>
            <Check className="h-4 w-4" />
          </motion.div>
        ) : value === 'denied' ? (
          <motion.div key="x" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }}>
            <X className="h-4 w-4" />
          </motion.div>
        ) : (
          <motion.div key="inherit" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }}>
            <Minus className="h-4 w-4" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PermissionsMatrix({
  roles,
  permissionGroups,
  values,
  onChange,
  readOnly = false,
  className,
}: PermissionsMatrixProps) {
  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(
    () => new Set(permissionGroups.map((g) => g.id)),
  );
  const [hoveredRole, setHoveredRole] = React.useState<string | null>(null);
  const [hoveredPerm, setHoveredPerm] = React.useState<string | null>(null);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  const getVal = (roleId: string, permId: string): PermissionValue => {
    return values[roleId]?.[permId] ?? 'inherited';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn('w-full rounded-xl border border-border bg-card shadow-sm', className)}
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border p-5">
        <Shield className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold text-foreground">Permissions</h2>
        {readOnly && (
          <span className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            <Lock className="h-3 w-3" />
            Read-only
          </span>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 border-b border-border px-5 py-2.5">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-emerald-100 dark:bg-emerald-900/40">
            <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
          </div>
          Granted
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-red-100 dark:bg-red-900/40">
            <X className="h-3 w-3 text-red-600 dark:text-red-400" />
          </div>
          Denied
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-muted">
            <Minus className="h-3 w-3" />
          </div>
          Inherited
        </div>
      </div>

      {/* Matrix */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          {/* Role headers */}
          <thead>
            <tr className="border-b border-border">
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">
                Permission
              </th>
              {roles.map((role, ri) => (
                <th
                  key={role.id}
                  className="px-3 py-3 text-center"
                  onMouseEnter={() => setHoveredRole(role.id)}
                  onMouseLeave={() => setHoveredRole(null)}
                >
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: ri * 0.05 }}
                    className={cn(
                      'inline-flex flex-col items-center gap-0.5 transition-opacity',
                      hoveredRole && hoveredRole !== role.id ? 'opacity-50' : 'opacity-100',
                    )}
                  >
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-0.5 text-xs font-semibold',
                        role.color || 'bg-primary/10 text-primary',
                      )}
                    >
                      {role.name}
                    </span>
                    {role.description && (
                      <span className="text-[10px] text-muted-foreground">{role.description}</span>
                    )}
                  </motion.div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {permissionGroups.map((group) => {
              const isExpanded = expandedGroups.has(group.id);
              return (
                <React.Fragment key={group.id}>
                  {/* Group header */}
                  <tr>
                    <td colSpan={roles.length + 1} className="px-3 pt-2">
                      <button
                        type="button"
                        onClick={() => toggleGroup(group.id)}
                        className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left transition-colors hover:bg-muted/50"
                      >
                        <motion.div
                          animate={{ rotate: isExpanded ? 0 : -90 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                        </motion.div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {group.label}
                        </span>
                      </button>
                    </td>
                  </tr>
                  {/* Permissions */}
                  <AnimatePresence>
                    {isExpanded &&
                      group.permissions.map((perm, pi) => (
                        <motion.tr
                          key={perm.id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2, delay: pi * 0.02 }}
                          className={cn(
                            'border-b border-border/50 transition-colors',
                            hoveredPerm === perm.id && 'bg-muted/30',
                          )}
                          onMouseEnter={() => setHoveredPerm(perm.id)}
                          onMouseLeave={() => setHoveredPerm(null)}
                        >
                          <td className="px-5 py-2.5">
                            <p className="text-sm font-medium text-foreground">{perm.label}</p>
                            {perm.description && (
                              <p className="text-xs text-muted-foreground">{perm.description}</p>
                            )}
                          </td>
                          {roles.map((role) => (
                            <td key={role.id} className="px-3 py-2.5 text-center">
                              <div className="flex justify-center">
                                <PermissionCell
                                  value={getVal(role.id, perm.id)}
                                  readOnly={readOnly}
                                  onChange={
                                    onChange
                                      ? (v) => onChange(role.id, perm.id, v)
                                      : undefined
                                  }
                                />
                              </div>
                            </td>
                          ))}
                        </motion.tr>
                      ))}
                  </AnimatePresence>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

PermissionsMatrix.displayName = 'PermissionsMatrix';
