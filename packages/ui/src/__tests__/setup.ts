import '@testing-library/jest-dom/vitest'

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => {
  const React = require('react')

  const motion = new Proxy(
    {},
    {
      get: (_target, prop: string) => {
        return React.forwardRef((props: Record<string, unknown>, ref: unknown) => {
          const {
            initial: _initial,
            animate: _animate,
            exit: _exit,
            transition: _transition,
            whileHover: _whileHover,
            whileTap: _whileTap,
            whileFocus: _whileFocus,
            whileDrag: _whileDrag,
            whileInView: _whileInView,
            variants: _variants,
            layout: _layout,
            layoutId: _layoutId,
            drag: _drag,
            dragConstraints: _dragConstraints,
            onDragEnd: _onDragEnd,
            ...rest
          } = props
          return React.createElement(prop, { ...rest, ref })
        })
      },
    },
  )

  return {
    motion,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    useAnimation: () => ({
      start: vi.fn(),
      stop: vi.fn(),
      set: vi.fn(),
    }),
    useMotionValue: (initial: number) => {
      const mv = {
        get: () => initial,
        set: vi.fn(),
        onChange: vi.fn(() => () => {}),
        current: initial,
        [Symbol.toPrimitive]: () => initial,
      }
      // Make it render as a number in React
      Object.defineProperty(mv, '$$typeof', { value: undefined })
      return mv
    },
    useTransform: (input: unknown, rangeOrTransform: unknown, outputRange?: number[]) => {
      // Handle callback form: useTransform(motionValue, (latest) => transform(latest))
      if (typeof rangeOrTransform === 'function') {
        const inputVal = typeof input === 'object' && input !== null && 'get' in input
          ? (input as { get: () => number }).get()
          : 0
        const transformed = (rangeOrTransform as (v: number) => unknown)(inputVal)
        // Return the transformed value as a string so it can be rendered as a React child
        return String(transformed ?? '')
      }
      const val = Array.isArray(outputRange) ? outputRange[0] ?? 0 : 0
      return String(val)
    },
    useSpring: (source: unknown) => {
      const val = typeof source === 'number' ? source : 0
      return {
        get: () => val,
        set: vi.fn(),
        current: val,
        onChange: vi.fn(() => () => {}),
        [Symbol.toPrimitive]: () => val,
      }
    },
    useInView: () => true,
    useScroll: () => ({
      scrollY: { get: () => 0, onChange: vi.fn() },
      scrollYProgress: { get: () => 0, onChange: vi.fn() },
    }),
  }
})

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Suppress console.error for intentional error testing
const originalError = console.error
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
