'use client'

import { useEffect } from 'react'
import { useCartStore } from '@/store/useCartStore'

export function ClearCartOnMount() {
  const { clearCart } = useCartStore()

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return null
}
