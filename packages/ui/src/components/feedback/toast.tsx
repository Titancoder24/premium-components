'use client';

import * as React from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastData {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: ToastAction;
}

export type ToastProps = Omit<ToastData, 'id'>;

export interface UseToastReturn {
  toast: (props: ToastProps) => string;
  toasts: ToastData[];
  dismiss: (id: string) => void;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface ToastContextValue extends UseToastReturn {}

const ToastContext = React.createContext<ToastContextValue | null>(null);

// ---------------------------------------------------------------------------
// useToast hook
// ---------------------------------------------------------------------------

export function useToast(): UseToastReturn {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a <ToastProvider>');
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// Variant config
// ---------------------------------------------------------------------------

const variantConfig: Record<
  ToastVariant,
  { icon: React.ElementType; containerClass: string; progressClass: string }
> = {
  success: {
    icon: CheckCircle2,
    containerClass:
      'border-[var(--color-success,#22c55e)]/30 bg-[var(--color-success-bg,#f0fdf4)]',
    progressClass: 'bg-[var(--color-success,#22c55e)]',
  },
  error: {
    icon: XCircle,
    containerClass:
      'border-[var(--color-error,#ef4444)]/30 bg-[var(--color-error-bg,#fef2f2)]',
    progressClass: 'bg-[var(--color-error,#ef4444)]',
  },
  warning: {
    icon: AlertTriangle,
    containerClass:
      'border-[var(--color-warning,#f59e0b)]/30 bg-[var(--color-warning-bg,#fffbeb)]',
    progressClass: 'bg-[var(--color-warning,#f59e0b)]',
  },
  info: {
    icon: Info,
    containerClass:
      'border-[var(--color-info,#3b82f6)]/30 bg-[var(--color-info-bg,#eff6ff)]',
    progressClass: 'bg-[var(--color-info,#3b82f6)]',
  },
};

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const toastVariants: Variants = {
  initial: { opacity: 0, x: 80, scale: 0.95 },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
  exit: {
    opacity: 0,
    x: 120,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
  },
};

// ---------------------------------------------------------------------------
// Single Toast item
// ---------------------------------------------------------------------------

interface ToastItemProps {
  data: ToastData;
  onDismiss: (id: string) => void;
}

function ToastItem({ data, onDismiss }: ToastItemProps) {
  const { id, title, description, variant = 'info', duration = 5000, action } = data;
  const config = variantConfig[variant];
  const Icon = config.icon;

  const [progress, setProgress] = React.useState(100);
  const [paused, setPaused] = React.useState(false);
  const startRef = React.useRef(Date.now());
  const remainingRef = React.useRef(duration);

  React.useEffect(() => {
    if (paused) return;

    startRef.current = Date.now();
    const totalRemaining = remainingRef.current;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.max(0, ((totalRemaining - elapsed) / duration) * 100);
      setProgress(pct);
      if (pct <= 0) {
        clearInterval(interval);
        onDismiss(id);
      }
    }, 16);

    return () => {
      remainingRef.current = Math.max(
        0,
        totalRemaining - (Date.now() - startRef.current),
      );
      clearInterval(interval);
    };
  }, [paused, id, duration, onDismiss]);

  return (
    <motion.div
      layout
      variants={toastVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={cn(
        'pointer-events-auto relative w-80 overflow-hidden rounded-lg border shadow-lg',
        config.containerClass,
      )}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start gap-3 p-4">
        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-current opacity-70" />
        <div className="flex-1 space-y-1">
          <p className="text-sm font-semibold text-[var(--color-foreground,#111827)]">
            {title}
          </p>
          {description && (
            <p className="text-xs text-[var(--color-muted-foreground,#6b7280)]">
              {description}
            </p>
          )}
          {action && (
            <button
              type="button"
              onClick={action.onClick}
              className="mt-1 text-xs font-medium underline underline-offset-2 hover:opacity-80"
            >
              {action.label}
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => onDismiss(id)}
          className="shrink-0 rounded p-0.5 hover:bg-black/5"
          aria-label="Dismiss toast"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full bg-black/5">
        <motion.div
          className={cn('h-full origin-left', config.progressClass)}
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.05 }}
        />
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// ToastProvider
// ---------------------------------------------------------------------------

export interface ToastProviderProps {
  children: React.ReactNode;
}

let globalId = 0;

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<ToastData[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback((props: ToastProps): string => {
    globalId += 1;
    const id = `toast-${globalId}`;
    const entry: ToastData = { id, ...props };
    setToasts((prev) => [entry, ...prev]);
    return id;
  }, []);

  const value = React.useMemo<ToastContextValue>(
    () => ({ toast, toasts, dismiss }),
    [toast, toasts, dismiss],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-label="Notifications"
        className="pointer-events-none fixed inset-0 z-[9999] flex flex-col items-end gap-3 p-4 pt-6"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <ToastItem key={t.id} data={t} onDismiss={dismiss} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Standalone Toast (display only, used internally)
// ---------------------------------------------------------------------------

export const Toast = ToastItem;
