'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2,
  CheckCircle2,
  X,
  Plus,
  Send,
  ChevronDown,
  Users,
  AlertCircle,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RoleOption {
  /** Display label */
  label: string;
  /** Value passed back in the invite payload */
  value: string;
}

export interface InviteEntry {
  email: string;
  role: string;
}

export interface TeamInviteFormProps {
  /** Callback fired with the list of invites */
  onInvite: (invites: InviteEntry[]) => void;
  /** Available roles for the dropdown */
  roles: RoleOption[];
  /** Maximum number of invites allowed */
  maxInvites?: number;
  /** Whether invites are currently being sent */
  loading?: boolean;
  /** Per-invite send status for sequential animation */
  sendStatus?: Record<string, 'sending' | 'sent' | 'error'>;
  /** Error message */
  error?: string;
  /** Additional class names */
  className?: string;
}

// ---------------------------------------------------------------------------
// Email validation
// ---------------------------------------------------------------------------

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---------------------------------------------------------------------------
// Invite row component
// ---------------------------------------------------------------------------

interface InviteRowProps {
  entry: InviteEntry;
  index: number;
  roles: RoleOption[];
  status?: 'sending' | 'sent' | 'error';
  onRemove: () => void;
  onChangeRole: (role: string) => void;
  disabled?: boolean;
}

function InviteRow({
  entry,
  index,
  roles,
  status,
  onRemove,
  onChangeRole,
  disabled,
}: InviteRowProps) {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const currentRoleLabel =
    roles.find((r) => r.value === entry.role)?.label ?? entry.role;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20, height: 0 }}
      animate={{ opacity: 1, x: 0, height: 'auto' }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="flex items-center gap-2"
    >
      {/* Email tag */}
      <div
        className={cn(
          'flex flex-1 items-center gap-2 rounded-lg border border-input bg-background px-3 py-2',
          status === 'error' && 'border-destructive',
          status === 'sent' && 'border-[var(--color-success,#22c55e)]/40',
        )}
      >
        <span className="flex-1 truncate text-sm text-foreground">
          {entry.email}
        </span>

        {/* Status indicator */}
        <AnimatePresence mode="wait">
          {status === 'sending' && (
            <motion.span
              key="sending"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            </motion.span>
          )}
          {status === 'sent' && (
            <motion.span
              key="sent"
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.175, 0.885, 0.32, 1.275] }}
            >
              <CheckCircle2 className="h-4 w-4 text-[var(--color-success,#22c55e)]" />
            </motion.span>
          )}
          {status === 'error' && (
            <motion.span
              key="error"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <AlertCircle className="h-4 w-4 text-destructive" />
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Role dropdown */}
      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setDropdownOpen((v) => !v)}
          className={cn(
            'flex h-10 items-center gap-1 rounded-lg border border-input bg-background px-3 text-sm text-foreground',
            'hover:bg-muted/50 transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          )}
        >
          {currentRoleLabel}
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>

        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full z-20 mt-1 min-w-[120px] overflow-hidden rounded-lg border border-border bg-card shadow-lg"
            >
              {roles.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => {
                    onChangeRole(role.value);
                    setDropdownOpen(false);
                  }}
                  className={cn(
                    'block w-full px-3 py-2 text-left text-sm transition-colors',
                    'hover:bg-muted/50',
                    role.value === entry.role
                      ? 'font-medium text-primary'
                      : 'text-foreground',
                  )}
                >
                  {role.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Remove button */}
      <motion.button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <X className="h-4 w-4" />
      </motion.button>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TeamInviteForm({
  onInvite,
  roles,
  maxInvites = 10,
  loading = false,
  sendStatus,
  error,
  className,
}: TeamInviteFormProps) {
  const [entries, setEntries] = React.useState<InviteEntry[]>([]);
  const [inputValue, setInputValue] = React.useState('');
  const [inputError, setInputError] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const defaultRole = roles[0]?.value ?? '';

  const addEmail = (email: string) => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return;

    if (!EMAIL_RE.test(trimmed)) {
      setInputError('Please enter a valid email address');
      return;
    }
    if (entries.some((e) => e.email === trimmed)) {
      setInputError('This email has already been added');
      return;
    }
    if (entries.length >= maxInvites) {
      setInputError(`Maximum of ${maxInvites} invites allowed`);
      return;
    }

    setInputError('');
    setEntries((prev) => [...prev, { email: trimmed, role: defaultRole }]);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addEmail(inputValue);
    } else if (
      e.key === 'Backspace' &&
      inputValue === '' &&
      entries.length > 0
    ) {
      setEntries((prev) => prev.slice(0, -1));
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text');
    const emails = text.split(/[,;\s\n]+/).filter(Boolean);
    emails.forEach((email) => addEmail(email));
  };

  const removeEntry = (index: number) => {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const changeRole = (index: number, role: string) => {
    setEntries((prev) =>
      prev.map((entry, i) => (i === index ? { ...entry, role } : entry)),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add any remaining input as email
    if (inputValue.trim()) {
      addEmail(inputValue);
    }
    if (entries.length > 0) {
      onInvite(entries);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'w-full max-w-lg rounded-2xl border border-border bg-card p-8 shadow-lg',
        className,
      )}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Invite your team
          </h2>
          <p className="text-sm text-muted-foreground">
            Add team members by email. You can invite up to {maxInvites} people.
          </p>
        </div>

        {/* Email input */}
        <div className="space-y-2">
          <label
            htmlFor="invite-email"
            className="text-sm font-medium text-foreground"
          >
            Email addresses
          </label>
          <div
            className={cn(
              'flex items-center rounded-lg border bg-background px-3 py-2',
              'transition-all duration-200',
              'focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20',
              inputError
                ? 'border-destructive focus-within:border-destructive focus-within:ring-destructive/20'
                : 'border-input',
            )}
            onClick={() => inputRef.current?.focus()}
          >
            <input
              ref={inputRef}
              id="invite-email"
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setInputError('');
              }}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              onBlur={() => {
                if (inputValue.trim()) addEmail(inputValue);
              }}
              placeholder={
                entries.length === 0
                  ? 'name@example.com'
                  : 'Add another email...'
              }
              disabled={loading || entries.length >= maxInvites}
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
            />
            <motion.button
              type="button"
              onClick={() => addEmail(inputValue)}
              disabled={!inputValue.trim() || loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="ml-2 flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
            </motion.button>
          </div>
          {inputError && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-destructive"
            >
              {inputError}
            </motion.p>
          )}
          <p className="text-xs text-muted-foreground">
            Press Enter or comma to add. Paste multiple emails separated by
            commas.
          </p>
        </div>

        {/* Invite entries list */}
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {entries.map((entry, i) => (
              <InviteRow
                key={entry.email}
                entry={entry}
                index={i}
                roles={roles}
                status={sendStatus?.[entry.email]}
                onRemove={() => removeEntry(i)}
                onChangeRole={(role) => changeRole(i, role)}
                disabled={loading}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Count */}
        {entries.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-muted-foreground"
          >
            {entries.length} / {maxInvites} invites
          </motion.p>
        )}

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 text-sm text-destructive"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={loading || entries.length === 0}
          whileHover={{ scale: loading ? 1 : 1.01 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className={cn(
            'flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary font-medium text-primary-foreground',
            'transition-opacity duration-200',
            'disabled:opacity-70 disabled:cursor-not-allowed',
          )}
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.span
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending invites...
              </motion.span>
            ) : (
              <motion.span
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                Send {entries.length > 0 ? entries.length : ''} Invite
                {entries.length !== 1 ? 's' : ''}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </form>
    </motion.div>
  );
}
