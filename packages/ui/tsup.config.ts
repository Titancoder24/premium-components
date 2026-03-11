import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/themes/index.ts',
    'src/animations/index.ts',
    'src/components/*/index.ts',
  ],
  format: ['esm'],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', 'framer-motion', 'tailwindcss'],
  treeshake: true,
})
