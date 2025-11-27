import { useEffect, useRef } from 'react'
import { useMeshStore } from '@/store'

export function useTitleNotifications() {
  const unreadCount = useMeshStore((s) => s.unreadCount)
  const originalTitleRef = useRef<string>()
  const blinkIntervalRef = useRef<number | null>(null)

  // Remember the initial document title once
  useEffect(() => {
    originalTitleRef.current = document.title || 'Meshtastic'
  }, [])

  useEffect(() => {
    const clearBlink = () => {
      if (blinkIntervalRef.current !== null) {
        window.clearInterval(blinkIntervalRef.current)
        blinkIntervalRef.current = null
      }
    }

    const restoreTitle = () => {
      if (originalTitleRef.current) {
        document.title = originalTitleRef.current
      }
    }

    const startBlink = () => {
      const original = originalTitleRef.current || 'Meshtastic'
      const alertTitle = `(${unreadCount}) Новые сообщения`
      let showAlert = false

      clearBlink()
      blinkIntervalRef.current = window.setInterval(() => {
        showAlert = !showAlert
        document.title = showAlert ? alertTitle : original
      }, 1200)
    }

    const updateTitle = () => {
      const isHidden = document.visibilityState === 'hidden' || !document.hasFocus()

      if (unreadCount > 0 && isHidden) {
        startBlink()
      } else {
        clearBlink()
        if (unreadCount > 0) {
          document.title = `(${unreadCount}) ${originalTitleRef.current || 'Meshtastic'}`
        } else {
          restoreTitle()
        }
      }
    }

    updateTitle()

    const handleVisibility = () => updateTitle()
    const handleFocus = () => updateTitle()
    const handleBlur = () => updateTitle()

    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)

    return () => {
      clearBlink()
      restoreTitle()
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
    }
  }, [unreadCount])
}
