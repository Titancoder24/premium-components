'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Wrench,
  Clock,
  ChevronDown,
  RefreshCw,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ServiceStatusType = 'operational' | 'degraded' | 'outage' | 'maintenance';

export interface ServiceStatus {
  id: string;
  name: string;
  status: ServiceStatusType;
  uptime: number;
  description?: string;
  lastChecked: string;
  details?: string;
}

export interface Incident {
  id: string;
  serviceId: string;
  title: string;
  status: ServiceStatusType;
  createdAt: string;
  resolvedAt?: string;
  message: string;
}

export interface SystemStatusDashboardProps {
  services: ServiceStatus[];
  incidents?: Incident[];
  className?: string;
}

// ---------------------------------------------------------------------------
// Status config
// ---------------------------------------------------------------------------

const statusConfig: Record<
  ServiceStatusType,
  { icon: React.ElementType; color: string; bg: string; label: string; pulse: boolean }
> = {
  operational: {
    icon: CheckCircle2,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500',
    label: 'Operational',
    pulse: false,
  },
  degraded: {
    icon: AlertTriangle,
    color: 'text-amber-500',
    bg: 'bg-amber-500',
    label: 'Degraded',
    pulse: true,
  },
  outage: {
    icon: XCircle,
    color: 'text-red-500',
    bg: 'bg-red-500',
    label: 'Outage',
    pulse: true,
  },
  maintenance: {
    icon: Wrench,
    color: 'text-blue-500',
    bg: 'bg-blue-500',
    label: 'Maintenance',
    pulse: false,
  },
};

// ---------------------------------------------------------------------------
// Animated uptime counter
// ---------------------------------------------------------------------------

function useAnimatedNumber(target: number, duration = 800): number {
  const [display, setDisplay] = React.useState(0);
  const rafRef = React.useRef<number>();

  React.useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(target * eased);
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return display;
}

// ---------------------------------------------------------------------------
// Service card
// ---------------------------------------------------------------------------

interface ServiceCardProps {
  service: ServiceStatus;
}

function ServiceCard({ service }: ServiceCardProps) {
  const [expanded, setExpanded] = React.useState(false);
  const config = statusConfig[service.status];
  const Icon = config.icon;
  const animatedUptime = useAnimatedNumber(service.uptime);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'cursor-pointer rounded-lg border border-border bg-card p-4 transition-colors',
        'hover:border-border/80 dark:bg-card',
      )}
      onClick={() => setExpanded((v) => !v)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span
              className={cn(
                'absolute inline-flex h-full w-full rounded-full opacity-75',
                config.bg,
                config.pulse && 'animate-ping',
              )}
            />
            <span className={cn('relative inline-flex h-3 w-3 rounded-full', config.bg)} />
          </span>
          <span className="text-sm font-medium text-foreground">{service.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={cn('text-xs font-medium', config.color)}>{config.label}</span>
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </motion.span>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Uptime: {animatedUptime.toFixed(2)}%
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {service.lastChecked}
        </span>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-3 border-t border-border pt-3">
              {service.description && (
                <p className="text-xs text-muted-foreground">{service.description}</p>
              )}
              {service.details && (
                <p className="mt-1 text-xs text-muted-foreground">{service.details}</p>
              )}
              <div className="mt-2 flex items-center gap-1">
                <Icon className={cn('h-3.5 w-3.5', config.color)} />
                <span className={cn('text-xs font-medium', config.color)}>
                  {config.label}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Overall banner
// ---------------------------------------------------------------------------

function getOverallStatus(services: ServiceStatus[]): ServiceStatusType {
  if (services.some((s) => s.status === 'outage')) return 'outage';
  if (services.some((s) => s.status === 'degraded')) return 'degraded';
  if (services.some((s) => s.status === 'maintenance')) return 'maintenance';
  return 'operational';
}

const bannerMessages: Record<ServiceStatusType, string> = {
  operational: 'All systems operational',
  degraded: 'Some systems are experiencing degraded performance',
  outage: 'Major outage detected',
  maintenance: 'Scheduled maintenance in progress',
};

// ---------------------------------------------------------------------------
// SystemStatusDashboard
// ---------------------------------------------------------------------------

export const SystemStatusDashboard: React.FC<SystemStatusDashboardProps> = ({
  services,
  incidents = [],
  className,
}) => {
  const overall = getOverallStatus(services);
  const overallConfig = statusConfig[overall];
  const OverallIcon = overallConfig.icon;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Overall banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={cn(
          'flex items-center gap-3 rounded-lg border border-border p-4',
          'bg-card dark:bg-card',
        )}
      >
        <OverallIcon className={cn('h-5 w-5', overallConfig.color)} />
        <span className="text-sm font-semibold text-foreground">
          {bannerMessages[overall]}
        </span>
        <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
          <RefreshCw className="h-3 w-3" /> Just now
        </span>
      </motion.div>

      {/* Service grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      {/* Incident history */}
      {incidents.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Incident History (Last 7 Days)</h3>
          <div className="space-y-2">
            {incidents.map((incident, i) => {
              const incidentConfig = statusConfig[incident.status];
              const IncidentIcon = incidentConfig.icon;
              return (
                <motion.div
                  key={incident.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="flex items-start gap-3 rounded-lg border border-border bg-card p-3 dark:bg-card"
                >
                  <div className="mt-0.5">
                    <IncidentIcon className={cn('h-4 w-4', incidentConfig.color)} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{incident.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{incident.message}</p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{incident.createdAt}</span>
                      {incident.resolvedAt && (
                        <span className="text-emerald-500">
                          Resolved: {incident.resolvedAt}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

SystemStatusDashboard.displayName = 'SystemStatusDashboard';
