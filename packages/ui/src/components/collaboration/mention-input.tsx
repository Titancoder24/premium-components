'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AtSign, Search } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MentionUser {
  id: string;
  name: string;
  avatar: string;
}

export interface MentionInputProps {
  value: string;
  onChange: (value: string) => void;
  users: MentionUser[];
  placeholder?: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const MentionInput: React.FC<MentionInputProps> = ({
  value,
  onChange,
  users,
  placeholder = 'Type @ to mention someone...',
  className,
}) => {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [cursorPos, setCursorPos] = React.useState(0);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const filteredUsers = React.useMemo(() => {
    if (!query) return users;
    const lower = query.toLowerCase();
    return users.filter((u) => u.name.toLowerCase().includes(lower));
  }, [users, query]);

  React.useEffect(() => {
    setSelectedIndex(0);
  }, [filteredUsers.length]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    const pos = e.target.selectionStart ?? val.length;
    setCursorPos(pos);
    onChange(val);

    const textBeforeCursor = val.slice(0, pos);
    const atMatch = textBeforeCursor.match(/@(\w*)$/);
    if (atMatch) {
      setQuery(atMatch[1] ?? '');
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
      setQuery('');
    }
  };

  const insertMention = (user: MentionUser) => {
    const textBeforeCursor = value.slice(0, cursorPos);
    const textAfterCursor = value.slice(cursorPos);
    const atIndex = textBeforeCursor.lastIndexOf('@');
    const before = value.slice(0, atIndex);
    const mention = `@${user.name} `;
    const newValue = before + mention + textAfterCursor;
    onChange(newValue);
    setShowDropdown(false);
    setQuery('');

    requestAnimationFrame(() => {
      if (inputRef.current) {
        const newPos = atIndex + mention.length;
        inputRef.current.focus();
        inputRef.current.setSelectionRange(newPos, newPos);
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filteredUsers.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && filteredUsers[selectedIndex]) {
      e.preventDefault();
      insertMention(filteredUsers[selectedIndex]!);
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  return (
    <div className={cn('relative', className)}>
      <div
        className="relative flex items-start rounded-lg border"
        style={{
          borderColor: showDropdown ? 'hsl(var(--primary))' : 'hsl(var(--border))',
          backgroundColor: 'hsl(var(--background))',
          transition: 'border-color 0.2s',
        }}
      >
        <div className="flex items-center pl-3 pt-2.5">
          <AtSign className="h-4 w-4" style={{ color: 'hsl(var(--muted-foreground))' }} />
        </div>
        <textarea
          ref={inputRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            setTimeout(() => setShowDropdown(false), 150);
          }}
          placeholder={placeholder}
          rows={3}
          className="flex-1 resize-none bg-transparent px-2 py-2.5 text-sm outline-none"
          style={{ color: 'hsl(var(--foreground))' }}
        />
      </div>

      <AnimatePresence>
        {showDropdown && filteredUsers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -4, scaleY: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 z-50 mt-1 overflow-hidden rounded-lg border shadow-lg"
            style={{
              borderColor: 'hsl(var(--border))',
              backgroundColor: 'hsl(var(--popover))',
              transformOrigin: 'top',
            }}
          >
            <div className="flex items-center gap-2 px-3 py-2 border-b" style={{ borderColor: 'hsl(var(--border))' }}>
              <Search className="h-3 w-3" style={{ color: 'hsl(var(--muted-foreground))' }} />
              <span className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
                {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
              </span>
            </div>
            <ul className="max-h-48 overflow-y-auto py-1">
              {filteredUsers.map((user, i) => (
                <motion.li
                  key={user.id}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    insertMention(user);
                  }}
                  onMouseEnter={() => setSelectedIndex(i)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 cursor-pointer text-sm transition-colors',
                  )}
                  style={{
                    backgroundColor:
                      i === selectedIndex
                        ? 'hsl(var(--accent))'
                        : 'transparent',
                    color: 'hsl(var(--foreground))',
                  }}
                >
                  <div
                    className="h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium shrink-0"
                    style={{
                      backgroundColor: 'hsl(var(--primary))',
                      color: 'hsl(var(--primary-foreground))',
                    }}
                  >
                    {user.avatar}
                  </div>
                  <span className="truncate">{user.name}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

MentionInput.displayName = 'MentionInput';
