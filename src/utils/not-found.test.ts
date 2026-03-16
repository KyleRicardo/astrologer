import { describe, expect, it } from 'vitest'

import { get404LangFromPathname } from './not-found'

describe('get404LangFromPathname', () => {
  it('returns the default language for root-level missing routes', () => {
    expect(get404LangFromPathname('/missing-page')).toBe('zh')
  })

  it('returns the locale prefix for prefixed missing routes', () => {
    expect(get404LangFromPathname('/en/missing-page')).toBe('en')
  })

  it('falls back to the default language for unknown prefixes', () => {
    expect(get404LangFromPathname('/fr/missing-page')).toBe('zh')
  })

  it('keeps the default language when the default locale is prefixed', () => {
    expect(get404LangFromPathname('/zh/missing-page')).toBe('zh')
  })
})
