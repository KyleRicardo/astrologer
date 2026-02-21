import * as React from "react"
import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const [theme, setThemeState] = React.useState<"light" | "dark">("light")
  
  React.useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark")
    setThemeState(isDarkMode ? "dark" : "light")
  }, [])
  
  const toggleTheme = (event: React.MouseEvent) => {
    const isDark = theme === "dark"
    const nextTheme = isDark ? "light" : "dark"

    // @ts-expect-error experimental API
    const isAppearanceTransition = document.startViewTransition
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!isAppearanceTransition) {
      setThemeState(nextTheme)
      applyTheme(nextTheme)
      return
    }

    const x = event.clientX
    const y = event.clientY
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    )

    document.documentElement.classList.add('theme-transition')

    const transition = document.startViewTransition(() => {
      setThemeState(nextTheme)
      applyTheme(nextTheme)
    })

    transition.ready.then(() => {
      const root = document.documentElement
      root.style.setProperty('--x', `${x}px`)
      root.style.setProperty('--y', `${y}px`)
      root.style.setProperty('--mask-radius', '0px')

      // 动画：从 0 扩散到覆盖整个屏幕
      root.animate(
        {
          '--mask-radius': `${endRadius}px`
        },
        {
          duration: 500,
          easing: 'ease-out',
          fill: 'both',
          pseudoElement: '::view-transition-new(root)'
        }
      )
    })

    transition.finished.then(() => {
      const root = document.documentElement
      root.classList.remove('theme-transition')
      root.style.removeProperty('--x')
      root.style.removeProperty('--y')
      root.style.removeProperty('--mask-radius')
    })


  }

  const applyTheme = (newTheme: "light" | "dark") => {
    const isDark = newTheme === "dark"
    document.documentElement.classList[isDark ? "add" : "remove"]("dark")
    localStorage.setItem("theme", newTheme)
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggleTheme}
      className="cursor-pointer"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
