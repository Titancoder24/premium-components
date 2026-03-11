'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Calendar,
  Copy,
  Check,
  AlertCircle,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CronScheduleEditorProps {
  value?: string;
  onChange: (cron: string) => void;
  timezone?: string;
  className?: string;
}

interface CronParts {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const PRESETS: { label: string; cron: string }[] = [
  { label: 'Every minute', cron: '* * * * *' },
  { label: 'Every 5 minutes', cron: '*/5 * * * *' },
  { label: 'Every hour', cron: '0 * * * *' },
  { label: 'Daily at midnight', cron: '0 0 * * *' },
  { label: 'Weekly (Mon)', cron: '0 0 * * 1' },
  { label: 'Monthly (1st)', cron: '0 0 1 * *' },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function parseCron(expr: string): CronParts | null {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return null;
  return { minute: parts[0], hour: parts[1], dayOfMonth: parts[2], month: parts[3], dayOfWeek: parts[4] };
}

function validateCron(expr: string): string | null {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return 'Cron expression must have exactly 5 fields';
  const ranges = [
    { name: 'Minute', min: 0, max: 59 },
    { name: 'Hour', min: 0, max: 23 },
    { name: 'Day of month', min: 1, max: 31 },
    { name: 'Month', min: 1, max: 12 },
    { name: 'Day of week', min: 0, max: 7 },
  ];
  for (let i = 0; i < 5; i++) {
    const p = parts[i];
    if (p === '*' || /^\*\/\d+$/.test(p)) continue;
    const nums = p.split(',').flatMap((s) => {
      const range = s.split('-');
      return range.map(Number);
    });
    for (const n of nums) {
      if (isNaN(n) || n < ranges[i].min || n > ranges[i].max) {
        return `${ranges[i].name}: value ${p} is out of range (${ranges[i].min}-${ranges[i].max})`;
      }
    }
  }
  return null;
}

function describeCron(expr: string): string {
  const parts = parseCron(expr);
  if (!parts) return 'Invalid expression';
  const { minute, hour, dayOfMonth, month, dayOfWeek } = parts;

  if (expr === '* * * * *') return 'Every minute';
  if (/^\*\/(\d+)$/.test(minute) && hour === '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
    return `Every ${minute.split('/')[1]} minutes`;
  }
  if (minute !== '*' && hour === '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
    return `Every hour at minute ${minute}`;
  }

  const segments: string[] = [];
  if (minute !== '*' && hour !== '*') segments.push(`At ${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`);
  else if (minute !== '*') segments.push(`At minute ${minute}`);
  else if (hour !== '*') segments.push(`At hour ${hour}`);
  else segments.push('Every minute');

  if (dayOfMonth !== '*') segments.push(`on day ${dayOfMonth} of the month`);
  if (month !== '*') {
    const mIdx = Number(month) - 1;
    segments.push(`in ${MONTHS[mIdx] ?? `month ${month}`}`);
  }
  if (dayOfWeek !== '*') {
    const dIdx = Number(dayOfWeek);
    segments.push(`on ${DAYS_OF_WEEK[dIdx] ?? `day ${dayOfWeek}`}`);
  }
  return segments.join(' ');
}

function getNextExecutions(expr: string, count: number, tz?: string): Date[] {
  const parts = parseCron(expr);
  if (!parts) return [];
  const results: Date[] = [];
  const now = new Date();
  const check = new Date(now.getTime() + 60000);
  check.setSeconds(0, 0);

  for (let i = 0; i < 525600 && results.length < count; i++) {
    const d = new Date(check.getTime() + i * 60000);
    const m = d.getMinutes(), h = d.getHours(), dom = d.getDate(), mon = d.getMonth() + 1, dow = d.getDay();
    if (matchField(parts.minute, m) && matchField(parts.hour, h) && matchField(parts.dayOfMonth, dom) && matchField(parts.month, mon) && matchField(parts.dayOfWeek, dow)) {
      results.push(d);
    }
  }
  return results;
}

function matchField(field: string, value: number): boolean {
  if (field === '*') return true;
  if (field.startsWith('*/')) return value % Number(field.slice(2)) === 0;
  const parts = field.split(',');
  for (const p of parts) {
    if (p.includes('-')) {
      const [a, b] = p.split('-').map(Number);
      if (value >= a && value <= b) return true;
    } else if (Number(p) === value) return true;
  }
  return false;
}

// ---------------------------------------------------------------------------
// FieldSelector
// ---------------------------------------------------------------------------

const FieldSelector: React.FC<{
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (v: string) => void;
}> = ({ label, value, options, onChange }) => (
  <div>
    <label className="mb-1.5 block text-xs font-medium text-[hsl(var(--muted-foreground))]">{label}</label>
    <div className="flex flex-wrap gap-1">
      <button
        onClick={() => onChange('*')}
        className={cn(
          'h-7 rounded-md px-2 text-xs font-medium transition-colors',
          value === '*' ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]',
        )}
      >
        Any
      </button>
      {options.map((opt) => {
        const selected = value.split(',').includes(opt.value);
        return (
          <button
            key={opt.value}
            onClick={() => {
              if (value === '*') { onChange(opt.value); return; }
              const vals = value.split(',').filter(Boolean);
              const next = selected ? vals.filter((v) => v !== opt.value) : [...vals, opt.value];
              onChange(next.length === 0 ? '*' : next.join(','));
            }}
            className={cn(
              'h-7 min-w-[28px] rounded-md px-1.5 text-xs font-medium transition-colors',
              selected ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]',
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// CronScheduleEditor
// ---------------------------------------------------------------------------

export const CronScheduleEditor: React.FC<CronScheduleEditorProps> = ({
  value = '0 * * * *',
  onChange,
  timezone,
  className,
}) => {
  const [rawExpr, setRawExpr] = React.useState(value);
  const [advanced, setAdvanced] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const error = validateCron(rawExpr);
  const description = error ? null : describeCron(rawExpr);
  const nextRuns = error ? [] : getNextExecutions(rawExpr, 5, timezone);
  const parts = parseCron(rawExpr);

  const updateField = (field: keyof CronParts, val: string) => {
    if (!parts) return;
    const next = { ...parts, [field]: val };
    const expr = `${next.minute} ${next.hour} ${next.dayOfMonth} ${next.month} ${next.dayOfWeek}`;
    setRawExpr(expr);
    onChange(expr);
  };

  const handleRawChange = (expr: string) => {
    setRawExpr(expr);
    if (!validateCron(expr)) onChange(expr);
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(rawExpr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const minuteOpts = Array.from({ length: 60 }, (_, i) => ({ label: String(i), value: String(i) }));
  const hourOpts = Array.from({ length: 24 }, (_, i) => ({ label: String(i).padStart(2, '0'), value: String(i) }));
  const domOpts = Array.from({ length: 31 }, (_, i) => ({ label: String(i + 1), value: String(i + 1) }));
  const monthOpts = MONTHS.map((m, i) => ({ label: m, value: String(i + 1) }));
  const dowOpts = DAYS_OF_WEEK.map((d, i) => ({ label: d, value: String(i) }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[hsl(var(--border))] px-4 py-3">
        <div className="flex items-center gap-2.5">
          <Clock className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">Cron Schedule</h3>
          {timezone && <span className="text-xs text-[hsl(var(--muted-foreground))]">({timezone})</span>}
        </div>
        <button
          onClick={() => setAdvanced(!advanced)}
          className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
        >
          {advanced ? <ToggleRight className="h-4 w-4 text-[hsl(var(--primary))]" /> : <ToggleLeft className="h-4 w-4" />}
          {advanced ? 'Advanced' : 'Simple'}
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Raw expression input */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[hsl(var(--muted-foreground))]">Expression</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={rawExpr}
              onChange={(e) => handleRawChange(e.target.value)}
              className={cn(
                'flex-1 rounded-md border bg-[hsl(var(--background))] px-3 py-2 font-mono text-sm text-[hsl(var(--foreground))] focus:outline-none focus:ring-1',
                error ? 'border-red-500 focus:ring-red-500' : 'border-[hsl(var(--border))] focus:ring-[hsl(var(--ring))]',
              )}
              spellCheck={false}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopy}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  </motion.span>
                ) : (
                  <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Copy className="h-3.5 w-3.5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500"
              >
                <AlertCircle className="h-3 w-3 shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>
          {description && (
            <motion.p
              key={description}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-1.5 text-xs text-[hsl(var(--muted-foreground))]"
            >
              {description}
            </motion.p>
          )}
        </div>

        {/* Presets */}
        {!advanced && (
          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Presets</span>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((preset) => (
                <motion.button
                  key={preset.cron}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setRawExpr(preset.cron); onChange(preset.cron); }}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                    rawExpr === preset.cron
                      ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                      : 'border border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]',
                  )}
                >
                  {preset.label}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Advanced field selectors */}
        <AnimatePresence>
          {advanced && parts && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-3 overflow-hidden"
            >
              <FieldSelector label="Minute" value={parts.minute} options={minuteOpts} onChange={(v) => updateField('minute', v)} />
              <FieldSelector label="Hour" value={parts.hour} options={hourOpts} onChange={(v) => updateField('hour', v)} />
              <FieldSelector label="Day of Month" value={parts.dayOfMonth} options={domOpts} onChange={(v) => updateField('dayOfMonth', v)} />
              <FieldSelector label="Month" value={parts.month} options={monthOpts} onChange={(v) => updateField('month', v)} />
              <FieldSelector label="Day of Week" value={parts.dayOfWeek} options={dowOpts} onChange={(v) => updateField('dayOfWeek', v)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Visual clock */}
        {!error && parts && (
          <div className="flex items-center gap-4 rounded-lg bg-[hsl(var(--muted))] p-3">
            <Calendar className="h-5 w-5 shrink-0 text-[hsl(var(--muted-foreground))]" />
            <div className="grid grid-cols-5 gap-2 flex-1 text-center">
              {[
                { label: 'Min', value: parts.minute },
                { label: 'Hour', value: parts.hour },
                { label: 'Day', value: parts.dayOfMonth },
                { label: 'Mon', value: parts.month },
                { label: 'DoW', value: parts.dayOfWeek },
              ].map((f) => (
                <div key={f.label}>
                  <div className="text-[10px] uppercase tracking-wider text-[hsl(var(--muted-foreground))]">{f.label}</div>
                  <div className="font-mono text-sm font-semibold text-[hsl(var(--foreground))]">{f.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next executions */}
        {nextRuns.length > 0 && (
          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
              Next 5 Executions
            </span>
            <div className="space-y-1">
              {nextRuns.map((d, i) => (
                <motion.div
                  key={d.toISOString()}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, type: 'spring', stiffness: 400, damping: 25 }}
                  className="flex items-center gap-2 rounded-md px-2 py-1 text-xs hover:bg-[hsl(var(--muted))] transition-colors"
                >
                  <ChevronRight className="h-3 w-3 text-[hsl(var(--muted-foreground))]" />
                  <span className="font-mono text-[hsl(var(--foreground))]">
                    {d.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

CronScheduleEditor.displayName = 'CronScheduleEditor';
