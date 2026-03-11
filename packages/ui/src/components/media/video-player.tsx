'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, SkipBack, SkipForward } from 'lucide-react'
import { cn } from '../../lib/utils'

// ---- Types ----

export interface VideoPlayerProps {
  src: string
  poster?: string
  title?: string
  autoPlay?: boolean
  className?: string
}

// ---- Component ----

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  title,
  autoPlay = false,
  className,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isHovering, setIsHovering] = useState(false)
  const hideTimer = useRef<ReturnType<typeof setTimeout>>()

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const onTime = () => setCurrentTime(video.currentTime)
    const onMeta = () => setDuration(video.duration)
    const onEnd = () => setIsPlaying(false)
    video.addEventListener('timeupdate', onTime)
    video.addEventListener('loadedmetadata', onMeta)
    video.addEventListener('ended', onEnd)
    return () => {
      video.removeEventListener('timeupdate', onTime)
      video.removeEventListener('loadedmetadata', onMeta)
      video.removeEventListener('ended', onEnd)
    }
  }, [])

  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }, [isPlaying])

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const pct = (e.clientX - rect.left) / rect.width
      const video = videoRef.current
      if (video) video.currentTime = pct * duration
    },
    [duration],
  )

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value)
    setVolume(v)
    setIsMuted(v === 0)
    if (videoRef.current) videoRef.current.volume = v
  }, [])

  const toggleMute = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    const next = !isMuted
    setIsMuted(next)
    video.muted = next
  }, [isMuted])

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return
    if (!isFullscreen) {
      containerRef.current.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
    setIsFullscreen(!isFullscreen)
  }, [isFullscreen])

  const skip = useCallback((seconds: number) => {
    const video = videoRef.current
    if (video) video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds))
  }, [])

  const handleMouseMove = useCallback(() => {
    setShowControls(true)
    clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => {
      if (!isHovering) setShowControls(false)
    }, 3000)
  }, [isHovering])

  return (
    <div
      ref={containerRef}
      className={cn(
        'group relative overflow-hidden rounded-xl border border-[hsl(var(--border))] bg-black',
        className,
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => { setIsHovering(false); setShowControls(false) }}
    >
      {title && (
        <div className="absolute left-0 right-0 top-0 z-10 bg-gradient-to-b from-black/70 to-transparent p-4">
          <h3 className="text-sm font-semibold text-white">{title}</h3>
        </div>
      )}

      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        className="aspect-video w-full cursor-pointer object-contain"
        onClick={togglePlay}
      />

      <div
        className="absolute inset-0 flex cursor-pointer items-center justify-center"
        onClick={togglePlay}
      >
        <AnimatePresence>
          {!isPlaying && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--primary))]/80 text-[hsl(var(--primary-foreground))]"
            >
              <Play className="ml-1 h-7 w-7" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-8"
          >
            <div
              className="mb-3 h-1 w-full cursor-pointer rounded-full bg-white/30"
              onClick={handleSeek}
            >
              <div
                className="h-full rounded-full bg-[hsl(var(--primary))] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button onClick={() => skip(-10)} className="text-white/80 hover:text-white">
                  <SkipBack className="h-4 w-4" />
                </button>
                <button onClick={togglePlay} className="text-white hover:text-white/90">
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </button>
                <button onClick={() => skip(10)} className="text-white/80 hover:text-white">
                  <SkipForward className="h-4 w-4" />
                </button>
                <span className="ml-2 text-xs text-white/70">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <button onClick={toggleMute} className="text-white/80 hover:text-white">
                    {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="h-1 w-16 accent-[hsl(var(--primary))]"
                  />
                </div>
                <button onClick={toggleFullscreen} className="text-white/80 hover:text-white">
                  {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

VideoPlayer.displayName = 'VideoPlayer'
