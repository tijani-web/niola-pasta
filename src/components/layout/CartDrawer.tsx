'use client'

import { useEffect, useState } from 'react'
import { useCartStore } from '@/store/useCartStore'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export function CartDrawer() {
  const { isOpen, setIsOpen, items, removeItem, updateQuantity, getSubtotal } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent background scrolling when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!mounted) return null

  const subtotal = getSubtotal()

  const handleCheckout = () => {
    setIsOpen(false)
    router.push('/checkout')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-background shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-primary/10">
              <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Your Order
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-foreground/70 hover:text-accent hover:bg-accent/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-foreground/60 space-y-4">
                  <ShoppingBag className="w-16 h-16 opacity-20" />
                  <p className="text-lg font-medium">Your cart is empty</p>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="text-accent hover:underline"
                  >
                    Browse our menu
                  </button>
                </div>
              ) : (
                <ul className="space-y-6">
                  {items.map((item) => (
                    <li key={item.cartItemId} className="flex gap-4">
                      {/* Image */}
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-primary/5 flex-shrink-0">
                        {item.imageUrl ? (
                          <Image 
                            src={item.imageUrl} 
                            alt={item.name} 
                            fill 
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-primary/20">
                            <ShoppingBag className="w-8 h-8" />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-foreground leading-tight">{item.name}</h3>
                            <button 
                              onClick={() => removeItem(item.cartItemId)}
                              className="text-foreground/40 hover:text-accent"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          
                          {/* Variant & Extras */}
                          <div className="text-sm text-foreground/70 mt-1 space-y-0.5">
                            {item.variant && <p>Choice: <span className="font-medium text-foreground">{item.variant}</span></p>}
                            {item.extras && item.extras.length > 0 && (
                              <p>Extras: {item.extras.map(e => e.name).join(', ')}</p>
                            )}
                          </div>
                        </div>

                        {/* Price & Quantity */}
                        <div className="flex items-center justify-between mt-3">
                          <p className="font-bold text-accent">
                            ₦{((item.price + (item.extras?.reduce((sum, e) => sum + e.price, 0) || 0)) * item.quantity).toLocaleString()}
                          </p>
                          
                          <div className="flex items-center gap-3 bg-primary/5 rounded-full px-2 py-1">
                            <button 
                              onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white text-primary hover:shadow-sm transition-all"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white text-primary hover:shadow-sm transition-all"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 bg-white border-t border-primary/10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-foreground/80">
                    <span>Subtotal</span>
                    <span>₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-accent">
                    <span>Delivery Fee</span>
                    <span>Paid to rider on delivery</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-3 border-t border-primary/10 text-primary">
                    <span>Total (Food Only)</span>
                    <span>₦{subtotal.toLocaleString()}</span>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  className="w-full bg-accent hover:bg-accent/90 text-white font-medium py-4 px-6 rounded-xl flex items-center justify-between transition-all transform hover:scale-[1.02] active:scale-95 shadow-md hover:shadow-lg"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
