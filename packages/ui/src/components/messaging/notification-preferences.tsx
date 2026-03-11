'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Bell, Settings } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface PreferenceChannel {
  id: string
  name: string
}

export interface PreferenceCategory {
  id: string
  name: string
}

export interface NotificationPreferencesProps {
  channels: PreferenceChannel[]
  categories: PreferenceCategory[]
  preferences: Record<string, Record<string, boolean>>
  onChange: (categoryId: string, channelId: string, value: boolean) => void
  className?: string
}

const ToggleSwitch: React.FC<{
  enabled: boolean
  onToggle: () => void
}> = ({ enabled, onToggle }) => (
  <button
    role="switch"
    aria-checked={enabled}
    onClick={onToggle}
    className={cn(
      'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
      enabled
        ? 'bg-[hsl(var(--primary))]'
        : 'bg-[hsl(var(--muted-foreground)/0.3)]',
    )}
  >
    <motion.span
      layout
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={cn(
        'inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm',
        enabled ? 'ml-[18px]' : 'ml-[3px]',
      )}
    />
  </button>
)

const rowVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.04, duration: 0.25 },
  }),
}

export const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({
  channels,
  categories,
  preferences,
  onChange,
  className,
}) => {
  const allEnabled = (categoryId: string) =>
    channels.every((ch) => preferences[categoryId]?.[ch.id] ?? false)

  const toggleAll = (categoryId: string) => {
    const enable = !allEnabled(categoryId)
    channels.forEach((ch) => onChange(categoryId, ch.id, enable))
  }

  return (
    <div
      className={cn(
        'w-full max-w-2xl rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-lg overflow-hidden',
        className,
      )}
    >
      <div className="flex items-center gap-2 px-5 py-4 border-b border-[hsl(var(--border))]">
        <Settings className="h-5 w-5 text-[hsl(var(--primary))]" />
        <h2 className="text-base font-semibold text-[hsl(var(--card-foreground))]">
          Notification Preferences
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.3)]">
              <th className="text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider px-5 py-3">
                Category
              </th>
              {channels.map((channel) => (
                <th
                  key={channel.id}
                  className="text-center text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider px-4 py-3"
                >
                  <div className="flex flex-col items-center gap-1">
                    <Bell className="h-3.5 w-3.5" />
                    {channel.name}
                  </div>
                </th>
              ))}
              <th className="text-center text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider px-4 py-3">
                All
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[hsl(var(--border))]">
            {categories.map((category, i) => (
              <motion.tr
                key={category.id}
                custom={i}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                className="hover:bg-[hsl(var(--muted)/0.2)] transition-colors"
              >
                <td className="px-5 py-3">
                  <span className="text-sm font-medium text-[hsl(var(--card-foreground))]">
                    {category.name}
                  </span>
                </td>
                {channels.map((channel) => {
                  const enabled =
                    preferences[category.id]?.[channel.id] ?? false
                  return (
                    <td key={channel.id} className="text-center px-4 py-3">
                      <div className="flex justify-center">
                        <ToggleSwitch
                          enabled={enabled}
                          onToggle={() =>
                            onChange(category.id, channel.id, !enabled)
                          }
                        />
                      </div>
                    </td>
                  )
                })}
                <td className="text-center px-4 py-3">
                  <div className="flex justify-center">
                    <ToggleSwitch
                      enabled={allEnabled(category.id)}
                      onToggle={() => toggleAll(category.id)}
                    />
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-3 border-t border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.15)]">
        <p className="text-xs text-[hsl(var(--muted-foreground))]">
          Changes are saved automatically. You can manage individual channel settings above.
        </p>
      </div>
    </div>
  )
}

NotificationPreferences.displayName = 'NotificationPreferences'
