import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

// Navigate and wait for Astro island hydration to settle.
// client:load islands hydrate asynchronously after JS loads.
async function gotoAndHydrate(page: Page, url: string) {
  await page.goto(url)
  await page.waitForLoadState('networkidle')
}

test.describe('Dark Mode', () => {
  test.describe('system preference', () => {
    test('defaults to light when system prefers light', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'light' })
      await page.goto('/')
      const html = page.locator('html')
      await expect(html).not.toHaveClass(/dark/)
    })

    test('defaults to dark when system prefers dark', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark' })
      await page.goto('/')
      const html = page.locator('html')
      await expect(html).toHaveClass(/dark/)
    })
  })

  test.describe('toggle', () => {
    test('switches from light to dark', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'light' })
      await gotoAndHydrate(page, '/')

      const toggle = page.getByRole('button', { name: 'Toggle theme' })
      await toggle.click()

      await expect(page.locator('html')).toHaveClass(/dark/)
    })

    test('switches from dark to light', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark' })
      await gotoAndHydrate(page, '/')

      const toggle = page.getByRole('button', { name: 'Toggle theme' })
      await toggle.click()

      await expect(page.locator('html')).not.toHaveClass(/dark/)
    })
  })

  test.describe('persistence', () => {
    test('updates localStorage after toggle', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'light' })
      await gotoAndHydrate(page, '/')

      const toggle = page.getByRole('button', { name: 'Toggle theme' })
      await toggle.click()

      // toHaveClass auto-retries, absorbing any hydration delay
      await expect(page.locator('html')).toHaveClass(/dark/)

      const stored = await page.evaluate(
        () => localStorage.getItem('theme'),
      )
      expect(stored).toBe('dark')
    })

    test('persists theme after page reload', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'light' })
      await gotoAndHydrate(page, '/')

      const toggle = page.getByRole('button', { name: 'Toggle theme' })
      await toggle.click()

      await expect(page.locator('html')).toHaveClass(/dark/)

      await page.reload()

      await expect(page.locator('html')).toHaveClass(/dark/)
      const stored = await page.evaluate(
        () => localStorage.getItem('theme'),
      )
      expect(stored).toBe('dark')
    })

    test('persists theme across navigation (View Transitions)', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'light' })
      await gotoAndHydrate(page, '/')

      const toggle = page.getByRole('button', { name: 'Toggle theme' })
      await toggle.click()

      await expect(page.locator('html')).toHaveClass(/dark/)

      // Target the desktop <nav> link specifically — the homepage
      // also has a "more posts" link to /posts outside the nav
      await page.locator('nav a[href="/posts"]').click()
      await page.waitForURL('**/posts')

      await expect(page.locator('html')).toHaveClass(/dark/)
    })

    test('stored theme overrides system preference', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'light' })
      await page.goto('/')

      // Manually set dark in localStorage, then reload
      await page.evaluate(
        () => localStorage.setItem('theme', 'dark'),
      )
      await page.reload()

      await expect(page.locator('html')).toHaveClass(/dark/)
    })
  })

  test.describe('reduced motion', () => {
    test('skips view transition animation but still toggles', async ({ page }) => {
      await page.emulateMedia({
        colorScheme: 'light',
        reducedMotion: 'reduce',
      })
      await gotoAndHydrate(page, '/')

      const toggle = page.getByRole('button', { name: 'Toggle theme' })
      await toggle.click()

      // Theme should still change
      await expect(page.locator('html')).toHaveClass(/dark/)

      // The theme-transition class (used for the radial animation)
      // should NOT be present when reduced motion is preferred
      await expect(page.locator('html')).not.toHaveClass(
        /theme-transition/,
      )
    })
  })
})
