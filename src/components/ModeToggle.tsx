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

    // @ts-ignore
    if (!document.startViewTransition) {
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

    document.documentElement.style.setProperty("--mask-x", `${x}px`)
    document.documentElement.style.setProperty("--mask-y", `${y}px`)

    document.documentElement.classList.add("theme-transition")

    // @ts-ignore
    const transition = document.startViewTransition(() => {
      setThemeState(nextTheme)
      applyTheme(nextTheme)
    })

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          "--mask-radius": isDark ? ["100%", "0%"] : ["0%", "100%"],
        },
        {
          duration: 500,
          easing: "ease-in-out",
          pseudoElement: isDark
            ? "::view-transition-old(root)"
            : "::view-transition-new(root)",
        }
      )
    })

    transition.finished.then(() => {
      document.documentElement.classList.remove("theme-transition")
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
