'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Search, Home, ArrowLeft } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ErrorPageProps {
  /** HTTP error code (e.g. 404, 500). */
  code: number;
  /** Error title. */
  title: string;
  /** Descriptive message. */
  description: string;
  /** Show a search bar. */
  showSearch?: boolean;
  /** Href for the home link. */
  homeHref?: string;
  /** Called when search is submitted. */
  onSearch?: (query: string) => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ErrorPage({
  code,
  title,
  description,
  showSearch = false,
  homeHref = '/',
  onSearch,
  className,
}: ErrorPageProps) {
  const [query, setQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  };

  return (
    <div
      className={cn(
        'flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center',
        className,
      )}
    >
      {/* Large error code with float + glitch */}
      <motion.div
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative select-none"
      >
        <motion.span
          className="text-[8rem] font-black leading-none tracking-tighter text-[var(--color-text-primary)] opacity-10 sm:text-[12rem]"
          animate={{
            textShadow: [
              '0 0 0 transparent',
              '3px 0 0 rgba(255,0,0,0.3), -3px 0 0 rgba(0,255,255,0.3)',
              '0 0 0 transparent',
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 4,
          }}
        >
          {code}
        </motion.span>
      </motion.div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="-mt-8 flex flex-col items-center gap-4"
      >
        <motion.h1
          variants={itemVariants}
          className="text-2xl font-bold text-[var(--color-text-primary)] sm:text-3xl"
        >
          {title}
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="max-w-md text-[var(--color-text-secondary)]"
        >
          {description}
        </motion.p>

        {/* Search */}
        {showSearch && (
          <motion.form
            variants={itemVariants}
            onSubmit={handleSearch}
            className={cn(
              'mt-2 flex w-full max-w-sm items-center gap-2 rounded-lg',
              'border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-3 py-2',
            )}
          >
            <Search className="h-4 w-4 shrink-0 text-[var(--color-text-tertiary)]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for something..."
              className="flex-1 bg-transparent text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none"
            />
          </motion.form>
        )}

        {/* Action buttons */}
        <motion.div variants={itemVariants} className="mt-4 flex items-center gap-3">
          <a
            href={homeHref}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium',
              'bg-[var(--color-accent)] text-white hover:opacity-90 transition-opacity',
            )}
          >
            <Home className="h-4 w-4" />
            Go Home
          </a>
          <button
            type="button"
            onClick={() => window.history.back()}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium',
              'border border-[var(--color-border)] text-[var(--color-text-secondary)]',
              'hover:bg-[var(--color-bg-secondary)] transition-colors',
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}

ErrorPage.displayName = 'ErrorPage';
