import { useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'

const THEME_KEY = 'portfolio-theme'

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark' | 'system'>(THEME_KEY, 'system')

  useEffect(() => {
    const root = window.document.documentElement
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const resolvedTheme = theme === 'system' ? (systemPrefersDark ? 'dark' : 'light') : theme

    root.classList.toggle('dark', resolvedTheme === 'dark')
  }, [theme])

  const toggleTheme = () => {
    setTheme((currentTheme) => {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const currentResolvedTheme =
        currentTheme === 'system' ? (systemPrefersDark ? 'dark' : 'light') : currentTheme
      return currentResolvedTheme === 'dark' ? 'light' : 'dark'
    })
  }

  return { theme, setTheme, toggleTheme }
}