'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Reply, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  replies?: Comment[];
}

export interface CommentThreadProps {
  comments: Comment[];
  onReply: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const CommentItem: React.FC<{
  comment: Comment;
  depth: number;
  onReply: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
  index: number;
}> = ({ comment, depth, onReply, onDelete, index }) => {
  const [isReplying, setIsReplying] = React.useState(false);
  const [replyText, setReplyText] = React.useState('');
  const [collapsed, setCollapsed] = React.useState(false);

  const handleSubmitReply = () => {
    if (replyText.trim()) {
      onReply(comment.id, replyText.trim());
      setReplyText('');
      setIsReplying(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ delay: index * 0.05, duration: 0.25 }}
      className={cn('relative', depth > 0 && 'ml-6 pl-4')}
      style={depth > 0 ? { borderLeft: '2px solid hsl(var(--border))' } : undefined}
    >
      <div
        className={cn(
          'rounded-lg p-3',
          depth === 0 ? 'mb-2' : 'mb-1',
        )}
        style={{ backgroundColor: depth === 0 ? 'hsl(var(--card))' : 'hsl(var(--muted))' }}
      >
        <div className="flex items-center gap-2 mb-1">
          <div
            className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-medium"
            style={{
              backgroundColor: 'hsl(var(--primary))',
              color: 'hsl(var(--primary-foreground))',
            }}
          >
            {comment.avatar}
          </div>
          <span className="text-sm font-semibold" style={{ color: 'hsl(var(--foreground))' }}>
            {comment.author}
          </span>
          <span className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
            {comment.timestamp}
          </span>
        </div>

        <p className="text-sm ml-9" style={{ color: 'hsl(var(--foreground))' }}>
          {comment.content}
        </p>

        <div className="flex items-center gap-3 mt-2 ml-9">
          <button
            onClick={() => setIsReplying(!isReplying)}
            className="flex items-center gap-1 text-xs hover:opacity-80 transition-opacity"
            style={{ color: 'hsl(var(--primary))' }}
          >
            <Reply className="h-3 w-3" />
            Reply
          </button>
          <button
            onClick={() => onDelete(comment.id)}
            className="flex items-center gap-1 text-xs hover:opacity-80 transition-opacity"
            style={{ color: 'hsl(var(--destructive))' }}
          >
            <Trash2 className="h-3 w-3" />
            Delete
          </button>
          {comment.replies && comment.replies.length > 0 && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="flex items-center gap-1 text-xs hover:opacity-80 transition-opacity"
              style={{ color: 'hsl(var(--muted-foreground))' }}
            >
              {collapsed ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
              {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isReplying && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="ml-9 mb-2 overflow-hidden"
          >
            <div className="flex gap-2 mt-1">
              <input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmitReply()}
                placeholder="Write a reply..."
                className="flex-1 rounded-md border px-3 py-1.5 text-sm outline-none"
                style={{
                  borderColor: 'hsl(var(--border))',
                  backgroundColor: 'hsl(var(--background))',
                  color: 'hsl(var(--foreground))',
                }}
              />
              <button
                onClick={handleSubmitReply}
                className="rounded-md px-3 py-1.5 text-xs font-medium"
                style={{
                  backgroundColor: 'hsl(var(--primary))',
                  color: 'hsl(var(--primary-foreground))',
                }}
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!collapsed && comment.replies && comment.replies.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {comment.replies.map((reply, i) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                depth={depth + 1}
                onReply={onReply}
                onDelete={onDelete}
                index={i}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const CommentThread: React.FC<CommentThreadProps> = ({
  comments,
  onReply,
  onDelete,
  className,
}) => {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="h-4 w-4" style={{ color: 'hsl(var(--primary))' }} />
        <span className="text-sm font-semibold" style={{ color: 'hsl(var(--foreground))' }}>
          {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
        </span>
      </div>
      <AnimatePresence>
        {comments.map((comment, index) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            depth={0}
            onReply={onReply}
            onDelete={onDelete}
            index={index}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

CommentThread.displayName = 'CommentThread';
