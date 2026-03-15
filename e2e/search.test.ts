import { expect, test } from '@playwright/test'

const DESKTOP = { width: 1024, height: 768 }

test.describe('Search', () => {
  test.describe('open and close', () => {
    test('opens on Cmd+K and closes on Escape', async ({ page }) => {
      await page.goto('/')
      const dialog = page.locator('#search-dialog')
      await expect(dialog).not.toBeVisible()

      await page.keyboard.press('Meta+k')
      await expect(dialog).toBeVisible()
      await expect(page.locator('#search-input')).toBeFocused()

      await page.keyboard.press('Escape')
      await expect(dialog).not.toBeVisible()
    })

    test('opens on Ctrl+K', async ({ page }) => {
      await page.goto('/')
      await page.keyboard.press('Control+k')
      await expect(page.locator('#search-dialog')).toBeVisible()
    })

    test('opens on desktop search button click', async ({ page }) => {
      await page.setViewportSize(DESKTOP)
      await page.goto('/')
      await page.locator('[data-search-trigger]').first().click()
      await expect(page.locator('#search-dialog')).toBeVisible()
    })

    test('closes on backdrop click', async ({ page }) => {
      await page.goto('/')
      await page.keyboard.press('Meta+k')
      await expect(page.locator('#search-dialog')).toBeVisible()

      // Click outside the dialog panel (top-left corner)
      await page.mouse.click(5, 5)
      await expect(page.locator('#search-dialog')).not.toBeVisible()
    })

    test('Cmd+K toggles dialog', async ({ page }) => {
      await page.goto('/')

      await page.keyboard.press('Meta+k')
      await expect(page.locator('#search-dialog')).toBeVisible()

      await page.keyboard.press('Meta+k')
      await expect(page.locator('#search-dialog')).not.toBeVisible()
    })
  })

  test.describe('search functionality', () => {
    test('returns results for a known term', async ({ page }) => {
      await page.goto('/')
      await page.keyboard.press('Meta+k')
      await page.locator('#search-input').fill('Astro')

      await page.waitForSelector('.search-result', { timeout: 10000 })
      const results = page.locator('.search-result')
      await expect(results.first()).toBeVisible()
    })

    test('shows no results for gibberish', async ({ page }) => {
      await page.goto('/')
      await page.keyboard.press('Meta+k')
      await page.locator('#search-input').fill('xyzzyspoon123456')

      await expect(
        page.locator('#search-no-results'),
      ).toBeVisible({ timeout: 10000 })
    })

    test('clears results when input is emptied', async ({ page }) => {
      await page.goto('/')
      await page.keyboard.press('Meta+k')
      await page.locator('#search-input').fill('Astro')
      await page.waitForSelector('.search-result', { timeout: 10000 })

      await page.locator('#search-input').fill('')
      // Wait for debounce
      await page.waitForTimeout(300)
      await expect(page.locator('#search-empty')).toBeVisible()
      await expect(page.locator('.search-result')).toHaveCount(0)
    })
  })

  test.describe('keyboard navigation', () => {
    test('arrow keys cycle through results', async ({ page }) => {
      await page.goto('/')
      await page.keyboard.press('Meta+k')
      await page.locator('#search-input').fill('Astro')
      await page.waitForSelector('.search-result', { timeout: 10000 })

      const first = page.locator('.search-result').first()
      await expect(first).toHaveAttribute('aria-selected', 'true')

      await page.keyboard.press('ArrowDown')
      const second = page.locator('.search-result').nth(1)
      await expect(second).toHaveAttribute('aria-selected', 'true')
      await expect(first).toHaveAttribute('aria-selected', 'false')

      await page.keyboard.press('ArrowUp')
      await expect(first).toHaveAttribute('aria-selected', 'true')
    })

    test('Enter navigates to selected result', async ({ page }) => {
      await page.goto('/')
      await page.keyboard.press('Meta+k')
      await page.locator('#search-input').fill('Astro')
      await page.waitForSelector('.search-result', { timeout: 10000 })

      await page.keyboard.press('Enter')
      await page.waitForURL(/\/posts\/|\/projects\//)
    })
  })

  test.describe('filter tabs', () => {
    test('filters narrow results by type', async ({ page }) => {
      await page.goto('/')
      await page.keyboard.press('Meta+k')
      await page.locator('#search-input').fill('Astro')
      await page.waitForSelector('.search-result', { timeout: 10000 })

      const allCount = await page.locator('.search-result').count()

      // Click Projects tab
      await page.locator('.search-tab[data-filter="project"]').click()
      // Wait for re-search
      await page.waitForTimeout(300)

      const projectCount = await page.locator('.search-result').count()
      expect(projectCount).toBeLessThanOrEqual(allCount)

      // Click All tab to restore
      await page.locator('.search-tab[data-filter="all"]').click()
      await page.waitForTimeout(300)
      const restoredCount = await page.locator('.search-result').count()
      expect(restoredCount).toBe(allCount)
    })
  })

  test.describe('view transitions', () => {
    test('search works after client navigation', async ({ page }) => {
      await page.goto('/')

      // Navigate to posts page
      const postsLink = page.locator(
        'nav:not(#mobile-menu) a[href="/posts"]',
      )
      await postsLink.click()
      await page.waitForURL('**/posts')

      // Search should still work on the new page
      await page.keyboard.press('Meta+k')
      await expect(page.locator('#search-dialog')).toBeVisible()

      await page.locator('#search-input').fill('Astro')
      await page.waitForSelector('.search-result', { timeout: 10000 })
      await expect(page.locator('.search-result').first()).toBeVisible()
    })
  })
})
