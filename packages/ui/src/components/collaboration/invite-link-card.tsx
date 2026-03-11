'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Copy, Check, RefreshCw, Clock, Shield } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface InviteLinkCardProps {
  link: string;
  expiresAt: string;
  onCopy: () => void;
  onRegenerate: () => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const InviteLinkCard: React.FC<InviteLinkCardProps> = ({
  link,
  expiresAt,
  onCopy,
  onRegenerate,
  className,
}) => {
  const [copied, setCopied] = React.useState(false);
  const [regenerating, setRegenerating] = React.useState(false);

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    setRegenerating(true);
    onRegenerate();
    setTimeout(() => setRegenerating(false), 1000);
  };

  const expiryDate = new Date(expiresAt);
  const now = new Date();
  const diffMs = expiryDate.getTime() - now.getTime();
  const diffDays = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  const isExpiringSoon = diffDays <= 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={cn('rounded-xl border overflow-hidden', className)}
      style={{
        borderColor: 'hsl(var(--border))',
        backgroundColor: 'hsl(var(--card))',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-3 border-b"
        style={{ borderColor: 'hsl(var(--border))' }}
      >
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}
        >
          <Link2 className="h-4 w-4" style={{ color: 'hsl(var(--primary))' }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className="text-sm font-semibold"
            style={{ color: 'hsl(var(--foreground))' }}
          >
            Invite Link
          </h3>
          <p className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
            Share this link to invite collaborators
          </p>
        </div>
        <div
          className="flex items-center gap-1 rounded-full px-2 py-0.5"
          style={{
            backgroundColor: isExpiringSoon
              ? 'hsl(var(--destructive) / 0.1)'
              : 'hsl(var(--muted))',
          }}
        >
          <Shield
            className="h-3 w-3"
            style={{
              color: isExpiringSoon
                ? 'hsl(var(--destructive))'
                : 'hsl(var(--muted-foreground))',
            }}
          />
          <span
            className="text-xs font-medium"
            style={{
              color: isExpiringSoon
                ? 'hsl(var(--destructive))'
                : 'hsl(var(--muted-foreground))',
            }}
          >
            {isExpiringSoon ? 'Expiring soon' : 'Active'}
          </span>
        </div>
      </div>

      {/* Link display */}
      <div className="px-4 py-3">
        <div
          className="flex items-center gap-2 rounded-lg border px-3 py-2"
          style={{
            borderColor: 'hsl(var(--border))',
            backgroundColor: 'hsl(var(--muted) / 0.5)',
          }}
        >
          <code
            className="flex-1 truncate text-sm font-mono"
            style={{ color: 'hsl(var(--foreground))' }}
          >
            {link}
          </code>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors"
            style={{
              backgroundColor: copied
                ? 'hsl(142, 71%, 45% / 0.15)'
                : 'hsl(var(--primary) / 0.1)',
            }}
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 90 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <Check className="h-4 w-4" style={{ color: 'hsl(142, 71%, 45%)' }} />
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Copy className="h-4 w-4" style={{ color: 'hsl(var(--primary))' }} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between px-4 py-3 border-t"
        style={{
          borderColor: 'hsl(var(--border))',
          backgroundColor: 'hsl(var(--muted) / 0.3)',
        }}
      >
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" style={{ color: 'hsl(var(--muted-foreground))' }} />
          <span className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
            {diffDays > 0
              ? `Expires in ${diffDays} day${diffDays !== 1 ? 's' : ''}`
              : 'Expired'}
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleRegenerate}
          disabled={regenerating}
          className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-opacity disabled:opacity-50"
          style={{
            backgroundColor: 'hsl(var(--secondary))',
            color: 'hsl(var(--secondary-foreground))',
          }}
        >
          <motion.div
            animate={regenerating ? { rotate: 360 } : { rotate: 0 }}
            transition={regenerating ? { duration: 0.8, repeat: Infinity, ease: 'linear' } : {}}
          >
            <RefreshCw className="h-3 w-3" />
          </motion.div>
          Regenerate
        </motion.button>
      </div>
    </motion.div>
  );
};

InviteLinkCard.displayName = 'InviteLinkCard';
