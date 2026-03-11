'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, RefreshCw, ThumbsUp, ThumbsDown, Bot, User } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ChatBubbleRole = 'user' | 'assistant';

export type ChatBubbleStatus = 'sent' | 'delivered' | 'read';

export interface ChatBubbleAction {
  type: 'copy' | 'regenerate' | 'thumbsUp' | 'thumbsDown';
  onClick: () => void;
}

export interface ChatBubbleProps {
  role: ChatBubbleRole;
  content: string;
  timestamp?: string;
  status?: ChatBubbleStatus;
  actions?: ChatBubbleAction[];
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const actionIcons: Record<ChatBubbleAction['type'], React.ReactNode> = {
  copy: <Copy className="h-3.5 w-3.5" />,
  regenerate: <RefreshCw className="h-3.5 w-3.5" />,
  thumbsUp: <ThumbsUp className="h-3.5 w-3.5" />,
  thumbsDown: <ThumbsDown className="h-3.5 w-3.5" />,
};

const statusLabels: Record<ChatBubbleStatus, string> = {
  sent: 'Sent',
  delivered: 'Delivered',
  read: 'Read',
};

// ---------------------------------------------------------------------------
// ChatBubble
// ---------------------------------------------------------------------------

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  role,
  content,
  timestamp,
  status,
  actions,
  className,
}) => {
  const [copiedId, setCopiedId] = React.useState<number | null>(null);
  const isUser = role === 'user';

  const handleAction = (action: ChatBubbleAction, index: number) => {
    action.onClick();
    if (action.type === 'copy') {
      setCopiedId(index);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={cn(
        'group flex gap-2.5',
        isUser ? 'flex-row-reverse' : 'flex-row',
        className,
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          isUser
            ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
            : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]',
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      {/* Bubble */}
      <div className={cn('flex max-w-[75%] flex-col gap-1', isUser ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
            isUser
              ? 'rounded-tr-sm bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
              : 'rounded-tl-sm bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]',
          )}
        >
          <p className="whitespace-pre-wrap">{content}</p>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-2 px-1">
          {timestamp && (
            <span className="text-[11px] text-[hsl(var(--muted-foreground))]">{timestamp}</span>
          )}
          {status && isUser && (
            <span className="text-[11px] text-[hsl(var(--muted-foreground))]">
              {statusLabels[status]}
            </span>
          )}
        </div>

        {/* Actions */}
        {actions && actions.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          >
            {actions.map((action, i) => (
              <button
                key={action.type}
                onClick={() => handleAction(action, i)}
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-md text-[hsl(var(--muted-foreground))]',
                  'transition-colors hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]',
                )}
                aria-label={action.type}
              >
                <AnimatePresence mode="wait">
                  {action.type === 'copy' && copiedId === i ? (
                    <motion.span
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="icon"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {actionIcons[action.type]}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

ChatBubble.displayName = 'ChatBubble';
