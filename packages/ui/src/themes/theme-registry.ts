/** A single theme's color configuration */
export interface ThemeDefinition {
  /** Unique theme identifier */
  name: string
  /** Human-readable display name */
  label: string
  /** Theme family grouping */
  family: ThemeFamily
  /** Primary accent color HSL */
  primary: string
  /** Description of the theme aesthetic */
  description: string
}

/** Theme family categories */
export type ThemeFamily =
  | 'blue'
  | 'green'
  | 'teal'
  | 'purple'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'neutral'
  | 'specialty'

/** All theme definitions */
export const themes: ThemeDefinition[] = [
  // Blue Family
  { name: 'ocean', label: 'Ocean', family: 'blue', primary: '199 89% 48%', description: 'Deep navy with bright cyan accents' },
  { name: 'sky', label: 'Sky', family: 'blue', primary: '201 96% 46%', description: 'Lighter blue with soft azure' },
  { name: 'cobalt', label: 'Cobalt', family: 'blue', primary: '224 76% 48%', description: 'Bold saturated blue, corporate' },
  { name: 'sapphire', label: 'Sapphire', family: 'blue', primary: '234 89% 54%', description: 'Rich jewel-tone blue-purple' },
  { name: 'steel', label: 'Steel', family: 'blue', primary: '215 20% 50%', description: 'Desaturated blue-gray, industrial' },
  { name: 'arctic', label: 'Arctic', family: 'blue', primary: '199 80% 62%', description: 'Icy pale blue, minimal' },

  // Green Family
  { name: 'forest', label: 'Forest', family: 'green', primary: '152 76% 30%', description: 'Deep emerald with warm undertones' },
  { name: 'mint', label: 'Mint', family: 'green', primary: '162 63% 49%', description: 'Fresh light green, friendly' },
  { name: 'sage', label: 'Sage', family: 'green', primary: '143 20% 48%', description: 'Muted olive green, calm' },
  { name: 'emerald', label: 'Emerald', family: 'green', primary: '160 84% 39%', description: 'Vivid green, energetic' },
  { name: 'lime', label: 'Lime', family: 'green', primary: '82 77% 44%', description: 'Bright yellow-green, playful' },
  { name: 'pine', label: 'Pine', family: 'green', primary: '156 40% 25%', description: 'Dark forest green, grounded' },

  // Teal and Cyan Family
  { name: 'teal', label: 'Teal', family: 'teal', primary: '174 72% 40%', description: 'Balanced blue-green, modern' },
  { name: 'cyan', label: 'Cyan', family: 'teal', primary: '186 94% 45%', description: 'Bright pure cyan, technical' },
  { name: 'aqua', label: 'Aqua', family: 'teal', primary: '180 55% 45%', description: 'Softer teal with more blue' },
  { name: 'turquoise', label: 'Turquoise', family: 'teal', primary: '170 65% 43%', description: 'Warm teal, tropical' },
  { name: 'verdigris', label: 'Verdigris', family: 'teal', primary: '176 35% 45%', description: 'Aged teal, sophisticated' },

  // Purple Family
  { name: 'violet', label: 'Violet', family: 'purple', primary: '263 70% 58%', description: 'Classic purple, creative' },
  { name: 'lavender', label: 'Lavender', family: 'purple', primary: '270 50% 65%', description: 'Soft light purple, gentle' },
  { name: 'grape', label: 'Grape', family: 'purple', primary: '271 81% 40%', description: 'Deep saturated purple, rich' },
  { name: 'amethyst', label: 'Amethyst', family: 'purple', primary: '256 65% 52%', description: 'Jewel-tone blue-purple' },
  { name: 'plum', label: 'Plum', family: 'purple', primary: '292 45% 40%', description: 'Warm purple-red, bold' },
  { name: 'indigo', label: 'Indigo', family: 'purple', primary: '245 58% 50%', description: 'Deep blue-purple, serious' },

  // Red and Pink Family
  { name: 'rose', label: 'Rose', family: 'red', primary: '346 77% 52%', description: 'Soft pink-red, warm' },
  { name: 'crimson', label: 'Crimson', family: 'red', primary: '348 83% 47%', description: 'Bold true red, powerful' },
  { name: 'coral', label: 'Coral', family: 'red', primary: '16 80% 58%', description: 'Warm orange-pink, modern' },
  { name: 'ruby', label: 'Ruby', family: 'red', primary: '350 72% 40%', description: 'Deep jewel red, premium' },
  { name: 'blush', label: 'Blush', family: 'red', primary: '340 55% 65%', description: 'Very soft pink, delicate' },
  { name: 'cherry', label: 'Cherry', family: 'red', primary: '338 78% 48%', description: 'Bright vivid red-pink' },

  // Orange and Warm Family
  { name: 'amber', label: 'Amber', family: 'orange', primary: '38 92% 50%', description: 'Warm golden orange, optimistic' },
  { name: 'tangerine', label: 'Tangerine', family: 'orange', primary: '24 95% 53%', description: 'Bright orange, attention-grabbing' },
  { name: 'peach', label: 'Peach', family: 'orange', primary: '24 70% 65%', description: 'Soft warm orange, gentle' },
  { name: 'copper', label: 'Copper', family: 'orange', primary: '20 55% 42%', description: 'Deep burnt orange, rustic' },
  { name: 'honey', label: 'Honey', family: 'orange', primary: '42 85% 48%', description: 'Warm yellow-orange, inviting' },

  // Yellow and Gold Family
  { name: 'gold', label: 'Gold', family: 'yellow', primary: '45 86% 48%', description: 'Rich metallic gold, premium' },
  { name: 'sunflower', label: 'Sunflower', family: 'yellow', primary: '48 96% 50%', description: 'Bright pure yellow, cheerful' },
  { name: 'canary', label: 'Canary', family: 'yellow', primary: '52 80% 55%', description: 'Soft light yellow, optimistic' },
  { name: 'saffron', label: 'Saffron', family: 'yellow', primary: '40 90% 45%', description: 'Deep warm yellow-orange, exotic' },

  // Neutral Family
  { name: 'slate', label: 'Slate', family: 'neutral', primary: '215 16% 47%', description: 'Cool blue-gray, professional default' },
  { name: 'zinc', label: 'Zinc', family: 'neutral', primary: '240 4% 46%', description: 'Pure neutral gray, truly neutral' },
  { name: 'stone', label: 'Stone', family: 'neutral', primary: '25 6% 45%', description: 'Warm gray, earthy' },
  { name: 'graphite', label: 'Graphite', family: 'neutral', primary: '0 0% 25%', description: 'Very dark near-black, dramatic' },
  { name: 'silver', label: 'Silver', family: 'neutral', primary: '210 10% 58%', description: 'Light cool gray, elegant' },
  { name: 'charcoal', label: 'Charcoal', family: 'neutral', primary: '220 9% 35%', description: 'Medium-dark gray, modern' },

  // Specialty Themes
  { name: 'neon', label: 'Neon', family: 'specialty', primary: '150 100% 50%', description: 'Electric neon green, cyberpunk' },
  { name: 'synthwave', label: 'Synthwave', family: 'specialty', primary: '300 100% 65%', description: 'Purple-pink, retro-futuristic' },
  { name: 'sunset', label: 'Sunset', family: 'specialty', primary: '350 80% 55%', description: 'Orange to pink, dramatic' },
  { name: 'aurora', label: 'Aurora', family: 'specialty', primary: '170 70% 45%', description: 'Teal to purple, northern lights' },
  { name: 'monochrome', label: 'Monochrome', family: 'specialty', primary: '0 0% 0%', description: 'Pure black and white, maximum contrast' },
  { name: 'earth', label: 'Earth', family: 'specialty', primary: '30 40% 38%', description: 'Warm browns and greens, natural' },
  { name: 'midnight', label: 'Midnight', family: 'specialty', primary: '230 60% 50%', description: 'Very dark blue-black, immersive' },
  { name: 'frost', label: 'Frost', family: 'specialty', primary: '200 70% 70%', description: 'Ice blue and white, crisp' },
  { name: 'sand', label: 'Sand', family: 'specialty', primary: '35 45% 50%', description: 'Warm beige and tan, desert' },
  { name: 'terminal', label: 'Terminal', family: 'specialty', primary: '120 100% 40%', description: 'Black with green text, hacker' },
  { name: 'paper', label: 'Paper', family: 'specialty', primary: '20 15% 30%', description: 'Warm off-white, book-like' },
]

/** All theme names as an array */
export const themeNames = themes.map((t) => t.name)

/** Themes grouped by family */
export const themeFamilies: Record<ThemeFamily, ThemeDefinition[]> =
  themes.reduce(
    (acc, theme) => {
      if (!acc[theme.family]) {
        acc[theme.family] = []
      }
      acc[theme.family].push(theme)
      return acc
    },
    {} as Record<ThemeFamily, ThemeDefinition[]>,
  )
