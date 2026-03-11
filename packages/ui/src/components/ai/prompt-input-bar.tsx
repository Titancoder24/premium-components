'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, X, Slash, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SlashCommand {
  name: string;
  description: string;
}

export interface ModelOption {
  id: string;
  name: string;
}

export interface AttachmentFile {
  id: string;
  name: string;
  size: number;
}

export interface PromptInputBarProps {
  onSubmit: (message: string, attachments?: AttachmentFile[]) => void;
  placeholder?: string;
  maxLength?: number;
  attachments?: boolean;
  modelSelector?: boolean;
  models?: ModelOption[];
  selectedModel?: string;
  onModelChange?: (modelId: string) => void;
  slashCommands?: SlashCommand[];
  className?: string;
}

// ---------------------------------------------------------------------------
// PromptInputBar
// ---------------------------------------------------------------------------

export const PromptInputBar: React.FC<PromptInputBarProps> = ({
  onSubmit,
  placeholder = 'Type a message...',
  maxLength,
  attachments: enableAttachments = false,
  modelSelector = false,
  models = [],
  selectedModel,
  onModelChange,
  slashCommands = [],
  className,
}) => {
  const [value, setValue] = React.useState('');
  const [files, setFiles] = React.useState<AttachmentFile[]>([]);
  const [showCommands, setShowCommands] = React.useState(false);
  const [showModels, setShowModels] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const canSend = value.trim().length > 0;

  // Auto-expand textarea
  React.useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  }, [value]);

  // Detect slash commands
  React.useEffect(() => {
    if (value === '/' && slashCommands.length > 0) {
      setShowCommands(true);
    } else if (!value.startsWith('/') || value.includes(' ')) {
      setShowCommands(false);
    }
  }, [value, slashCommands]);

  const handleSubmit = () => {
    if (!canSend) return;
    onSubmit(value.trim(), files.length > 0 ? files : undefined);
    setValue('');
    setFiles([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []).map((f) => ({
      id: `${f.name}-${Date.now()}`,
      name: f.name,
      size: f.size,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const selectCommand = (cmd: SlashCommand) => {
    setValue(`/${cmd.name} `);
    setShowCommands(false);
    textareaRef.current?.focus();
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  return (
    <div className={cn('relative', className)}>
      {/* Slash command dropdown */}
      <AnimatePresence>
        {showCommands && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-0 z-10 mb-2 w-64 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-1 shadow-lg"
          >
            {slashCommands.map((cmd) => (
              <button
                key={cmd.name}
                onClick={() => selectCommand(cmd)}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-[hsl(var(--muted))]"
              >
                <Slash className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" />
                <div>
                  <div className="font-medium text-[hsl(var(--foreground))]">/{cmd.name}</div>
                  <div className="text-xs text-[hsl(var(--muted-foreground))]">{cmd.description}</div>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-sm">
        {/* Attachment chips */}
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-1.5 border-b border-[hsl(var(--border))] px-3 py-2">
                {files.map((file) => (
                  <motion.span
                    key={file.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="inline-flex items-center gap-1.5 rounded-md bg-[hsl(var(--muted))] px-2 py-1 text-xs text-[hsl(var(--foreground))]"
                  >
                    <Paperclip className="h-3 w-3" />
                    <span className="max-w-[120px] truncate">{file.name}</span>
                    <span className="text-[hsl(var(--muted-foreground))]">({formatSize(file.size)})</span>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="ml-0.5 rounded-sm hover:text-[hsl(var(--destructive))]"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input row */}
        <div className="flex items-end gap-2 px-3 py-2">
          {enableAttachments && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
                aria-label="Attach file"
              >
                <Paperclip className="h-4 w-4" />
              </button>
            </>
          )}

          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              if (maxLength && e.target.value.length > maxLength) return;
              setValue(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            className="max-h-[200px] min-h-[36px] flex-1 resize-none bg-transparent py-1.5 text-sm text-[hsl(var(--foreground))] outline-none placeholder:text-[hsl(var(--muted-foreground))]"
          />

          {/* Model selector */}
          {modelSelector && models.length > 0 && (
            <div className="relative mb-0.5">
              <button
                onClick={() => setShowModels((v) => !v)}
                className="flex h-8 items-center gap-1 rounded-lg px-2 text-xs text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))]"
              >
                {models.find((m) => m.id === selectedModel)?.name || 'Model'}
                <ChevronDown className="h-3 w-3" />
              </button>
              <AnimatePresence>
                {showModels && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.12 }}
                    className="absolute bottom-full right-0 z-10 mb-1 w-40 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-1 shadow-lg"
                  >
                    {models.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => {
                          onModelChange?.(model.id);
                          setShowModels(false);
                        }}
                        className={cn(
                          'w-full rounded-md px-3 py-1.5 text-left text-xs transition-colors hover:bg-[hsl(var(--muted))]',
                          selectedModel === model.id
                            ? 'text-[hsl(var(--primary))]'
                            : 'text-[hsl(var(--foreground))]',
                        )}
                      >
                        {model.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Send button */}
          <motion.button
            onClick={handleSubmit}
            disabled={!canSend}
            animate={{
              scale: canSend ? 1 : 0.9,
              opacity: canSend ? 1 : 0.4,
            }}
            whileTap={canSend ? { scale: 0.92 } : undefined}
            transition={{ duration: 0.15 }}
            className={cn(
              'mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors',
              canSend
                ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]',
            )}
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </motion.button>
        </div>

        {/* Char count */}
        {maxLength && (
          <div className="px-4 pb-2 text-right text-[11px] text-[hsl(var(--muted-foreground))]">
            {value.length}/{maxLength}
          </div>
        )}
      </div>
    </div>
  );
};

PromptInputBar.displayName = 'PromptInputBar';
