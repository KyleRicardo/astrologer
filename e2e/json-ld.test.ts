import { expect, test } from '@playwright/test'

test.describe('JSON-LD Structured Data', () => {
  test.describe('homepage', () => {
    test('has WebSite schema with correct fields', async ({ page }) => {
      await page.goto('/')
      const jsonLd = await getJsonLd(page)
      expect(jsonLd['@context']).toBe('https://schema.org')
      expect(jsonLd['@type']).toBe('WebSite')
      expect(jsonLd).toHaveProperty('name')
      expect(jsonLd).toHaveProperty('url')
      expect(jsonLd).toHaveProperty('description')
      expect(jsonLd).toHaveProperty('inLanguage')
      expect(jsonLd).toHaveProperty('author')
      expect(jsonLd.author['@type']).toBe('Person')
      expect(jsonLd.author).toHaveProperty('name')
    })

    test('has correct schema for English homepage', async ({ page }) => {
      await page.goto('/en/')
      const jsonLd = await getJsonLd(page)
      expect(jsonLd['@type']).toBe('WebSite')
      expect(jsonLd.inLanguage).toBe('en')
    })
  })

  test.describe('blog post', () => {
    test('has BlogPosting schema with required fields', async ({ page }) => {
      await page.goto('/posts/getting-started-with-astrologer')
      const jsonLd = await getJsonLd(page)
      expect(jsonLd['@context']).toBe('https://schema.org')
      expect(jsonLd['@type']).toBe('BlogPosting')
      expect(jsonLd).toHaveProperty('headline')
      expect(jsonLd).toHaveProperty('description')
      expect(jsonLd).toHaveProperty('datePublished')
      expect(jsonLd).toHaveProperty('dateModified')
      expect(jsonLd).toHaveProperty('image')
      expect(jsonLd).toHaveProperty('mainEntityOfPage')
      expect(jsonLd.author['@type']).toBe('Person')
    })

    test('includes category and keywords when present', async ({ page }) => {
      await page.goto('/posts/getting-started-with-astrologer')
      const jsonLd = await getJsonLd(page)
      expect(jsonLd).toHaveProperty('articleSection')
      expect(jsonLd).toHaveProperty('keywords')
    })

    test('uses absolute URLs for image and mainEntityOfPage', async ({ page }) => {
      await page.goto('/posts/getting-started-with-astrologer')
      const jsonLd = await getJsonLd(page)
      expect(jsonLd.image).toMatch(/^https?:\/\//)
      expect(jsonLd.mainEntityOfPage).toMatch(/^https?:\/\//)
    })
  })

  test.describe('project page', () => {
    test('has SoftwareSourceCode schema with required fields', async ({ page }) => {
      await page.goto('/projects/astrologer')
      const jsonLd = await getJsonLd(page)
      expect(jsonLd['@context']).toBe('https://schema.org')
      expect(jsonLd['@type']).toBe('SoftwareSourceCode')
      expect(jsonLd).toHaveProperty('name')
      expect(jsonLd).toHaveProperty('description')
      expect(jsonLd).toHaveProperty('datePublished')
      expect(jsonLd).toHaveProperty('dateModified')
      expect(jsonLd).toHaveProperty('image')
      expect(jsonLd).toHaveProperty('mainEntityOfPage')
      expect(jsonLd.author['@type']).toBe('Person')
    })
  })
})

async function getJsonLd(page: import('@playwright/test').Page) {
  const content = await page
    .locator('script[type="application/ld+json"]')
    .textContent()
  expect(content).toBeTruthy()
  return JSON.parse(content!)
}
