'use client'

import React, { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Signal, Battery, Wifi, Camera, ChevronLeft } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface SmsMessage {
  id: string
  text: string
  sender: 'me' | 'them'
  time: string
}

export interface SmsPreviewProps {
  messages: SmsMessage[]
  contactName: string
  className?: string
}

const messageVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 25 },
  },
}

export const SmsPreview: React.FC<SmsPreviewProps> = ({
  messages,
  contactName,
  className,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const initials = contactName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div
      className={cn(
        'w-72 mx-auto rounded-[2.5rem] border-[3px] border-[hsl(var(--foreground)/0.2)] bg-[hsl(var(--card))] shadow-2xl overflow-hidden',
        className,
      )}
    >
      {/* Notch */}
      <div className="flex justify-center pt-2 pb-0">
        <div className="w-28 h-6 rounded-b-2xl bg-[hsl(var(--foreground)/0.1)]" />
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-6 py-1 text-[hsl(var(--muted-foreground))]">
        <span className="text-[10px] font-semibold">9:41</span>
        <div className="flex items-center gap-1">
          <Signal className="h-3 w-3" />
          <Wifi className="h-3 w-3" />
          <Battery className="h-3 w-3" />
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-[hsl(var(--border))]">
        <ChevronLeft className="h-5 w-5 text-[hsl(var(--primary))]" />
        <div className="flex items-center gap-2 flex-1">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[hsl(var(--primary)/0.15)]">
            <span className="text-xs font-semibold text-[hsl(var(--primary))]">
              {initials}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-[hsl(var(--card-foreground))] leading-tight">
              {contactName}
            </p>
            <p className="text-[10px] text-[hsl(var(--muted-foreground))]">
              iMessage
            </p>
          </div>
        </div>
        <Camera className="h-5 w-5 text-[hsl(var(--primary))]" />
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="h-72 overflow-y-auto px-3 py-3 space-y-2 bg-[hsl(var(--background))]"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => {
            const isMe = msg.sender === 'me'
            const showTime =
              idx === 0 || messages[idx - 1]?.sender !== msg.sender

            return (
              <motion.div
                key={msg.id}
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                layout
                className={cn('flex flex-col', isMe ? 'items-end' : 'items-start')}
              >
                {showTime && (
                  <span className="text-[9px] text-[hsl(var(--muted-foreground))] mb-1 px-2">
                    {msg.time}
                  </span>
                )}
                <div
                  className={cn(
                    'max-w-[80%] px-3 py-1.5 text-sm leading-relaxed',
                    isMe
                      ? 'rounded-2xl rounded-br-md bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                      : 'rounded-2xl rounded-bl-md bg-[hsl(var(--muted))] text-[hsl(var(--card-foreground))]',
                  )}
                >
                  {msg.text}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Input bar */}
      <div className="flex items-center gap-2 px-3 py-2 border-t border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <div className="flex-1 h-8 rounded-full bg-[hsl(var(--muted))] px-3 flex items-center">
          <span className="text-xs text-[hsl(var(--muted-foreground))]">
            iMessage
          </span>
        </div>
      </div>

      {/* Home indicator */}
      <div className="flex justify-center py-2">
        <div className="w-28 h-1 rounded-full bg-[hsl(var(--foreground)/0.2)]" />
      </div>
    </div>
  )
}

SmsPreview.displayName = 'SmsPreview'
