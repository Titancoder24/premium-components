'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Link,
  Quote,
  Code,
  Minus,
  Undo,
  Redo,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type EditorAction =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'heading1'
  | 'heading2'
  | 'bulletList'
  | 'orderedList'
  | 'link'
  | 'blockquote'
  | 'code'
  | 'horizontalRule'
  | 'undo'
  | 'redo';

export interface CollaborativeEditorToolbarProps {
  onAction: (action: EditorAction) => void;
  activeFormats?: string[];
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface ToolbarButton {
  action: EditorAction;
  icon: React.ElementType;
  label: string;
  group: number;
}

const toolbarButtons: ToolbarButton[] = [
  { action: 'undo', icon: Undo, label: 'Undo', group: 0 },
  { action: 'redo', icon: Redo, label: 'Redo', group: 0 },
  { action: 'bold', icon: Bold, label: 'Bold', group: 1 },
  { action: 'italic', icon: Italic, label: 'Italic', group: 1 },
  { action: 'underline', icon: Underline, label: 'Underline', group: 1 },
  { action: 'heading1', icon: Heading1, label: 'Heading 1', group: 2 },
  { action: 'heading2', icon: Heading2, label: 'Heading 2', group: 2 },
  { action: 'bulletList', icon: List, label: 'Bullet List', group: 3 },
  { action: 'orderedList', icon: ListOrdered, label: 'Ordered List', group: 3 },
  { action: 'blockquote', icon: Quote, label: 'Blockquote', group: 3 },
  { action: 'code', icon: Code, label: 'Code', group: 4 },
  { action: 'link', icon: Link, label: 'Link', group: 4 },
  { action: 'horizontalRule', icon: Minus, label: 'Divider', group: 4 },
];

const ToolbarButtonItem: React.FC<{
  button: ToolbarButton;
  isActive: boolean;
  onClick: () => void;
}> = ({ button, isActive, onClick }) => {
  const Icon = button.icon;

  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      title={button.label}
      className={cn(
        'relative flex h-8 w-8 items-center justify-center rounded-md transition-colors',
      )}
      style={{
        color: isActive ? 'hsl(var(--primary))' : 'hsl(var(--foreground))',
      }}
      aria-label={button.label}
      aria-pressed={isActive}
    >
      {/* Active background indicator */}
      {isActive && (
        <motion.span
          layoutId="toolbar-active-bg"
          className="absolute inset-0 rounded-md"
          style={{ backgroundColor: 'hsl(var(--primary) / 0.12)' }}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        />
      )}

      <Icon className="relative z-10 h-4 w-4" />
    </motion.button>
  );
};

export const CollaborativeEditorToolbar: React.FC<CollaborativeEditorToolbarProps> = ({
  onAction,
  activeFormats = [],
  className,
}) => {
  const groups = React.useMemo(() => {
    const map = new Map<number, ToolbarButton[]>();
    toolbarButtons.forEach((btn) => {
      const list = map.get(btn.group) || [];
      list.push(btn);
      map.set(btn.group, list);
    });
    return Array.from(map.entries()).sort(([a], [b]) => a - b);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn(
        'flex items-center gap-0.5 rounded-lg border px-2 py-1.5',
        className,
      )}
      style={{
        borderColor: 'hsl(var(--border))',
        backgroundColor: 'hsl(var(--card))',
      }}
      role="toolbar"
      aria-label="Text formatting"
    >
      {groups.map(([groupId, buttons], groupIndex) => (
        <React.Fragment key={groupId}>
          {groupIndex > 0 && (
            <div
              className="mx-1 h-5 w-px shrink-0"
              style={{ backgroundColor: 'hsl(var(--border))' }}
            />
          )}
          <div className="flex items-center gap-0.5">
            {buttons.map((button) => (
              <ToolbarButtonItem
                key={button.action}
                button={button}
                isActive={activeFormats.includes(button.action)}
                onClick={() => onAction(button.action)}
              />
            ))}
          </div>
        </React.Fragment>
      ))}
    </motion.div>
  );
};

CollaborativeEditorToolbar.displayName = 'CollaborativeEditorToolbar';
