/**
 * Scroll Reveal — Global IntersectionObserver for fade-in-up animations.
 *
 * Usage:
 *   - Add `data-reveal` to any element to animate it on scroll.
 *   - Add `data-reveal-stagger` to a container to auto-assign stagger
 *     delays to all descendant elements that have `data-reveal`.
 *
 * Respects `prefers-reduced-motion: reduce` by skipping observation
 * entirely (elements stay visible via CSS defaults).
 */

function initScrollReveal() {
  // Bail out if user prefers reduced motion — CSS keeps elements visible
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches
  if (prefersReducedMotion) return

  // Process stagger containers: assign --reveal-delay to children
  const staggerContainers = document.querySelectorAll<HTMLElement>(
    '[data-reveal-stagger]',
  )
  staggerContainers.forEach((container) => {
    const children = container.querySelectorAll<HTMLElement>(
      '[data-reveal]',
    )
    children.forEach((child, index) => {
      // Cap delay to avoid long waits on large lists
      const cappedIndex = Math.min(index, 16)
      child.style.setProperty(
        '--reveal-delay',
        `${cappedIndex * 60}ms`,
      )
    })
  })

  // Create observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement
          el.setAttribute('data-reveal', 'visible')
          observer.unobserve(el)
        }
      })
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px',
    },
  )

  // Observe all reveal elements
  const elements = document.querySelectorAll(
    '[data-reveal]:not([data-reveal="visible"])',
  )
  elements.forEach((el) => observer.observe(el))

  // Cleanup for View Transitions
  const cleanup = () => {
    observer.disconnect()
  }
  document.addEventListener('astro:before-swap', cleanup, { once: true })
}

document.addEventListener('astro:page-load', initScrollReveal)
