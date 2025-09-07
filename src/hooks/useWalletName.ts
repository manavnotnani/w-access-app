import { useState, useEffect } from 'react'
import { walletService } from '@/lib/database'

export const useWalletName = (walletName: string) => {
  const [isChecking, setIsChecking] = useState(false)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!walletName) {
      setIsAvailable(null)
      setError(null)
      return
    }

    // Reset state
    setIsChecking(true)
    setIsAvailable(null)
    setError(null)

    // Debounce the check
    const timeoutId = setTimeout(async () => {
      try {
        const available = await walletService.checkNameAvailability(walletName)
        setIsAvailable(available)
      } catch (err) {
        console.error('Error checking wallet name availability:', err)
        setError('Failed to check availability')
        setIsAvailable(false)
      } finally {
        setIsChecking(false)
      }
    }, 500) // 500ms debounce

    return () => clearTimeout(timeoutId)
  }, [walletName])

  return {
    isChecking,
    isAvailable,
    error
  }
} 