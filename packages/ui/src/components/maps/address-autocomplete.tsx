'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Search, Loader2, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface AddressSuggestion {
  id: string
  address: string
  city: string
  country: string
}

export interface AddressAutocompleteProps {
  value: string
  onChange: (value: string) => void
  suggestions?: AddressSuggestion[]
  onSelect?: (suggestion: AddressSuggestion) => void
  loading?: boolean
  className?: string
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  onChange,
  suggestions = [],
  onSelect,
  loading = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const showDropdown = isOpen && (suggestions.length > 0 || loading)

  useEffect(() => {
    setHighlightedIndex(-1)
  }, [suggestions])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value)
      setIsOpen(true)
    },
    [onChange],
  )

  const handleSelect = useCallback(
    (suggestion: AddressSuggestion) => {
      onChange(`${suggestion.address}, ${suggestion.city}, ${suggestion.country}`)
      onSelect?.(suggestion)
      setIsOpen(false)
      inputRef.current?.blur()
    },
    [onChange, onSelect],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showDropdown) return
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setHighlightedIndex((prev) => Math.min(prev + 1, suggestions.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setHighlightedIndex((prev) => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter' && highlightedIndex >= 0) {
        e.preventDefault()
        handleSelect(suggestions[highlightedIndex]!)
      } else if (e.key === 'Escape') {
        setIsOpen(false)
      }
    },
    [showDropdown, highlightedIndex, suggestions, handleSelect],
  )

  const handleBlur = useCallback(() => {
    setTimeout(() => setIsOpen(false), 200)
  }, [])

  return (
    <div className={cn('relative w-full', className)}>
      <div
        className={cn(
          'flex items-center rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] transition-colors',
          isOpen && 'border-[hsl(var(--primary))] ring-1 ring-[hsl(var(--primary))]',
        )}
      >
        <Search className="ml-3 h-4 w-4 shrink-0 text-[hsl(var(--muted-foreground))]" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder="Enter an address..."
          role="combobox"
          aria-expanded={showDropdown}
          aria-autocomplete="list"
          className="flex-1 bg-transparent px-3 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] outline-none"
        />
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, rotate: 0 }}
              animate={{ opacity: 1, rotate: 360 }}
              exit={{ opacity: 0 }}
              transition={{ rotate: { repeat: Infinity, duration: 1, ease: 'linear' } }}
              className="mr-3"
            >
              <Loader2 className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -8, scaleY: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{ transformOrigin: 'top' }}
            className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-lg"
          >
            {loading && suggestions.length === 0 ? (
              <div className="flex items-center justify-center gap-2 px-3 py-4 text-sm text-[hsl(var(--muted-foreground))]">
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching addresses...
              </div>
            ) : (
              <ul ref={listRef} role="listbox" className="max-h-60 overflow-y-auto py-1">
                {suggestions.map((suggestion, index) => (
                  <motion.li
                    key={suggestion.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    role="option"
                    aria-selected={highlightedIndex === index}
                    onClick={() => handleSelect(suggestion)}
                    className={cn(
                      'flex cursor-pointer items-center gap-3 px-3 py-2.5 text-sm transition-colors',
                      highlightedIndex === index
                        ? 'bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]'
                        : 'text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]',
                    )}
                  >
                    <MapPin className="h-4 w-4 shrink-0 text-[hsl(var(--muted-foreground))]" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{suggestion.address}</p>
                      <p className="truncate text-xs text-[hsl(var(--muted-foreground))]">
                        {suggestion.city}, {suggestion.country}
                      </p>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[hsl(var(--muted-foreground))]" />
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

AddressAutocomplete.displayName = 'AddressAutocomplete'

export { AddressAutocomplete }
