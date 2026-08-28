'use client'

import dynamic from 'next/dynamic'

const CheckoutForm = dynamic(() => import('@/components/checkout/CheckoutForm'), {
  ssr: false,
})

export function DynamicCheckoutForm() {
  return <CheckoutForm />
}
