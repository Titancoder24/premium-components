'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'card' | 'table-row';

export interface SkeletonLoaderProps {
  variant?: SkeletonVariant;
  lines?: number;
  width?: string | number;
  height?: string | number;
  className?: string;
}

// ---------------------------------------------------------------------------
// Shimmer keyframes (injected once)
// ---------------------------------------------------------------------------

const SHIMMER_STYLE_ID = 'pui-skeleton-shimmer';

function ensureShimmerStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(SHIMMER_STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = SHIMMER_STYLE_ID;
  style.textContent = `
    @keyframes pui-shimmer {
      0% { background-position: -400px 0; }
      100% { background-position: 400px 0; }
    }
  `;
  document.head.appendChild(style);
}

// ---------------------------------------------------------------------------
// Base shimmer block
// ---------------------------------------------------------------------------

interface ShimmerBlockProps {
  className?: string;
  style?: React.CSSProperties;
}

function ShimmerBlock({ className, style }: ShimmerBlockProps) {
  React.useEffect(() => {
    ensureShimmerStyles();
  }, []);

  return (
    <div
      aria-hidden
      className={cn('rounded', className)}
      style={{
        background:
          'linear-gradient(90deg, var(--color-muted,#f3f4f6) 25%, var(--color-border,#e5e7eb) 50%, var(--color-muted,#f3f4f6) 75%)',
        backgroundSize: '800px 100%',
        animation: 'pui-shimmer 1.5s infinite linear',
        ...style,
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SkeletonLoader({
  variant = 'text',
  lines = 3,
  width,
  height,
  className,
}: SkeletonLoaderProps) {
  const resolvedWidth = typeof width === 'number' ? `${width}px` : width;
  const resolvedHeight = typeof height === 'number' ? `${height}px` : height;

  if (variant === 'circular') {
    const size = resolvedWidth ?? resolvedHeight ?? '48px';
    return (
      <ShimmerBlock
        className={cn('rounded-full', className)}
        style={{ width: size, height: size }}
      />
    );
  }

  if (variant === 'rectangular') {
    return (
      <ShimmerBlock
        className={cn('rounded-md', className)}
        style={{
          width: resolvedWidth ?? '100%',
          height: resolvedHeight ?? '120px',
        }}
      />
    );
  }

  if (variant === 'card') {
    return (
      <div
        className={cn(
          'overflow-hidden rounded-xl border border-[var(--color-border,#e5e7eb)]',
          className,
        )}
        style={{ width: resolvedWidth ?? '100%' }}
      >
        <ShimmerBlock style={{ width: '100%', height: resolvedHeight ?? '160px' }} />
        <div className="space-y-2 p-4">
          <ShimmerBlock className="rounded" style={{ width: '60%', height: '16px' }} />
          <ShimmerBlock className="rounded" style={{ width: '100%', height: '12px' }} />
          <ShimmerBlock className="rounded" style={{ width: '80%', height: '12px' }} />
        </div>
      </div>
    );
  }

  if (variant === 'table-row') {
    return (
      <div className={cn('flex items-center gap-4', className)}>
        <ShimmerBlock
          className="rounded"
          style={{ width: '40px', height: '40px', flexShrink: 0 }}
        />
        <div className="flex-1 space-y-2">
          <ShimmerBlock className="rounded" style={{ width: '30%', height: '14px' }} />
          <ShimmerBlock className="rounded" style={{ width: '60%', height: '12px' }} />
        </div>
        <ShimmerBlock
          className="rounded"
          style={{ width: '80px', height: '14px', flexShrink: 0 }}
        />
      </div>
    );
  }

  // variant === 'text'
  return (
    <div
      className={cn('space-y-2', className)}
      style={{ width: resolvedWidth ?? '100%' }}
    >
      {Array.from({ length: lines }).map((_, i) => (
        <ShimmerBlock
          key={i}
          className="rounded"
          style={{
            width: i === lines - 1 ? '75%' : '100%',
            height: resolvedHeight ?? '14px',
          }}
        />
      ))}
    </div>
  );
}
