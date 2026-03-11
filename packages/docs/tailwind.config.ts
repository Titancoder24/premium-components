import type { Config } from 'tailwindcss'
import uiConfig from '../ui/tailwind.config'

const config: Config = {
  ...uiConfig,
  content: [
    './src/**/*.{ts,tsx,mdx}',
    '../ui/src/**/*.{ts,tsx}',
  ],
}

export default config
