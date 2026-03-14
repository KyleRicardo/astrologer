import { expect, test } from '@playwright/test'

const MOBILE = { width: 375, height: 812 }
const DESKTOP = { width: 1024, height: 768 }

test.describe('Mobile Menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(MOBILE)
    await page.goto('/')
  })

  test.describe('open and close', () => {
    test('opens on trigger click and closes on second click', async ({ page }) => {
      const trigger = page.getByRole('button', {
        name: /navigation|导航/i,
      })
      const menu = page.locator('#mobile-menu')

      await expect(menu).not.toBeVisible()
      await expect(trigger).toHaveAttribute('aria-expanded', 'false')

      await trigger.click()

      await expect(menu).toBeVisible()
      await expect(trigger).toHaveAttribute('aria-expanded', 'true')

      await trigger.click()

      await expect(menu).not.toBeVisible()
      await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    })

    test('closes on Escape and returns focus to trigger', async ({ page }) => {
      const trigger = page.getByRole('button', {
        name: /navigation|导航/i,
      })
      const menu = page.locator('#mobile-menu')

      await trigger.click()
      await expect(menu).toBeVisible()

      await page.keyboard.press('Escape')

      await expect(menu).not.toBeVisible()
      await expect(trigger).toBeFocused()
    })
  })

  test.describe('link click', () => {
    test('closes menu and navigates when a link is clicked', async ({ page }) => {
      const trigger = page.getByRole('button', {
        name: /navigation|导航/i,
      })

      await trigger.click()

      // Click the Blog link inside the mobile menu
      await page.locator('#mobile-menu a[href="/posts"]').click()
      await page.waitForURL('**/posts')

      const menu = page.locator('#mobile-menu')
      await expect(menu).not.toBeVisible()
    })
  })

  test.describe('breakpoint auto-close', () => {
    test('closes menu when viewport crosses md breakpoint', async ({ page }) => {
      const trigger = page.getByRole('button', {
        name: /navigation|导航/i,
      })
      const menu = page.locator('#mobile-menu')

      await trigger.click()
      await expect(menu).toBeVisible()

      await page.setViewportSize(DESKTOP)

      await expect(menu).not.toBeVisible()
    })
  })

  test.describe('body scroll lock', () => {
    test('locks body scroll when menu is open', async ({ page }) => {
      const trigger = page.getByRole('button', {
        name: /navigation|导航/i,
      })
      const html = page.locator('html')

      await trigger.click()

      await expect(html).toHaveCSS('overflow', 'hidden')

      await trigger.click()

      await expect(html).not.toHaveCSS('overflow', 'hidden')
    })
  })
})
