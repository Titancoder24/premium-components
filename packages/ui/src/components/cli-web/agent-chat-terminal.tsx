'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Bot,
  User,
  ChevronDown,
  Wrench,
  Brain,
  Trash2,
  Cpu,
  Hash,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ToolUseDetail {
  name: string;
  input?: string;
  output?: string;
}

export interface AgentMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  toolUse?: ToolUseDetail;
  thinking?: string;
  tokenCount?: number;
  timestamp?: string;
}

export interface AgentChatTerminalProps {
  messages: AgentMessage[];
  onSend: (msg: string) => void;
  isStreaming?: boolean;
  model?: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const messageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6, transition: { duration: 0.15 } },
};

// ---------------------------------------------------------------------------
// ToolUseBlock
// ---------------------------------------------------------------------------

const ToolUseBlock: React.FC<{ tool: ToolUseDetail }> = ({ tool }) => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div className="mt-1.5 rounded-md border border-zinc-700 bg-zinc-800/80">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-amber-400 transition-colors hover:bg-zinc-700/40"
      >
        <Wrench className="h-3 w-3 shrink-0" />
        <span className="font-medium">{tool.name}</span>
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="ml-auto inline-flex"
        >
          <ChevronDown className="h-3 w-3" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="overflow-hidden"
          >
            <div className="border-t border-zinc-700 px-3 py-2 font-mono text-[11px]">
              {tool.input && (
                <div className="mb-1">
                  <span className="text-zinc-500">Input: </span>
                  <pre className="mt-0.5 whitespace-pre-wrap text-zinc-300">{tool.input}</pre>
                </div>
              )}
              {tool.output && (
                <div>
                  <span className="text-zinc-500">Output: </span>
                  <pre className="mt-0.5 whitespace-pre-wrap text-emerald-300">{tool.output}</pre>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ---------------------------------------------------------------------------
// ThinkingBlock
// ---------------------------------------------------------------------------

const ThinkingBlock: React.FC<{ content: string }> = ({ content }) => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div className="mt-1.5">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-1.5 text-xs text-zinc-500 transition-colors hover:text-zinc-400"
      >
        <Brain className="h-3 w-3" />
        <span className="italic">Thinking</span>
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="inline-flex"
        >
          <ChevronDown className="h-3 w-3" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="overflow-hidden"
          >
            <div className="mt-1 whitespace-pre-wrap rounded-md bg-zinc-800/50 px-3 py-2 font-mono text-[11px] italic text-zinc-500">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ---------------------------------------------------------------------------
// StreamingText
// ---------------------------------------------------------------------------

const StreamingText: React.FC<{ text: string }> = ({ text }) => (
  <span>
    {text.split('').map((char, i) => (
      <motion.span
        key={i}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: i * 0.012, duration: 0.08 }}
      >
        {char}
      </motion.span>
    ))}
  </span>
);

// ---------------------------------------------------------------------------
// TypingIndicator
// ---------------------------------------------------------------------------

const TypingIndicator: React.FC = () => (
  <div className="flex items-center gap-1 px-1 py-1">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="h-1.5 w-1.5 rounded-full bg-zinc-500"
        animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
        transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
      />
    ))}
  </div>
);

// ---------------------------------------------------------------------------
// AgentChatTerminal
// ---------------------------------------------------------------------------

export const AgentChatTerminal: React.FC<AgentChatTerminalProps> = ({
  messages,
  onSend,
  isStreaming = false,
  model,
  className,
}) => {
  const [input, setInput] = React.useState('');
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;
    onSend(trimmed);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'flex flex-col overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl dark:border-zinc-600',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-zinc-700 bg-zinc-800 px-4 py-2.5 dark:border-zinc-600">
        <Bot className="h-4 w-4 text-emerald-400" />
        <span className="text-sm font-semibold text-zinc-100">Agent Chat</span>
        {model && (
          <span className="flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-400">
            <Cpu className="h-2.5 w-2.5" />
            {model}
          </span>
        )}
        <div className="flex-1" />
        <span className="text-[10px] text-zinc-500">
          {messages.length} messages
        </span>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-3 font-mono text-sm leading-relaxed"
        style={{ minHeight: 240, maxHeight: 520 }}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              variants={messageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="mb-3"
            >
              {msg.role === 'user' && (
                <div className="flex items-start gap-2">
                  <User className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-400" />
                  <div>
                    <span className="text-blue-400">&gt; </span>
                    <span className="text-zinc-100">{msg.content}</span>
                  </div>
                </div>
              )}

              {msg.role === 'assistant' && (
                <div className="flex items-start gap-2">
                  <Bot className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                  <div className="min-w-0 flex-1">
                    {msg.thinking && <ThinkingBlock content={msg.thinking} />}
                    <div className="whitespace-pre-wrap text-zinc-300">
                      {isStreaming && msg === messages[messages.length - 1] ? (
                        <StreamingText text={msg.content} />
                      ) : (
                        msg.content
                      )}
                    </div>
                    {msg.toolUse && <ToolUseBlock tool={msg.toolUse} />}
                    {msg.tokenCount != null && (
                      <div className="mt-1 flex items-center gap-1 text-[10px] text-zinc-600">
                        <Hash className="h-2.5 w-2.5" />
                        {msg.tokenCount.toLocaleString()} tokens
                      </div>
                    )}
                  </div>
                </div>
              )}

              {msg.role === 'system' && (
                <div className="text-xs italic text-zinc-500">
                  {msg.content}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {isStreaming && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-zinc-500"
            >
              <Bot className="h-3.5 w-3.5 text-emerald-400" />
              <TypingIndicator />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="border-t border-zinc-700 bg-zinc-800/50 px-4 py-3 dark:border-zinc-600">
        <div className="flex items-end gap-2">
          <span className="mb-1.5 text-emerald-400">&gt;</span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isStreaming ? 'Waiting for response...' : 'Type a message...'}
            disabled={isStreaming}
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none disabled:opacity-50"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={isStreaming || !input.trim()}
            className="flex h-7 w-7 items-center justify-center rounded-md text-emerald-400 transition-colors hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Send className="h-3.5 w-3.5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

AgentChatTerminal.displayName = 'AgentChatTerminal';
