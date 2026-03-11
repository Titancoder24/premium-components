'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  X,
  ChevronDown,
  Trash2,
  Mail,
  RotateCw,
  UserCircle,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  avatarUrl?: string;
}

export interface PendingInvite {
  id: string;
  email: string;
  role: string;
  sentAt: string;
}

export interface TeamManagementPanelProps {
  members: TeamMember[];
  pendingInvites?: PendingInvite[];
  roles: string[];
  onInvite: (email: string, role: string) => void;
  onRemove: (memberId: string) => void;
  onChangeRole: (memberId: string, role: string) => void;
  onResendInvite?: (inviteId: string) => void;
  onCancelInvite?: (inviteId: string) => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Role Badge
// ---------------------------------------------------------------------------

const roleBadgeColors: Record<string, string> = {
  Owner: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  Admin: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  Member: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  Viewer: 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
};

function RoleBadge({ role }: { role: string }) {
  const colorClass =
    roleBadgeColors[role] ?? 'bg-gray-500/10 text-gray-600 dark:text-gray-400';
  return (
    <span
      className={cn(
        'rounded-full px-2 py-0.5 text-xs font-medium',
        colorClass,
      )}
    >
      {role}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Confirm Dialog
// ---------------------------------------------------------------------------

function ConfirmDialog({
  open,
  title,
  description,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl"
          >
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/50"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onConfirm}
                className="flex-1 rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground transition-colors"
              >
                Remove
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Role Dropdown
// ---------------------------------------------------------------------------

function RoleDropdown({
  currentRole,
  roles,
  onChange,
}: {
  currentRole: string;
  roles: string[];
  onChange: (role: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted/50"
      >
        {currentRole}
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-3 w-3" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="absolute right-0 top-full z-20 mt-1 min-w-[120px] overflow-hidden rounded-lg border border-border bg-card py-1 shadow-lg"
          >
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => {
                  onChange(role);
                  setOpen(false);
                }}
                className={cn(
                  'flex w-full items-center gap-2 px-3 py-1.5 text-xs transition-colors hover:bg-muted/50',
                  role === currentRole
                    ? 'font-semibold text-primary'
                    : 'text-foreground',
                )}
              >
                {role}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TeamManagementPanel
// ---------------------------------------------------------------------------

export function TeamManagementPanel({
  members,
  pendingInvites,
  roles,
  onInvite,
  onRemove,
  onChangeRole,
  onResendInvite,
  onCancelInvite,
  className,
}: TeamManagementPanelProps) {
  const [search, setSearch] = React.useState('');
  const [showInviteForm, setShowInviteForm] = React.useState(false);
  const [inviteEmail, setInviteEmail] = React.useState('');
  const [inviteRole, setInviteRole] = React.useState(roles[0] ?? 'Member');
  const [removeTarget, setRemoveTarget] = React.useState<TeamMember | null>(
    null,
  );

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()),
  );

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    onInvite(inviteEmail.trim(), inviteRole);
    setInviteEmail('');
    setShowInviteForm(false);
  };

  return (
    <div className={cn('w-full space-y-5', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Team Members</h2>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowInviteForm(!showInviteForm)}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors"
        >
          <Plus className="h-4 w-4" />
          Invite
        </motion.button>
      </div>

      {/* Invite form */}
      <AnimatePresence>
        {showInviteForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="overflow-hidden"
          >
            <div className="flex gap-3 rounded-xl border border-border bg-card p-4">
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Email address"
                className="flex-1 rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
              />
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleInvite}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors"
              >
                Send
              </motion.button>
              <button
                onClick={() => setShowInviteForm(false)}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted/50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search members..."
          className="w-full rounded-lg border border-border bg-transparent py-2 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Member list */}
      <div className="rounded-xl border border-border bg-card">
        {filteredMembers.map((member, i) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
            className={cn(
              'flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/30',
              i < filteredMembers.length - 1 && 'border-b border-border',
            )}
          >
            {/* Avatar */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
              {member.avatarUrl ? (
                <img
                  src={member.avatarUrl}
                  alt={member.name}
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : (
                <UserCircle className="h-5 w-5 text-muted-foreground" />
              )}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-medium text-foreground">
                  {member.name}
                </p>
                <span
                  className={cn(
                    'h-1.5 w-1.5 shrink-0 rounded-full',
                    member.status === 'active'
                      ? 'bg-emerald-500'
                      : 'bg-gray-400',
                  )}
                />
              </div>
              <p className="truncate text-xs text-muted-foreground">
                {member.email}
              </p>
            </div>

            {/* Role & actions */}
            <div className="flex items-center gap-2">
              <RoleBadge role={member.role} />
              <RoleDropdown
                currentRole={member.role}
                roles={roles}
                onChange={(role) => onChangeRole(member.id, role)}
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setRemoveTarget(member)}
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </motion.button>
            </div>
          </motion.div>
        ))}

        {filteredMembers.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            No members found.
          </div>
        )}
      </div>

      {/* Pending invites */}
      {pendingInvites && pendingInvites.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            Pending Invites
          </h3>
          <div className="rounded-xl border border-border bg-card">
            {pendingInvites.map((invite, i) => (
              <motion.div
                key={invite.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.04 }}
                className={cn(
                  'flex items-center gap-3 px-4 py-3',
                  i < pendingInvites.length - 1 && 'border-b border-border',
                )}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500/10">
                  <Mail className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {invite.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Invited as {invite.role} &middot; Sent{' '}
                    {new Date(invite.sentAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  {onResendInvite && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onResendInvite(invite.id)}
                      className="rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                    >
                      <RotateCw className="h-3.5 w-3.5" />
                    </motion.button>
                  )}
                  {onCancelInvite && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onCancelInvite(invite.id)}
                      className="rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="h-3.5 w-3.5" />
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Remove confirmation */}
      <ConfirmDialog
        open={removeTarget !== null}
        title="Remove Member"
        description={
          removeTarget
            ? `Are you sure you want to remove ${removeTarget.name} from the team? They will lose access immediately.`
            : ''
        }
        onConfirm={() => {
          if (removeTarget) onRemove(removeTarget.id);
          setRemoveTarget(null);
        }}
        onClose={() => setRemoveTarget(null)}
      />
    </div>
  );
}

TeamManagementPanel.displayName = 'TeamManagementPanel';
