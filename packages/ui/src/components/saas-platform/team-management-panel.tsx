'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserPlus,
  MoreHorizontal,
  Shield,
  Trash2,
  Mail,
  Check,
  X,
  Search,
  ChevronDown,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  status: 'active' | 'invited' | 'deactivated';
  joinedAt?: string;
}

export interface TeamManagementPanelProps {
  members: TeamMember[];
  onInvite?: (email: string, role: string) => void;
  onRemove?: (memberId: string) => void;
  onRoleChange?: (memberId: string, role: string) => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const roleColors: Record<string, string> = {
  owner: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  admin: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  member: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  viewer: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
};

const statusColors: Record<string, string> = {
  active: 'bg-emerald-500',
  invited: 'bg-amber-500',
  deactivated: 'bg-gray-400 dark:bg-gray-600',
};

function MemberAvatar({ member }: { member: TeamMember }) {
  const initials = member.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (member.avatarUrl) {
    return (
      <img
        src={member.avatarUrl}
        alt={member.name}
        className="h-9 w-9 rounded-full object-cover"
      />
    );
  }

  const colors = ['bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500'];
  const idx = member.name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length;

  return (
    <div className={cn('flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white', colors[idx])}>
      {initials}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Invite Modal
// ---------------------------------------------------------------------------

function InviteModal({
  open,
  onClose,
  onInvite,
}: {
  open: boolean;
  onClose: () => void;
  onInvite: (email: string, role: string) => void;
}) {
  const [email, setEmail] = React.useState('');
  const [role, setRole] = React.useState('member');

  const handleSubmit = () => {
    if (email.trim()) {
      onInvite(email.trim(), role);
      setEmail('');
      setRole('member');
      onClose();
    }
  };

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
            className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Invite Team Member</h3>
              <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-muted/50 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
                <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="colleague@company.com"
                    className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Role</label>
                <div className="flex gap-2">
                  {['admin', 'member', 'viewer'].map((r) => (
                    <button
                      key={r}
                      onClick={() => setRole(r)}
                      className={cn(
                        'rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-colors',
                        role === r
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-muted-foreground hover:bg-muted/50',
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={onClose} className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/50">
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                Send Invite
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TeamManagementPanel({
  members,
  onInvite,
  onRemove,
  onRoleChange,
  className,
}: TeamManagementPanelProps) {
  const [query, setQuery] = React.useState('');
  const [showInvite, setShowInvite] = React.useState(false);
  const [menuOpenId, setMenuOpenId] = React.useState<string | null>(null);

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.email.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn('w-full rounded-xl border border-border bg-card shadow-sm', className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-5">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Team Members</h2>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {members.length}
          </span>
        </div>
        {onInvite && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowInvite(true)}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
          >
            <UserPlus className="h-4 w-4" />
            Invite
          </motion.button>
        )}
      </div>

      {/* Search */}
      <div className="border-b border-border px-5 py-3">
        <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search members..."
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Member list */}
      <div className="divide-y divide-border">
        <AnimatePresence>
          {filtered.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="flex items-center gap-3 px-5 py-3"
            >
              <div className="relative">
                <MemberAvatar member={member} />
                <div
                  className={cn(
                    'absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card',
                    statusColors[member.status],
                  )}
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{member.name}</p>
                <p className="truncate text-xs text-muted-foreground">{member.email}</p>
              </div>

              <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium capitalize', roleColors[member.role])}>
                {member.role}
              </span>

              {member.status === 'invited' && (
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400"
                >
                  Pending
                </motion.span>
              )}

              {member.role !== 'owner' && (onRoleChange || onRemove) && (
                <div className="relative">
                  <button
                    onClick={() => setMenuOpenId(menuOpenId === member.id ? null : member.id)}
                    className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted/50"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                  <AnimatePresence>
                    {menuOpenId === member.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full z-10 mt-1 w-40 overflow-hidden rounded-lg border border-border bg-card shadow-lg"
                      >
                        {onRoleChange && (
                          <>
                            {['admin', 'member', 'viewer'].filter((r) => r !== member.role).map((r) => (
                              <button
                                key={r}
                                onClick={() => { onRoleChange(member.id, r); setMenuOpenId(null); }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-xs text-foreground transition-colors hover:bg-muted/50"
                              >
                                <Shield className="h-3 w-3" />
                                Make {r}
                              </button>
                            ))}
                          </>
                        )}
                        {onRemove && (
                          <button
                            onClick={() => { onRemove(member.id); setMenuOpenId(null); }}
                            className="flex w-full items-center gap-2 border-t border-border px-3 py-2 text-xs text-destructive transition-colors hover:bg-destructive/10"
                          >
                            <Trash2 className="h-3 w-3" />
                            Remove
                          </button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No members found
          </div>
        )}
      </div>

      {/* Invite modal */}
      {onInvite && (
        <InviteModal
          open={showInvite}
          onClose={() => setShowInvite(false)}
          onInvite={onInvite}
        />
      )}
    </motion.div>
  );
}

TeamManagementPanel.displayName = 'TeamManagementPanel';
