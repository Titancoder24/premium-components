'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ProductImageGalleryProps {
  images: string[];
  alt: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ProductImageGallery({
  images,
  alt,
  className,
}: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [lightboxOpen, setLightboxOpen] = React.useState(false);

  const goTo = React.useCallback(
    (idx: number) => {
      setActiveIndex(
        ((idx % images.length) + images.length) % images.length,
      );
    },
    [images.length],
  );

  // Keyboard navigation for lightbox
  React.useEffect(() => {
    if (!lightboxOpen) return;

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') goTo(activeIndex - 1);
      if (e.key === 'ArrowRight') goTo(activeIndex + 1);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxOpen, activeIndex, goTo]);

  return (
    <>
      <div className={cn('flex flex-col gap-3', className)}>
        {/* Main image */}
        <div className="group relative aspect-square overflow-hidden rounded-xl bg-[var(--color-muted,#f3f4f6)]">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeIndex}
              src={images[activeIndex]}
              alt={`${alt} ${activeIndex + 1}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="h-full w-full cursor-zoom-in object-cover"
              onClick={() => setLightboxOpen(true)}
            />
          </AnimatePresence>

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => goTo(activeIndex - 1)}
                className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--color-surface,#ffffff)]/80 text-[var(--color-foreground,#111827)] opacity-0 shadow backdrop-blur-sm transition-all hover:bg-[var(--color-surface,#ffffff)] group-hover:opacity-100"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => goTo(activeIndex + 1)}
                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--color-surface,#ffffff)]/80 text-[var(--color-foreground,#111827)] opacity-0 shadow backdrop-blur-sm transition-all hover:bg-[var(--color-surface,#ffffff)] group-hover:opacity-100"
                aria-label="Next image"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}

          {/* Expand button */}
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-surface,#ffffff)]/80 text-[var(--color-foreground,#111827)] opacity-0 shadow backdrop-blur-sm transition-all hover:bg-[var(--color-surface,#ffffff)] group-hover:opacity-100"
            aria-label="Open fullscreen"
          >
            <Expand className="h-4 w-4" />
          </button>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg"
                aria-label={`View image ${idx + 1}`}
              >
                <img
                  src={img}
                  alt={`${alt} thumbnail ${idx + 1}`}
                  className={cn(
                    'h-full w-full object-cover transition-opacity',
                    idx === activeIndex ? 'opacity-100' : 'opacity-60 hover:opacity-80',
                  )}
                />
                {idx === activeIndex && (
                  <motion.div
                    layoutId="gallery-thumb-active"
                    className="absolute inset-0 rounded-lg ring-2 ring-[var(--color-primary,#3b82f6)]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setLightboxOpen(false)}
              className="absolute inset-0 bg-black/90"
              aria-hidden="true"
            />

            {/* Close */}
            <motion.button
              type="button"
              onClick={() => setLightboxOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              aria-label="Close lightbox"
            >
              <X className="h-5 w-5" />
            </motion.button>

            {/* Image */}
            <AnimatePresence mode="wait">
              <motion.img
                key={activeIndex}
                src={images[activeIndex]}
                alt={`${alt} ${activeIndex + 1}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="relative z-10 max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
              />
            </AnimatePresence>

            {/* Navigation */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => goTo(activeIndex - 1)}
                  className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={() => goTo(activeIndex + 1)}
                  className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Counter */}
            <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur-sm">
              {activeIndex + 1} / {images.length}
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

ProductImageGallery.displayName = 'ProductImageGallery';
