'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MousePointer2 } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CursorData {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
}

export interface SharedCursorProps {
  cursors: CursorData[];
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const CursorArrow: React.FC<{ cursor: CursorData }> = ({ cursor }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      className="absolute top-0 left-0 pointer-events-none z-50"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: 1,
        scale: 1,
        x: cursor.x,
        y: cursor.y,
      }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{
        x: { type: 'spring', stiffness: 200, damping: 25, mass: 0.5 },
        y: { type: 'spring', stiffness: 200, damping: 25, mass: 0.5 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.15 },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ willChange: 'transform' }}
    >
      <svg
        width="20"
        height="24"
        viewBox="0 0 20 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-md"
      >
        <path
          d="M1 1L1 18L6.5 13L13 13L1 1Z"
          fill={cursor.color}
          stroke="white"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>

      <motion.div
        className="absolute left-4 top-4 whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium shadow-sm"
        style={{
          backgroundColor: cursor.color,
          color: '#fff',
        }}
        initial={{ opacity: 0, y: 2 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        {cursor.name}
      </motion.div>

      {isHovered && (
        <motion.div
          className="absolute left-4 top-10 whitespace-nowrap rounded-md px-2 py-0.5 text-xs"
          style={{
            backgroundColor: 'hsl(var(--popover))',
            color: 'hsl(var(--popover-foreground))',
            border: '1px solid hsl(var(--border))',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          x: {Math.round(cursor.x)}, y: {Math.round(cursor.y)}
        </motion.div>
      )}
    </motion.div>
  );
};

export const SharedCursor: React.FC<SharedCursorProps> = ({ cursors, className }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden', className)}
      style={{
        position: 'relative',
        minHeight: 200,
        backgroundColor: 'hsl(var(--background))',
        border: '1px dashed hsl(var(--border))',
        borderRadius: 8,
      }}
    >
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ color: 'hsl(var(--muted-foreground))' }}
      >
        <div className="flex flex-col items-center gap-2 opacity-40">
          <MousePointer2 className="h-6 w-6" />
          <span className="text-xs font-medium">
            {cursors.length} active cursor{cursors.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {cursors.map((cursor) => (
          <CursorArrow key={cursor.id} cursor={cursor} />
        ))}
      </AnimatePresence>

      <div className="absolute bottom-2 right-2 flex items-center gap-1">
        {cursors.map((cursor) => (
          <motion.div
            key={cursor.id}
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: cursor.color }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            title={cursor.name}
          />
        ))}
      </div>
    </div>
  );
};

SharedCursor.displayName = 'SharedCursor';
