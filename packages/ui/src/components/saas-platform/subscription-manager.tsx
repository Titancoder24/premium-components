'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  X,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PlanFeature {
  label: string;
  included: boolean;
}

export interface Plan {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  features: PlanFeature[];
  trialDaysRemaining?: number;
  description?: string;
}

export interface SubscriptionManagerProps {
  plans: Plan[];
  currentPlanId: string;
  onChangePlan: (planId: string) => void;
  onCancel?: () => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Confirmation Modal
// ---------------------------------------------------------------------------

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  variant?: 'default' | 'destructive';
  onConfirm: () => void;
  onClose: () => void;
}

function ConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  variant = 'default',
  onConfirm,
  onClose,
}: ConfirmModalProps) {
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
                className={cn(
                  'flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-colors',
                  variant === 'destructive'
                    ? 'bg-destructive text-destructive-foreground'
                    : 'bg-primary text-primary-foreground',
                )}
              >
                {confirmLabel}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// SubscriptionManager
// ---------------------------------------------------------------------------

export function SubscriptionManager({
  plans,
  currentPlanId,
  onChangePlan,
  onCancel,
  className,
}: SubscriptionManagerProps) {
  const [billingCycle, setBillingCycle] = React.useState<'monthly' | 'annual'>(
    'monthly',
  );
  const [confirmTarget, setConfirmTarget] = React.useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = React.useState(false);

  const currentIndex = plans.findIndex((p) => p.id === currentPlanId);
  const targetPlan = plans.find((p) => p.id === confirmTarget);
  const targetIndex = confirmTarget
    ? plans.findIndex((p) => p.id === confirmTarget)
    : -1;
  const isUpgrade = targetIndex > currentIndex;

  return (
    <div className={cn('w-full', className)}>
      {/* Billing cycle toggle */}
      <div className="mb-8 flex items-center justify-center gap-3">
        <span
          className={cn(
            'text-sm font-medium transition-colors',
            billingCycle === 'monthly'
              ? 'text-foreground'
              : 'text-muted-foreground',
          )}
        >
          Monthly
        </span>
        <button
          onClick={() =>
            setBillingCycle((c) => (c === 'monthly' ? 'annual' : 'monthly'))
          }
          className="relative h-7 w-12 rounded-full bg-muted transition-colors"
        >
          <motion.div
            layout
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={cn(
              'absolute top-1 h-5 w-5 rounded-full bg-primary shadow-sm',
              billingCycle === 'annual' ? 'left-6' : 'left-1',
            )}
          />
        </button>
        <span
          className={cn(
            'text-sm font-medium transition-colors',
            billingCycle === 'annual'
              ? 'text-foreground'
              : 'text-muted-foreground',
          )}
        >
          Annual
        </span>
        <AnimatePresence>
          {billingCycle === 'annual' && (
            <motion.span
              initial={{ opacity: 0, scale: 0.7, x: -8 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.7, x: -8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
            >
              Save 20%
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Plan cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan, index) => {
          const isCurrent = plan.id === currentPlanId;
          const price =
            billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
          const planIndex = index;
          const actionLabel =
            planIndex > currentIndex
              ? 'Upgrade'
              : planIndex < currentIndex
                ? 'Downgrade'
                : undefined;

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: isCurrent ? 1.03 : 1,
              }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                scale: { type: 'spring', stiffness: 300, damping: 20 },
              }}
              className={cn(
                'relative flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition-shadow',
                isCurrent
                  ? 'border-primary/50 shadow-lg'
                  : 'border-border hover:shadow-md',
              )}
            >
              {/* Animated border glow for current plan */}
              {isCurrent && (
                <motion.div
                  className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-primary/40"
                  animate={{
                    boxShadow: [
                      '0 0 0 0 hsl(var(--primary) / 0)',
                      '0 0 16px 4px hsl(var(--primary) / 0.15)',
                      '0 0 0 0 hsl(var(--primary) / 0)',
                    ],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              )}

              {/* Trial badge */}
              <AnimatePresence>
                {plan.trialDaysRemaining != null &&
                  plan.trialDaysRemaining > 0 &&
                  isCurrent && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="mb-3 flex items-center gap-1.5"
                    >
                      <motion.span
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400"
                      >
                        <Clock className="h-3 w-3" />
                        {plan.trialDaysRemaining} days left in trial
                      </motion.span>
                    </motion.div>
                  )}
              </AnimatePresence>

              {/* Plan name & current badge */}
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-foreground">
                  {plan.name}
                </h3>
                {isCurrent && (
                  <motion.span
                    layoutId="current-badge"
                    className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                  >
                    Current
                  </motion.span>
                )}
              </div>

              {plan.description && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {plan.description}
                </p>
              )}

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-1">
                <motion.span
                  key={`${plan.id}-${billingCycle}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-3xl font-bold tracking-tight text-foreground"
                >
                  ${price}
                </motion.span>
                <span className="text-sm text-muted-foreground">
                  /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                </span>
              </div>

              {/* Features */}
              <ul className="mt-6 flex-1 space-y-2.5">
                {plan.features.map((feature, fi) => (
                  <motion.li
                    key={feature.label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + fi * 0.05 }}
                    className="flex items-start gap-2 text-sm"
                  >
                    {feature.included ? (
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    ) : (
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/40" />
                    )}
                    <span
                      className={cn(
                        'text-foreground',
                        !feature.included &&
                          'text-muted-foreground line-through',
                      )}
                    >
                      {feature.label}
                    </span>
                  </motion.li>
                ))}
              </ul>

              {/* Action */}
              <div className="mt-6">
                {isCurrent ? (
                  onCancel ? (
                    <button
                      onClick={() => setShowCancelConfirm(true)}
                      className="w-full rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
                    >
                      Cancel Subscription
                    </button>
                  ) : null
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setConfirmTarget(plan.id)}
                    className={cn(
                      'flex w-full items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors',
                      planIndex > currentIndex
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80',
                    )}
                  >
                    {planIndex > currentIndex ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                    {actionLabel}
                  </motion.button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Change plan confirmation */}
      <ConfirmModal
        open={confirmTarget !== null}
        title={isUpgrade ? 'Upgrade Plan' : 'Downgrade Plan'}
        description={
          targetPlan
            ? `Are you sure you want to ${isUpgrade ? 'upgrade' : 'downgrade'} to the ${targetPlan.name} plan?`
            : ''
        }
        confirmLabel={isUpgrade ? 'Confirm Upgrade' : 'Confirm Downgrade'}
        onConfirm={() => {
          if (confirmTarget) onChangePlan(confirmTarget);
          setConfirmTarget(null);
        }}
        onClose={() => setConfirmTarget(null)}
      />

      {/* Cancel confirmation */}
      <ConfirmModal
        open={showCancelConfirm}
        title="Cancel Subscription"
        description="Are you sure you want to cancel? You will lose access to premium features at the end of your billing period."
        confirmLabel="Yes, Cancel"
        variant="destructive"
        onConfirm={() => {
          onCancel?.();
          setShowCancelConfirm(false);
        }}
        onClose={() => setShowCancelConfirm(false)}
      />
    </div>
  );
}

SubscriptionManager.displayName = 'SubscriptionManager';
