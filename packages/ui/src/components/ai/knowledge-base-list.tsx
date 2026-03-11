'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  FileImage,
  FileCode,
  File,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Trash2,
  Upload,
  FileArchive,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type KBFileStatus = 'processing' | 'ready' | 'error';

export interface KBFile {
  name: string;
  type: string;
  size: number;
  status: KBFileStatus;
  uploadDate: string;
}

export interface KnowledgeBaseListProps {
  files: KBFile[];
  onUpload?: () => void;
  onDelete?: (fileName: string) => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function getFileIcon(type: string) {
  const t = type.toLowerCase();
  if (t.includes('image') || t.includes('png') || t.includes('jpg') || t.includes('jpeg') || t.includes('svg')) {
    return <FileImage className="h-4 w-4" />;
  }
  if (t.includes('code') || t.includes('json') || t.includes('xml') || t.includes('html') || t.includes('css') || t.includes('js') || t.includes('ts')) {
    return <FileCode className="h-4 w-4" />;
  }
  if (t.includes('zip') || t.includes('tar') || t.includes('gz') || t.includes('rar')) {
    return <FileArchive className="h-4 w-4" />;
  }
  if (t.includes('pdf') || t.includes('doc') || t.includes('txt') || t.includes('md')) {
    return <FileText className="h-4 w-4" />;
  }
  return <File className="h-4 w-4" />;
}

const statusConfig: Record<
  KBFileStatus,
  { icon: React.ReactNode; label: string; color: string }
> = {
  processing: {
    icon: <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-500" />,
    label: 'Processing',
    color: 'text-blue-500',
  },
  ready: {
    icon: null, // rendered separately with animation
    label: 'Ready',
    color: 'text-emerald-500',
  },
  error: {
    icon: <AlertCircle className="h-3.5 w-3.5 text-red-500" />,
    label: 'Error',
    color: 'text-red-500',
  },
};

// ---------------------------------------------------------------------------
// KnowledgeBaseList
// ---------------------------------------------------------------------------

export const KnowledgeBaseList: React.FC<KnowledgeBaseListProps> = ({
  files,
  onUpload,
  onDelete,
  className,
}) => {
  return (
    <div
      className={cn(
        'rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[hsl(var(--border))] px-5 py-3.5">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          <span className="text-sm font-semibold text-[hsl(var(--foreground))]">
            Knowledge Base
          </span>
          <span className="rounded-full bg-[hsl(var(--muted))] px-2 py-0.5 text-[11px] text-[hsl(var(--muted-foreground))]">
            {files.length} file{files.length !== 1 ? 's' : ''}
          </span>
        </div>
        {onUpload && (
          <button
            onClick={onUpload}
            className="flex h-8 items-center gap-1.5 rounded-lg bg-[hsl(var(--primary))] px-3 text-xs font-medium text-[hsl(var(--primary-foreground))] transition-colors hover:opacity-90"
          >
            <Upload className="h-3.5 w-3.5" />
            Upload
          </button>
        )}
      </div>

      {/* File list */}
      <div className="divide-y divide-[hsl(var(--border))]">
        <AnimatePresence initial={false}>
          {files.map((file) => {
            const sc = statusConfig[file.status];
            return (
              <motion.div
                key={file.name}
                layout
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="overflow-hidden"
              >
                <div className="group flex items-center gap-3 px-5 py-3">
                  {/* File icon */}
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">
                    {getFileIcon(file.type)}
                  </div>

                  {/* File info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-[hsl(var(--foreground))]">
                        {file.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[hsl(var(--muted-foreground))]">
                      <span>{formatBytes(file.size)}</span>
                      <span className="opacity-40">|</span>
                      <span>{file.uploadDate}</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className={cn('flex items-center gap-1.5 text-xs font-medium', sc.color)}>
                    {file.status === 'ready' ? (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                        className="inline-flex"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      </motion.span>
                    ) : (
                      sc.icon
                    )}
                    <span>{sc.label}</span>
                  </div>

                  {/* Delete */}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(file.name)}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[hsl(var(--muted-foreground))] opacity-0 transition-all hover:bg-red-500/10 hover:text-red-500 group-hover:opacity-100"
                      aria-label={`Delete ${file.name}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {files.length === 0 && (
        <div className="flex flex-col items-center gap-2 px-5 py-10 text-center">
          <FileText className="h-8 w-8 text-[hsl(var(--muted-foreground))]" />
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            No files in knowledge base
          </p>
          {onUpload && (
            <button
              onClick={onUpload}
              className="mt-1 text-sm font-medium text-[hsl(var(--primary))] transition-colors hover:underline"
            >
              Upload your first file
            </button>
          )}
        </div>
      )}
    </div>
  );
};

KnowledgeBaseList.displayName = 'KnowledgeBaseList';
