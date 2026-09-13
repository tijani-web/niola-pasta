'use client'

import { useState, useEffect, useRef } from 'react'
import { useCartStore } from '@/store/useCartStore'
import { useRouter } from 'next/navigation'
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3'
import { ArrowLeft, CreditCard, Loader2, Trash2, Minus, Plus, ShieldCheck, Info, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { createOrder } from '@/lib/api/orders'

export default function CheckoutForm() {
  const { items, getSubtotal, clearCart, updateQuantity, removeItem } = useCartStore()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', address: '' })
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery'|'pickup'>('delivery')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const isSuccessRef = useRef(false)

  useEffect(() => {
    setMounted(true)
    if (items.length === 0 && !isSuccessRef.current) router.push('/menu')
  }, [items.length, router])

  const subtotal = getSubtotal()

  const config = {
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || '',
    tx_ref: `NP-${new Date().getTime()}`,
    amount: subtotal,
    currency: 'NGN',
    payment_options: 'card,banktransfer,ussd',
    customer: {
      email: formData.email || 'guest@niolaspasta.com',
      phone_number: formData.phone,
      name: formData.name,
    },
    customizations: {
      title: "Niola's Pasta",
      description: 'Payment for your order',
      logo: 'https://niolaspasta.com/icon.png',
    },
  }

  const handleFlutterPayment = useFlutterwave(config as any)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!termsAccepted) return
    setIsProcessing(true)

    handleFlutterPayment({
      callback: async (response) => {
        if (response.status === 'successful') {
          // Immediately set success flag so NO guards can redirect us
          isSuccessRef.current = true
          
          try {
            const token = await createOrder({
              customerName: formData.name,
              customerPhone: formData.phone,
              customerEmail: formData.email,
              deliveryAddress: deliveryMethod === 'pickup' ? 'PICKUP' : formData.address,
              items,
              subtotal,
              paystackReference: response.transaction_id.toString()
            })
            
            // Close modal only after order is created securely
            closePaymentModal()
            
            // Replace checkout so the browser cannot return to an empty cart.
            clearCart()
            router.replace(`/order-confirmation/${token}`)
          } catch {
            closePaymentModal()
            alert('Payment received but order creation failed. Please contact support with your payment reference.')
            setIsProcessing(false)
          }
        } else {
          closePaymentModal()
          setIsProcessing(false)
        }
      },
      onClose: () => {
        if (!isSuccessRef.current) {
          setIsProcessing(false)
        }
      },
    })
  }

  if (!mounted || items.length === 0) return null

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/menu" className="inline-flex items-center gap-2 text-foreground/60 hover:text-accent mb-8 transition-colors font-medium group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Continue Shopping
        </Link>

        <h1 className="font-serif text-4xl font-bold text-primary mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
          {/* LEFT — Billing Details */}
          <form id="checkout-form" onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl border border-primary/10 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-primary/10 bg-primary/5">
                <h2 className="font-serif font-bold text-xl text-primary">Billing Details</h2>
              </div>
              <div className="p-6 space-y-5">
                
                {/* Delivery or Pickup Toggle */}
                <div className="grid grid-cols-2 gap-2 p-1.5 bg-primary/5 rounded-xl mb-6">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('delivery')}
                    className={`py-2.5 rounded-lg text-sm font-bold transition-all ${
                      deliveryMethod === 'delivery' ? 'bg-white text-primary shadow' : 'text-foreground/60 hover:text-primary hover:bg-white/50'
                    }`}
                  >
                    Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('pickup')}
                    className={`py-2.5 rounded-lg text-sm font-bold transition-all ${
                      deliveryMethod === 'pickup' ? 'bg-white text-primary shadow' : 'text-foreground/60 hover:text-primary hover:bg-white/50'
                    }`}
                  >
                    Pickup
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-bold text-foreground mb-1.5">Full Name *</label>
                  <input
                    required type="text" value={formData.name}
                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                    placeholder="John Doe"
                    className="w-full p-3.5 rounded-xl border border-primary/20 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-1.5">Phone Number *</label>
                    <input
                      required type="tel" value={formData.phone}
                      onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                      placeholder="08012345678"
                      className="w-full p-3.5 rounded-xl border border-primary/20 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-1.5">Email (Optional)</label>
                    <input
                      type="email" value={formData.email}
                      onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                      placeholder="john@example.com"
                      className="w-full p-3.5 rounded-xl border border-primary/20 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                    />
                  </div>
                </div>
                
                {deliveryMethod === 'delivery' ? (
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-1.5">Delivery Address *</label>
                    <textarea
                      required rows={3} value={formData.address}
                      onChange={e => setFormData(p => ({ ...p, address: e.target.value }))}
                      placeholder="House number, street, nearest landmark, area, Osogbo"
                      className="w-full p-3.5 rounded-xl border border-primary/20 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all resize-none"
                    />
                  </div>
                ) : (
                  <div className="bg-primary/5 p-5 rounded-xl border border-primary/10 flex flex-col gap-2">
                    <label className="block text-sm font-bold text-primary">Pickup Location</label>
                    <p className="text-foreground/80 font-medium">Uniosun second gate opposite VIP LODGE OSOGBO</p>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Notes */}
            <div className="bg-white rounded-2xl border border-primary/10 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-primary/10 bg-primary/5">
                <h2 className="font-serif font-bold text-xl text-primary">Additional Information</h2>
              </div>
              <div className="p-6">
                <label className="block text-sm font-bold text-foreground mb-1.5">Order Notes (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Any special instructions, allergies, or requests for your order..."
                  className="w-full p-3.5 rounded-xl border border-primary/20 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all resize-none text-sm"
                />
              </div>
            </div>
          </form>

          {/* RIGHT — Order Summary */}
          <div className="lg:col-span-2 space-y-4 lg:sticky lg:top-28">
            <div className="bg-white rounded-2xl border border-primary/10 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-primary/10 bg-primary/5">
                <h2 className="font-serif font-bold text-xl text-primary">Your Order</h2>
              </div>

              {/* Items */}
              <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
                {items.map(item => {
                  const extrasTotal = item.extras?.reduce((s, e) => s + e.price, 0) || 0
                  const itemTotal = (item.price + extrasTotal) * item.quantity
                  return (
                    <div key={item.cartItemId} className="flex gap-3 items-center">
                      {item.imageUrl ? (
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                          <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-xl">🍝</div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-foreground truncate">{item.name}</p>
                        {item.variant && <p className="text-xs text-foreground/50">{item.variant}</p>}
                        {item.extras && item.extras.length > 0 && (
                          <p className="text-xs text-foreground/50 truncate">+ {item.extras.map(e => e.name).join(', ')}</p>
                        )}
                        {/* Quantity controls */}
                        <div className="flex items-center gap-2 mt-1">
                          <button onClick={() => item.quantity > 1 ? updateQuantity(item.cartItemId, item.quantity - 1) : removeItem(item.cartItemId)} className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-accent hover:text-white transition-colors">
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="text-xs font-bold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-accent hover:text-white transition-colors">
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                          <button onClick={() => removeItem(item.cartItemId)} className="ml-auto text-red-400 hover:text-red-600 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="font-bold text-sm text-primary flex-shrink-0">₦{itemTotal.toLocaleString()}</p>
                    </div>
                  )
                })}
              </div>

              {/* Extra Toppings Upsell */}
              <div className="px-6 py-4 border-t border-primary/10 bg-primary/5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-serif font-bold text-sm text-primary uppercase tracking-wider">Add Extras</h3>
                  <div className="flex items-center gap-1">
                    <button 
                      type="button"
                      onClick={() => {
                        const el = document.getElementById('checkout-extras')
                        if (el) el.scrollBy({ left: -150, behavior: 'smooth' })
                      }} 
                      className="p-1 rounded-full hover:bg-white text-gray-500 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        const el = document.getElementById('checkout-extras')
                        if (el) el.scrollBy({ left: 150, behavior: 'smooth' })
                      }} 
                      className="p-1 rounded-full hover:bg-white text-gray-500 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div 
                  id="checkout-extras"
                  className="flex overflow-x-auto gap-3 pb-2 snap-x" 
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  <style dangerouslySetInnerHTML={{__html: `
                    #checkout-extras::-webkit-scrollbar { display: none; }
                  `}} />
                  {[
                    { id: 'extra-pasta', name: 'Extra Pasta', price: 300 },
                    { id: 'extra-chicken', name: 'Extra Chicken', price: 1300 },
                    { id: 'extra-plantain', name: 'Extra Plantain', price: 500 },
                    { id: 'extra-sausage', name: 'Extra Sausage', price: 500 },
                    { id: 'extra-egg', name: 'Extra Egg', price: 500 },
                    { id: 'extra-veggies', name: 'Extra Veggies', price: 0 },
                  ].map((extra) => (
                    <div 
                      key={extra.id}
                      className="min-w-[140px] p-3 rounded-xl border border-primary/10 bg-white hover:border-primary/30 shadow-sm snap-start transition-all"
                    >
                      <h4 className="font-semibold text-xs text-foreground leading-tight truncate">{extra.name}</h4>
                      <p className="text-foreground/60 text-xs mt-0.5 mb-2">₦{extra.price.toLocaleString()}</p>
                      <button
                        type="button"
                        onClick={() => {
                          useCartStore.getState().addItem({
                            menuItemId: extra.id,
                            name: extra.name,
                            price: extra.price,
                            quantity: 1,
                            imageUrl: null
                          })
                        }}
                        className="w-full py-1.5 rounded-lg text-xs font-bold bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
                      >
                        + Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="px-6 py-4 border-t border-primary/10 space-y-2">
                <div className="flex justify-between text-sm text-foreground/70">
                  <span>Food Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-foreground/50">
                  <span className="flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" />
                    Delivery Fee
                  </span>
                  <span className="italic font-medium text-primary">
                    {deliveryMethod === 'pickup' ? 'Free (Pickup)' : 'Paid to rider'}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg text-primary pt-2 border-t border-primary/10">
                  <span>Total</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment */}
              <div className="px-6 pb-6 space-y-4">
                <div className="bg-primary/5 rounded-xl p-4 text-center">
                  <p className="text-xs text-foreground/60 font-semibold mb-2 uppercase tracking-wider">Secured by Flutterwave</p>
                  <div className="flex items-center justify-center gap-3">
                    {['Bank Transfer', 'Mastercard', 'VISA'].map(b => (
                      <span key={b} className="text-xs font-bold bg-white border border-gray-200 px-2 py-1 rounded-md text-gray-600">{b}</span>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2">
                  <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700 leading-relaxed">
                    {deliveryMethod === 'pickup' ? (
                      <><strong>Pickup selected.</strong> Please pick up your food at Uniosun second gate opposite VIP LODGE.</>
                    ) : (
                      <><strong>Delivery fee not included.</strong> Pay for food here; delivery fee is paid directly to the rider on arrival.</>
                    )}
                  </p>
                </div>

                {/* Terms and conditions */}
                <label className="flex items-start gap-3 p-1 cursor-pointer group">
                  <input
                    type="checkbox"
                    required
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 w-5 h-5 rounded border-gray-300 text-accent focus:ring-accent accent-accent transition-all cursor-pointer"
                  />
                  <span className="text-sm text-foreground/80 leading-snug select-none group-hover:text-foreground">
                    I understand & agree to the <a href="#" target="_blank" className="text-accent hover:underline font-medium">Terms and Conditions</a>.
                  </span>
                </label>

                <button
                  type="submit"
                  form="checkout-form"
                  disabled={isProcessing || !termsAccepted}
                  className="w-full bg-primary hover:bg-accent disabled:bg-primary/50 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:hover:scale-100 disabled:shadow-none"
                >
                  {isProcessing ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                  ) : (
                    <><CreditCard className="w-5 h-5" /> Place Order — ₦{subtotal.toLocaleString()}</>
                  )}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-xs text-foreground/50">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                  Your payment is encrypted and secure
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
