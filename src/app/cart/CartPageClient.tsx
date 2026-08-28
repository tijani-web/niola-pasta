'use client'

import { useEffect, useState } from 'react'
import { useCartStore } from '@/store/useCartStore'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

export default function CartPageClient() {
  const { items, updateQuantity, removeItem, getSubtotal, clearCart } = useCartStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const subtotal = getSubtotal()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 p-8">
        <div className="text-8xl">🍝</div>
        <h1 className="font-serif text-3xl font-bold text-primary">Your cart is empty</h1>
        <p className="text-foreground/60 max-w-sm text-center">
          Looks like you haven&apos;t added anything yet. Head over to the menu and pick your favourite plate!
        </p>
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-bold py-3.5 px-8 rounded-xl transition-all hover:scale-105 shadow-lg"
        >
          <ShoppingBag className="w-5 h-5" />
          Browse Menu
        </Link>
      </div>
    )
  }

  const EXTRAS = [
    { id: 'extra-plantain', name: 'Fried Plantain', price: 1000 },
    { id: 'extra-sausage', name: 'Sausage', price: 500 },
    { id: 'extra-egg', name: 'Boiled Egg', price: 500 },
    { id: 'extra-turkey', name: 'Extra Turkey', price: 2000 },
  ]

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-4xl font-bold text-primary">Your Cart</h1>
          <button onClick={clearCart} className="text-sm text-red-400 hover:text-red-600 font-medium transition-colors">
            Clear all
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items + Extras column */}
          <div className="lg:col-span-2 space-y-4">
            {/* Cart Items */}
            {items.map(item => {
              const extrasTotal = item.extras?.reduce((s, e) => s + e.price, 0) || 0
              const itemTotal = (item.price + extrasTotal) * item.quantity
              return (
                <div key={item.cartItemId} className="bg-white rounded-2xl border border-primary/10 shadow-sm p-4 flex gap-4 items-center">
                  {item.imageUrl ? (
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-3xl">🍝</div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground">{item.name}</h3>
                    {item.variant && <p className="text-sm text-foreground/60 mt-0.5">{item.variant}</p>}
                    {item.extras && item.extras.length > 0 && (
                      <p className="text-xs text-foreground/50 mt-0.5">
                        + {item.extras.map(e => `${e.name}${e.price > 0 ? ` (₦${e.price})` : ''}`).join(', ')}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center gap-2 bg-primary/5 rounded-full px-2 py-1">
                        <button
                          onClick={() => item.quantity > 1 ? updateQuantity(item.cartItemId, item.quantity - 1) : removeItem(item.cartItemId)}
                          className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white hover:shadow-sm transition-all text-primary"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-bold w-5 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white hover:shadow-sm transition-all text-primary"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button onClick={() => removeItem(item.cartItemId)} className="text-red-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-primary text-lg">₦{itemTotal.toLocaleString()}</p>
                    <p className="text-xs text-foreground/50 mt-0.5">₦{(item.price + extrasTotal).toLocaleString()} each</p>
                  </div>
                </div>
              )
            })}

            {/* Extra Toppings Upsell */}
            <div className="bg-white rounded-2xl border border-primary/10 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif font-bold text-xl text-primary">Extra Toppings</h2>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      const el = document.getElementById('cart-extras')
                      if (el) el.scrollBy({ left: -200, behavior: 'smooth' })
                    }}
                    className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      const el = document.getElementById('cart-extras')
                      if (el) el.scrollBy({ left: 200, behavior: 'smooth' })
                    }}
                    className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div
                id="cart-extras"
                className="flex overflow-x-auto gap-4 pb-2 snap-x"
                style={{ scrollbarWidth: 'none' } as React.CSSProperties}
              >
                {EXTRAS.map((extra) => (
                  <div
                    key={extra.id}
                    className="min-w-[200px] flex flex-col justify-between p-4 rounded-2xl border-2 border-primary/10 bg-white hover:border-primary/30 shadow-sm hover:shadow snap-start transition-all"
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-xl flex-shrink-0">
                        🥣
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-foreground leading-tight">{extra.name}</h4>
                        <p className="text-foreground/60 text-sm mt-1">₦{extra.price.toLocaleString()}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        useCartStore.getState().addItem({
                          menuItemId: extra.id,
                          name: extra.name,
                          price: extra.price,
                          quantity: 1,
                          imageUrl: null
                        })
                      }}
                      className="w-full py-2.5 rounded-xl text-sm font-bold bg-primary text-white hover:bg-accent transition-all"
                    >
                      + Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-primary/10 shadow-sm p-6 space-y-4 lg:sticky lg:top-28">
              <h2 className="font-serif font-bold text-xl text-primary">Order Summary</h2>

              <div className="space-y-2 text-sm text-foreground/70">
                <div className="flex justify-between">
                  <span>Food Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-foreground/50">
                  <span>Delivery Fee</span>
                  <span className="italic">Paid to rider</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-lg text-primary pt-3 border-t border-primary/10">
                <span>Total</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700 leading-relaxed">
                Delivery fee is <strong>not included</strong> — you pay the rider directly on arrival.
              </div>

              <Link
                href="/checkout"
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-accent text-white font-bold py-4 rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link href="/menu" className="block text-center text-sm text-foreground/60 hover:text-accent transition-colors">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
