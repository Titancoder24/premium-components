"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, FileText, Check, AlertCircle } from "lucide-react";
import { cn } from "../../lib/utils";

export interface UploadedFile {
  /** File reference */
  file: File;
  /** Upload progress (0-100) */
  progress: number;
  /** Upload status */
  status: "pending" | "uploading" | "complete" | "error";
  /** Error message if status is error */
  error?: string;
}

export interface FileUploadZoneProps {
  /** Accepted file types (e.g., "image/*,.pdf") */
  accept?: string;
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Maximum number of files */
  maxFiles?: number;
  /** Callback fired when files are added */
  onUpload: (files: File[]) => void;
  /** Whether multiple files can be uploaded */
  multiple?: boolean;
  /** Current uploaded files state (controlled) */
  files?: UploadedFile[];
  /** Callback to remove a file */
  onRemove?: (index: number) => void;
  /** Additional class names */
  className?: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileUploadZone({
  accept,
  maxSize,
  maxFiles = 10,
  onUpload,
  multiple = true,
  files = [],
  onRemove,
  className,
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const validateFiles = useCallback(
    (fileList: File[]): File[] => {
      setError(null);
      const valid: File[] = [];

      if (files.length + fileList.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`);
        return [];
      }

      for (const file of fileList) {
        if (maxSize && file.size > maxSize) {
          setError(
            `${file.name} exceeds maximum size of ${formatFileSize(maxSize)}`
          );
          continue;
        }
        valid.push(file);
      }

      return valid;
    },
    [files.length, maxFiles, maxSize]
  );

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;
      const arr = Array.from(fileList);
      const valid = validateFiles(arr);
      if (valid.length > 0) {
        onUpload(valid);
      }
    },
    [validateFiles, onUpload]
  );

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      dragCounter.current = 0;
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  return (
    <div className={cn("w-full max-w-lg space-y-4", className)}>
      {/* Drop zone */}
      <motion.div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        animate={{
          borderColor: isDragging ? "var(--color-primary)" : undefined,
          scale: isDragging ? 1.01 : 1,
        }}
        transition={{ duration: 0.2 }}
        className={cn(
          "relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-card p-8",
          "transition-colors duration-200 hover:border-primary/50 hover:bg-accent/50",
          isDragging && "border-primary bg-primary/5"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        <motion.div
          animate={{
            y: isDragging ? -4 : 0,
            scale: isDragging ? 1.1 : 1,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Upload
            className={cn(
              "h-10 w-10 transition-colors duration-200",
              isDragging ? "text-primary" : "text-muted-foreground"
            )}
          />
        </motion.div>

        <div className="text-center">
          <p className="text-sm font-medium text-foreground">
            {isDragging ? "Drop files here" : "Drag & drop files here"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            or click to browse
            {maxSize && ` (max ${formatFileSize(maxSize)})`}
          </p>
        </div>
      </motion.div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* File list */}
      <AnimatePresence>
        {files.map((item, index) => (
          <motion.div
            key={`${item.file.name}-${index}`}
            initial={{ opacity: 0, y: 8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, x: -20, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                  item.status === "complete"
                    ? "bg-green-500/10"
                    : item.status === "error"
                    ? "bg-destructive/10"
                    : "bg-primary/10"
                )}
              >
                {item.status === "complete" ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 25,
                    }}
                  >
                    <Check className="h-5 w-5 text-green-500" />
                  </motion.div>
                ) : item.status === "error" ? (
                  <AlertCircle className="h-5 w-5 text-destructive" />
                ) : (
                  <FileText className="h-5 w-5 text-primary" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {item.file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(item.file.size)}
                  {item.error && (
                    <span className="ml-2 text-destructive">{item.error}</span>
                  )}
                </p>

                {/* Progress bar */}
                {(item.status === "uploading" || item.status === "pending") && (
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${item.progress}%` }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                  </div>
                )}
              </div>

              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="shrink-0 rounded-md p-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
