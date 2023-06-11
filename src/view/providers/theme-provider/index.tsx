import { useState, useEffect } from 'react'
import type { FC } from 'react'

import { ConfigProvider } from './config-provider'
import { ThemeTokenProvider } from './theme-token-provider'
import { ThemeContext } from './contexts'
import type { ThemeMode } from './types'

interface ThemeProviderProps {
  children: JSX.Element | Array<JSX.Element>
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('light')

  useEffect(() => {
    const handleSwitchTheme = (): void => {
      setMode(mode === 'light' ? 'dark' : 'light')
    }

    const unsubscribe = window.electron.onSwitchTheme(handleSwitchTheme)

    return () => unsubscribe()
  }, [mode])

  return (
    <ThemeContext.Provider value={mode}>
      <ConfigProvider>
        <ThemeTokenProvider>
          {children}
        </ThemeTokenProvider>
      </ConfigProvider>
    </ThemeContext.Provider>
  )
}
