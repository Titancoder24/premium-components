import { describe, it, expect } from 'vitest'
import { themes, themeNames, themeFamilies } from '../themes'

describe('Theme Registry', () => {
  it('exports themes as an array', () => {
    expect(themes).toBeDefined()
    expect(Array.isArray(themes)).toBe(true)
  })

  it('has at least 50 themes', () => {
    expect(themes.length).toBeGreaterThanOrEqual(50)
  })

  it('exports themeNames as an array', () => {
    expect(Array.isArray(themeNames)).toBe(true)
    expect(themeNames.length).toBeGreaterThanOrEqual(50)
  })

  it('exports themeFamilies', () => {
    expect(themeFamilies).toBeDefined()
    expect(Object.keys(themeFamilies).length).toBeGreaterThan(0)
  })

  it('every theme has required fields', () => {
    for (const theme of themes) {
      expect(theme.name, `Theme missing "name"`).toBeDefined()
      expect(theme.label, `Theme "${theme.name}" missing "label"`).toBeDefined()
      expect(theme.family, `Theme "${theme.name}" missing "family"`).toBeDefined()
      expect(theme.primary, `Theme "${theme.name}" missing "primary"`).toBeDefined()
      expect(theme.description, `Theme "${theme.name}" missing "description"`).toBeDefined()
    }
  })

  it('theme names match themes array names', () => {
    const namesFromArray = themes.map((t) => t.name)
    expect(new Set(themeNames)).toEqual(new Set(namesFromArray))
  })

  it('each theme family has at least one theme', () => {
    for (const [family, members] of Object.entries(themeFamilies)) {
      expect(
        members.length,
        `Theme family "${family}" is empty`,
      ).toBeGreaterThan(0)
    }
  })

  it('all family members reference valid themes', () => {
    const allThemeNames = new Set(themes.map((t) => t.name))
    for (const [family, members] of Object.entries(themeFamilies)) {
      for (const member of members) {
        expect(
          allThemeNames.has(member.name),
          `Theme "${member.name}" in family "${family}" not found in themes`,
        ).toBe(true)
      }
    }
  })

  it('primary color values are valid HSL format', () => {
    const sampleThemes = themes.slice(0, 10)
    for (const theme of sampleThemes) {
      // HSL values should be numbers separated by spaces like "199 89% 48%"
      expect(theme.primary).toMatch(/^\d+(\.\d+)?\s+\d+(\.\d+)?%\s+\d+(\.\d+)?%$/)
    }
  })

  it('theme families cover all expected groups', () => {
    const expectedFamilies = ['blue', 'green', 'teal', 'purple', 'red', 'orange', 'yellow', 'neutral', 'specialty']
    for (const family of expectedFamilies) {
      expect(themeFamilies).toHaveProperty(family)
    }
  })
})
