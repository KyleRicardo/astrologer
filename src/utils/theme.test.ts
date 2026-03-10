import { describe, expect, it } from 'vitest'

import {
  calculateEndRadius,
  getNextTheme,
  getThemePreference,
  supportsViewTransition,
} from './theme'

describe('getThemePreference', () => {
  it('returns "dark" when stored value is "dark"', () => {
    expect(getThemePreference('dark', false)).toBe('dark')
  })

  it('returns "light" when stored value is "light"', () => {
    expect(getThemePreference('light', true)).toBe('light')
  })

  it('falls back to system dark preference when no stored value', () => {
    expect(getThemePreference(null, true)).toBe('dark')
  })

  it('falls back to system light preference when no stored value', () => {
    expect(getThemePreference(null, false)).toBe('light')
  })

  it('ignores invalid stored values and falls back to system', () => {
    expect(getThemePreference('blue', true)).toBe('dark')
    expect(getThemePreference('blue', false)).toBe('light')
    expect(getThemePreference('', false)).toBe('light')
  })
})

describe('getNextTheme', () => {
  it('returns "dark" when current is "light"', () => {
    expect(getNextTheme('light')).toBe('dark')
  })

  it('returns "light" when current is "dark"', () => {
    expect(getNextTheme('dark')).toBe('light')
  })
})

describe('calculateEndRadius', () => {
  it('computes radius from top-left corner', () => {
    // Click at (0,0) on 1920x1080 → farthest corner is (1920,1080)
    const r = calculateEndRadius(0, 0, 1920, 1080)
    expect(r).toBeCloseTo(Math.hypot(1920, 1080))
  })

  it('computes radius from center of viewport', () => {
    // Click at center → distance to any corner is equal
    const r = calculateEndRadius(960, 540, 1920, 1080)
    expect(r).toBeCloseTo(Math.hypot(960, 540))
  })

  it('computes radius from bottom-right corner', () => {
    const r = calculateEndRadius(1920, 1080, 1920, 1080)
    expect(r).toBeCloseTo(Math.hypot(1920, 1080))
  })

  it('computes radius from an off-center point', () => {
    // Click at (200, 100) on 1920x1080
    // max(200, 1720) = 1720, max(100, 980) = 980
    const r = calculateEndRadius(200, 100, 1920, 1080)
    expect(r).toBeCloseTo(Math.hypot(1720, 980))
  })

  it('handles zero-dimension viewport', () => {
    expect(calculateEndRadius(0, 0, 0, 0)).toBe(0)
  })
})

describe('supportsViewTransition', () => {
  it('returns true when API available and no reduced motion', () => {
    expect(supportsViewTransition(true, false)).toBe(true)
  })

  it('returns false when API available but reduced motion', () => {
    expect(supportsViewTransition(true, true)).toBe(false)
  })

  it('returns false when API unavailable', () => {
    expect(supportsViewTransition(false, false)).toBe(false)
  })

  it('returns false when both unavailable and reduced motion', () => {
    expect(supportsViewTransition(false, true)).toBe(false)
  })
})
