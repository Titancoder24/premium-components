'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  ChevronDown,
  Plus,
  Play,
  Check,
  X,
  AlertTriangle,
  Ban,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type RuleCategory = 'content_safety' | 'rate_limiting' | 'output_validation' | 'pii_detection';
export type RuleSeverity = 'warn' | 'block';

export interface GuardrailRule {
  id: string;
  name: string;
  description: string;
  category: RuleCategory;
  severity: RuleSeverity;
  enabled: boolean;
}

export interface TestResult {
  ruleId: string;
  passed: boolean;
  message?: string;
}

export interface GuardrailConfigPanelProps {
  rules: GuardrailRule[];
  onToggle: (ruleId: string, enabled: boolean) => void;
  onAddRule: (rule: Omit<GuardrailRule, 'id'>) => void;
  onTest?: (text: string) => Promise<TestResult[]>;
  className?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CATEGORY_LABELS: Record<RuleCategory, string> = {
  content_safety: 'Content Safety',
  rate_limiting: 'Rate Limiting',
  output_validation: 'Output Validation',
  pii_detection: 'PII Detection',
};

const CATEGORY_ICONS: Record<RuleCategory, React.FC<{ className?: string }>> = {
  content_safety: Shield,
  rate_limiting: AlertTriangle,
  output_validation: Check,
  pii_detection: Ban,
};

const CATEGORIES: RuleCategory[] = ['content_safety', 'rate_limiting', 'output_validation', 'pii_detection'];

// ---------------------------------------------------------------------------
// GuardrailConfigPanel
// ---------------------------------------------------------------------------

export const GuardrailConfigPanel: React.FC<GuardrailConfigPanelProps> = ({
  rules,
  onToggle,
  onAddRule,
  onTest,
  className,
}) => {
  const [collapsedCategories, setCollapsedCategories] = React.useState<Set<RuleCategory>>(new Set());
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [newRule, setNewRule] = React.useState({ name: '', description: '', category: 'content_safety' as RuleCategory, severity: 'warn' as RuleSeverity });
  const [testInput, setTestInput] = React.useState('');
  const [testing, setTesting] = React.useState(false);
  const [testResults, setTestResults] = React.useState<TestResult[] | null>(null);

  const rulesByCategory = React.useMemo(() => {
    const map = new Map<RuleCategory, GuardrailRule[]>();
    CATEGORIES.forEach((c) => map.set(c, []));
    rules.forEach((r) => {
      const arr = map.get(r.category);
      if (arr) arr.push(r);
    });
    return map;
  }, [rules]);

  const toggleCategory = (cat: RuleCategory) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      return next;
    });
  };

  const toggleAllInCategory = (cat: RuleCategory, enabled: boolean) => {
    const catRules = rulesByCategory.get(cat) ?? [];
    catRules.forEach((r) => onToggle(r.id, enabled));
  };

  const handleAddRule = () => {
    if (!newRule.name.trim()) return;
    onAddRule({ ...newRule, enabled: true });
    setNewRule({ name: '', description: '', category: 'content_safety', severity: 'warn' });
    setShowAddForm(false);
  };

  const handleTest = async () => {
    if (!onTest || !testInput.trim() || testing) return;
    setTesting(true);
    setTestResults(null);
    try {
      const results = await onTest(testInput);
      setTestResults(results);
    } finally {
      setTesting(false);
    }
  };

  const getTestResult = (ruleId: string): TestResult | undefined => {
    return testResults?.find((r) => r.ruleId === ruleId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={cn(
        'rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5',
        className,
      )}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
          <h2 className="text-base font-semibold text-[hsl(var(--foreground))]">Guardrail Config</h2>
        </div>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => setShowAddForm((v) => !v)}
          className="flex items-center gap-1.5 rounded-lg bg-[hsl(var(--primary))] px-3 py-1.5 text-xs font-medium text-[hsl(var(--primary-foreground))] transition-opacity hover:opacity-90"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Rule
        </motion.button>
      </div>

      {/* Add rule form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="mb-4 overflow-hidden"
          >
            <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-4 space-y-3">
              <input
                type="text"
                value={newRule.name}
                onChange={(e) => setNewRule((r) => ({ ...r, name: e.target.value }))}
                placeholder="Rule name"
                className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 text-sm text-[hsl(var(--foreground))] outline-none placeholder:text-[hsl(var(--muted-foreground))] focus:ring-2 focus:ring-[hsl(var(--ring))]"
              />
              <input
                type="text"
                value={newRule.description}
                onChange={(e) => setNewRule((r) => ({ ...r, description: e.target.value }))}
                placeholder="Description"
                className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 text-sm text-[hsl(var(--foreground))] outline-none placeholder:text-[hsl(var(--muted-foreground))] focus:ring-2 focus:ring-[hsl(var(--ring))]"
              />
              <div className="flex items-center gap-3">
                <select
                  value={newRule.category}
                  onChange={(e) => setNewRule((r) => ({ ...r, category: e.target.value as RuleCategory }))}
                  className="rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-2 py-1.5 text-xs text-[hsl(var(--foreground))] outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                  ))}
                </select>
                <select
                  value={newRule.severity}
                  onChange={(e) => setNewRule((r) => ({ ...r, severity: e.target.value as RuleSeverity }))}
                  className="rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-2 py-1.5 text-xs text-[hsl(var(--foreground))] outline-none"
                >
                  <option value="warn">Warn</option>
                  <option value="block">Block</option>
                </select>
                <div className="flex-1" />
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={handleAddRule}
                  disabled={!newRule.name.trim()}
                  className={cn(
                    'flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                    newRule.name.trim()
                      ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                      : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]',
                  )}
                >
                  <Check className="h-3.5 w-3.5" />
                  Add
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setShowAddForm(false)}
                  className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))]"
                >
                  <X className="h-3.5 w-3.5" />
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rules by category */}
      <div className="mb-5 space-y-2">
        {CATEGORIES.map((cat) => {
          const catRules = rulesByCategory.get(cat) ?? [];
          if (catRules.length === 0) return null;
          const collapsed = collapsedCategories.has(cat);
          const Icon = CATEGORY_ICONS[cat];
          const allEnabled = catRules.every((r) => r.enabled);

          return (
            <div key={cat} className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] overflow-hidden">
              {/* Category header */}
              <div className="flex items-center gap-2 px-3 py-2.5">
                <button
                  onClick={() => toggleCategory(cat)}
                  className="flex flex-1 items-center gap-2"
                >
                  <motion.span
                    animate={{ rotate: collapsed ? -90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                  </motion.span>
                  <Icon className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                  <span className="text-xs font-semibold text-[hsl(var(--foreground))]">
                    {CATEGORY_LABELS[cat]}
                  </span>
                  <span className="text-[10px] text-[hsl(var(--muted-foreground))]">
                    ({catRules.filter((r) => r.enabled).length}/{catRules.length})
                  </span>
                </button>
                <button
                  onClick={() => toggleAllInCategory(cat, !allEnabled)}
                  className="text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))]"
                >
                  {allEnabled ? (
                    <ToggleRight className="h-5 w-5 text-[hsl(var(--primary))]" />
                  ) : (
                    <ToggleLeft className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Rules */}
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-[hsl(var(--border))]">
                      {catRules.map((rule) => {
                        const result = getTestResult(rule.id);
                        return (
                          <motion.div
                            key={rule.id}
                            layout
                            className="flex items-center gap-3 border-b border-[hsl(var(--border))] px-4 py-2.5 last:border-0"
                          >
                            <button
                              onClick={() => onToggle(rule.id, !rule.enabled)}
                              className="shrink-0"
                            >
                              <motion.div
                                animate={{
                                  backgroundColor: rule.enabled ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
                                }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                className="relative h-5 w-9 rounded-full"
                              >
                                <motion.div
                                  animate={{ x: rule.enabled ? 16 : 2 }}
                                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                  className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm"
                                />
                              </motion.div>
                            </button>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className={cn(
                                  'text-xs font-medium',
                                  rule.enabled ? 'text-[hsl(var(--foreground))]' : 'text-[hsl(var(--muted-foreground))]',
                                )}>
                                  {rule.name}
                                </span>
                                <span className={cn(
                                  'rounded-full px-1.5 py-0.5 text-[10px] font-medium',
                                  rule.severity === 'block'
                                    ? 'bg-red-500/10 text-red-500'
                                    : 'bg-amber-500/10 text-amber-500',
                                )}>
                                  {rule.severity}
                                </span>
                              </div>
                              <span className="text-[11px] text-[hsl(var(--muted-foreground))]">
                                {rule.description}
                              </span>
                            </div>
                            {/* Test result indicator */}
                            <AnimatePresence>
                              {result && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                                  className={cn(
                                    'shrink-0 rounded-full p-1',
                                    result.passed ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500',
                                  )}
                                  title={result.message}
                                >
                                  {result.passed ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Test area */}
      {onTest && (
        <div>
          <div className="mb-2 text-xs font-medium text-[hsl(var(--muted-foreground))]">
            Test Rules
          </div>
          <div className="flex gap-2">
            <textarea
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              placeholder="Enter sample text to test against rules..."
              rows={2}
              className="flex-1 resize-none rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm text-[hsl(var(--foreground))] outline-none placeholder:text-[hsl(var(--muted-foreground))] focus:ring-2 focus:ring-[hsl(var(--ring))]"
            />
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={handleTest}
              disabled={!testInput.trim() || testing}
              className={cn(
                'flex h-auto items-center gap-1.5 self-end rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                testInput.trim() && !testing
                  ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                  : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]',
              )}
            >
              <Play className="h-4 w-4" />
              Test
            </motion.button>
          </div>
          {/* Test summary */}
          <AnimatePresence>
            {testResults && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.2 }}
                className="mt-2 flex items-center gap-3 text-xs"
              >
                <span className="text-emerald-500">
                  {testResults.filter((r) => r.passed).length} passed
                </span>
                <span className="text-red-500">
                  {testResults.filter((r) => !r.passed).length} failed
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

GuardrailConfigPanel.displayName = 'GuardrailConfigPanel';
