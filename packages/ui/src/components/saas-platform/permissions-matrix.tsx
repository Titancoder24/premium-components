'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  Save,
  Undo2,
  Info,
  Check,
  Users,
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
  memberCount?: number;
}

export interface PermissionsMatrixProps {
  roles: Role[];
  permissionGroups: PermissionGroup[];
  /** Initial mapping of roleId -> array of permissionIds */
  initialValues?: Record<string, string[]>;
  onToggle?: (roleId: string, permissionId: string, enabled: boolean) => void;
  onSave: (values: Record<string, string[]>) => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Toggle Cell
// ---------------------------------------------------------------------------

function ToggleCell({
  enabled,
  onToggle,
  highlighted,
}: {
  enabled: boolean;
  onToggle: () => void;
  highlighted: boolean;
}) {
  return (
    <td
      className={cn(
        'relative px-3 py-2 text-center transition-colors',
        highlighted && 'bg-primary/5 dark:bg-primary/10',
      )}
    >
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={onToggle}
        className={cn(
          'inline-flex h-6 w-6 items-center justify-center rounded-md border-2 transition-colors',
          enabled
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-border bg-transparent hover:border-muted-foreground/50',
        )}
      >
        <AnimatePresence mode="wait">
          {enabled && (
            <motion.div
              key="check"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            >
              <Check className="h-3.5 w-3.5" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </td>
  );
}

// ---------------------------------------------------------------------------
// Tooltip
// ---------------------------------------------------------------------------

function DescriptionTooltip({ text }: { text: string }) {
  const [show, setShow] = React.useState(false);

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <Info className="h-3 w-3 cursor-help text-muted-foreground/60" />
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 z-30 mb-2 w-48 -translate-x-1/2 rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground shadow-lg"
          >
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

// ---------------------------------------------------------------------------
// PermissionsMatrix
// ---------------------------------------------------------------------------

export function PermissionsMatrix({
  roles,
  permissionGroups,
  initialValues,
  onToggle,
  onSave,
  className,
}: PermissionsMatrixProps) {
  // Build initial state: roleId -> Set<permissionId>
  const buildStateFromValues = React.useCallback(
    (vals?: Record<string, string[]>) => {
      const state: Record<string, Set<string>> = {};
      for (const role of roles) {
        state[role.id] = new Set(vals?.[role.id] ?? []);
      }
      return state;
    },
    [roles],
  );

  const [values, setValues] = React.useState(() =>
    buildStateFromValues(initialValues),
  );
  const [savedValues, setSavedValues] = React.useState(() =>
    buildStateFromValues(initialValues),
  );
  const [collapsedGroups, setCollapsedGroups] = React.useState<Set<string>>(
    new Set(),
  );
  const [hoveredRow, setHoveredRow] = React.useState<string | null>(null);
  const [hoveredCol, setHoveredCol] = React.useState<string | null>(null);

  // Track unsaved changes
  const hasChanges = React.useMemo(() => {
    for (const role of roles) {
      const current = values[role.id] ?? new Set();
      const saved = savedValues[role.id] ?? new Set();
      if (current.size !== saved.size) return true;
      for (const id of current) {
        if (!saved.has(id)) return true;
      }
    }
    return false;
  }, [values, savedValues, roles]);

  const handleToggle = (roleId: string, permissionId: string) => {
    setValues((prev) => {
      const next = { ...prev };
      const set = new Set(next[roleId] ?? []);
      const enabled = !set.has(permissionId);
      if (enabled) {
        set.add(permissionId);
      } else {
        set.delete(permissionId);
      }
      next[roleId] = set;
      onToggle?.(roleId, permissionId, enabled);
      return next;
    });
  };

  const handleBulkToggle = (roleId: string) => {
    const allPermIds = permissionGroups.flatMap((g) =>
      g.permissions.map((p) => p.id),
    );
    const current = values[roleId] ?? new Set();
    const allEnabled = allPermIds.every((id) => current.has(id));

    setValues((prev) => {
      const next = { ...prev };
      if (allEnabled) {
        next[roleId] = new Set();
      } else {
        next[roleId] = new Set(allPermIds);
      }
      return next;
    });
  };

  const handleSave = () => {
    const result: Record<string, string[]> = {};
    for (const role of roles) {
      result[role.id] = Array.from(values[role.id] ?? []);
    }
    onSave(result);
    setSavedValues({ ...values });
  };

  const handleDiscard = () => {
    setValues(buildStateFromValues(
      Object.fromEntries(
        Object.entries(savedValues).map(([k, v]) => [k, Array.from(v)]),
      ),
    ));
  };

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn('w-full space-y-4', className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Permissions</h2>
        <AnimatePresence>
          {hasChanges && (
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="flex items-center gap-2"
            >
              <span className="mr-1 h-2 w-2 rounded-full bg-amber-500" />
              <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                Unsaved changes
              </span>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDiscard}
                className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/50"
              >
                <Undo2 className="h-3 w-3" />
                Discard
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition-colors"
              >
                <Save className="h-3 w-3" />
                Save
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Matrix table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="sticky left-0 z-10 bg-card px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                Permission
              </th>
              {roles.map((role) => {
                const allPermIds = permissionGroups.flatMap((g) =>
                  g.permissions.map((p) => p.id),
                );
                const current = values[role.id] ?? new Set();
                const allEnabled = allPermIds.every((id) =>
                  current.has(id),
                );

                return (
                  <th
                    key={role.id}
                    className={cn(
                      'px-3 py-3 text-center transition-colors',
                      hoveredCol === role.id && 'bg-primary/5 dark:bg-primary/10',
                    )}
                    onMouseEnter={() => setHoveredCol(role.id)}
                    onMouseLeave={() => setHoveredCol(null)}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs font-semibold text-foreground">
                        {role.name}
                      </span>
                      {role.memberCount != null && (
                        <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                          <Users className="h-2.5 w-2.5" />
                          {role.memberCount}
                        </span>
                      )}
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleBulkToggle(role.id)}
                        className={cn(
                          'mt-1 rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors',
                          allEnabled
                            ? 'bg-primary/10 text-primary'
                            : 'bg-muted text-muted-foreground hover:text-foreground',
                        )}
                      >
                        {allEnabled ? 'Deselect all' : 'Select all'}
                      </motion.button>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {permissionGroups.map((group) => {
              const isCollapsed = collapsedGroups.has(group.id);

              return (
                <React.Fragment key={group.id}>
                  {/* Group header */}
                  <tr
                    className="cursor-pointer border-b border-border bg-muted/30 transition-colors hover:bg-muted/50"
                    onClick={() => toggleGroup(group.id)}
                  >
                    <td
                      colSpan={roles.length + 1}
                      className="px-4 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: isCollapsed ? 0 : 90 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                        </motion.div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {group.label}
                        </span>
                      </div>
                    </td>
                  </tr>

                  {/* Permission rows */}
                  <AnimatePresence>
                    {!isCollapsed &&
                      group.permissions.map((perm, pi) => (
                        <motion.tr
                          key={perm.id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{
                            duration: 0.2,
                            delay: pi * 0.02,
                          }}
                          className={cn(
                            'border-b border-border transition-colors last:border-0',
                            hoveredRow === perm.id && 'bg-muted/20',
                          )}
                          onMouseEnter={() => setHoveredRow(perm.id)}
                          onMouseLeave={() => setHoveredRow(null)}
                        >
                          <td className="sticky left-0 z-10 bg-card px-4 py-2.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm text-foreground">
                                {perm.label}
                              </span>
                              {perm.description && (
                                <DescriptionTooltip
                                  text={perm.description}
                                />
                              )}
                            </div>
                          </td>
                          {roles.map((role) => {
                            const enabled = (
                              values[role.id] ?? new Set()
                            ).has(perm.id);
                            const isHighlighted =
                              hoveredRow === perm.id ||
                              hoveredCol === role.id;

                            return (
                              <ToggleCell
                                key={role.id}
                                enabled={enabled}
                                onToggle={() =>
                                  handleToggle(role.id, perm.id)
                                }
                                highlighted={isHighlighted}
                              />
                            );
                          })}
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
