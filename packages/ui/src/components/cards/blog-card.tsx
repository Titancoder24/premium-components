'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BlogCardAuthor {
  name: string;
  avatar: string;
}

export interface BlogCardProps {
  image: string;
  category: string;
  title: string;
  excerpt: string;
  author: BlogCardAuthor;
  date: string;
  href?: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// BlogCard
// ---------------------------------------------------------------------------

export const BlogCard: React.FC<BlogCardProps> = ({
  image,
  category,
  title,
  excerpt,
  author,
  date,
  href,
  className,
}) => {
  const Wrapper = href ? 'a' : 'div';
  const wrapperProps = href ? { href } : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn(
        'group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-colors',
        href && 'cursor-pointer',
        className,
      )}
    >
      <Wrapper {...(wrapperProps as any)} className="flex flex-col">
        {/* Image */}
        <div className="relative aspect-[16/9] overflow-hidden">
          <motion.img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute left-3 top-3 rounded-full bg-primary/90 px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
            {category}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-2 p-5">
          <h3 className="text-base font-semibold text-foreground decoration-primary decoration-2 underline-offset-2 group-hover:underline">
            {title}
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {excerpt}
          </p>

          {/* Author + date */}
          <div className="mt-auto flex items-center gap-2.5 pt-4">
            <img
              src={author.avatar}
              alt={author.name}
              className="h-7 w-7 rounded-full object-cover"
            />
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{author.name}</span>
              <span aria-hidden>&middot;</span>
              <time>{date}</time>
            </div>
          </div>
        </div>
      </Wrapper>
    </motion.div>
  );
};

BlogCard.displayName = 'BlogCard';
