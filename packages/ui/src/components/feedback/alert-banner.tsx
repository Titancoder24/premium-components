'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AlertBannerVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertBannerAction {
  label: string;
  onClick: () => void;
}

export interface AlertBannerProps {
  title?: string;
  description?: string;
  variant?: AlertBannerVariant;
  dismissible?: boolean;
  action?: AlertBannerAction;
  className?: string;
}

// ---------------------------------------------------------------------------
// Variant config
// ---------------------------------------------------------------------------

const variantConfig: Record<
  AlertBannerVariant,
  { icon: React.ElementType; containerClass: string; iconClass: string }
> = {
  info: {
    icon: Info,
    containerClass:
      'border-[var(--color-info,#3b82f6)]/30 bg-[var(--color-info-bg,#eff6ff)]',
    iconClass: 'text-[var(--color-info,#3b82f6)]',
  },
  success: {
    icon: CheckCircle2,
    containerClass:
      'border-[var(--color-success,#22c55e)]/30 bg-[var(--color-success-bg,#f0fdf4)]',
    iconClass: 'text-[var(--color-success,#22c55e)]',
  },
  warning: {
    icon: AlertTriangle,
    containerClass:
      'border-[var(--color-warning,#f59e0b)]/30 bg-[var(--color-warning-bg,#fffbeb)]',
    iconClass: 'text-[var(--color-warning,#f59e0b)]',
  },
  error: {
    icon: XCircle,
    containerClass:
      'border-[var(--color-error,#ef4444)]/30 bg-[var(--color-error-bg,#fef2f2)]',
    iconClass: 'text-[var(--color-error,#ef4444)]',
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AlertBanner({
  title,
  description,
  variant = 'info',
  dismissible = false,
  action,
  className,
}: AlertBannerProps) {
  const [visible, setVisible] = React.useState(true);
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="alert"
          initial={{ opacity: 0, height: 0, y: -8 }}
          animate={{
            opacity: 1,
            height: 'auto',
            y: 0,
            transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
          }}
          exit={{
            opacity: 0,
            height: 0,
            y: -8,
            transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
          }}
          className={cn(
            'overflow-hidden rounded-lg border',
            config.containerClass,
            className,
          )}
        >
          <div className="flex items-start gap-3 p-4">
            <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', config.iconClass)} />

            <div className="flex-1 space-y-1">
              {title && (
                <p className="text-sm font-semibold text-[var(--color-foreground,#111827)]">
                  {title}
                </p>
              )}
              {description && (
                <p className="text-sm text-[var(--color-muted-foreground,#6b7280)]">
                  {description}
                </p>
              )}
              {action && (
                <button
                  type="button"
                  onClick={action.onClick}
                  className="mt-1 text-sm font-medium underline underline-offset-2 hover:opacity-80"
                >
                  {action.label}
                </button>
              )}
            </div>

            {dismissible && (
              <button
                type="button"
                onClick={() => setVisible(false)}
                className="shrink-0 rounded-md p-1 hover:bg-black/5"
                aria-label="Dismiss alert"
              >
                <X className="h-4 w-4 text-[var(--color-muted-foreground,#6b7280)]" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
