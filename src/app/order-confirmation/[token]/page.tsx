import { getOrderByToken } from '@/lib/api/orders'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CheckCircle2, ArrowRight, MessageCircle, Package } from 'lucide-react'
import CopyLinkButton from '@/components/order/CopyLinkButton'
import { ClearCartOnMount } from '@/components/checkout/ClearCartOnMount'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Order Confirmed | Niola\'s Pasta',
}

export default async function OrderConfirmationPage({ params }: { params: Promise<{ token: string }> }) {
  const token = (await params).token
  const order = await getOrderByToken(token)

  if (!order) {
    notFound()
  }

  const isPickup = order.delivery_address === 'PICKUP'
  const whatsappNumber = '2347030462283'
  
  const itemsText = order.items.map((item: any) => {
    let text = `${item.quantity}x ${item.name}`
    if (item.variant) text += ` (${item.variant})`
    if (item.extras && item.extras.length > 0) {
      text += ` + ${item.extras.map((e: any) => e.name).join(', ')}`
    }
    return text
  }).join('\n')

  const message = `Hello Niola's Pasta! 👋

I just placed an order on the website.

*Order ID:* ${order.order_token}
*Name:* ${order.customer_name}
*Phone:* ${order.customer_phone}
*${isPickup ? 'Order Type' : 'Delivery Address'}:* ${isPickup ? 'Pickup' : order.delivery_address}

*Order Details:*
${itemsText}

*Food Subtotal:* ₦${order.subtotal.toLocaleString()}

Please confirm my order and let me know the estimated ${isPickup ? 'pickup' : 'delivery'} time!`

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-background py-12 md:py-20">
      <ClearCartOnMount />
      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <div className="absolute inset-0 w-24 h-24 bg-green-100 rounded-full animate-ping opacity-20" />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-3">
            Order Confirmed! 🎉
          </h1>
          <p className="text-foreground/70 text-lg">
            Thank you, <span className="font-semibold text-foreground">{order.customer_name}</span>!
            Your payment was received successfully.
          </p>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-2xl border border-primary/10 shadow-sm overflow-hidden mb-5">
          <div className="bg-primary/5 px-6 py-4 border-b border-primary/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              <span className="font-bold text-primary">Order Summary</span>
            </div>
            <span className="font-mono text-sm bg-white px-3 py-1 rounded-lg border border-primary/10 font-bold text-primary shadow-sm">
              {order.order_token}
            </span>
          </div>

          <div className="px-6 py-5 space-y-3 text-sm">
            {/* Items */}
            <div className="space-y-2 pb-3 border-b border-primary/10">
              {order.items.map((item: any, idx: number) => {
                const extrasTotal = item.extras?.reduce((s: number, e: any) => s + e.price, 0) || 0
                const lineTotal = (item.price + extrasTotal) * item.quantity
                return (
                  <div key={idx} className="flex justify-between">
                    <span className="text-foreground/70">
                      {item.quantity}× {item.name}
                      {item.variant && <span className="text-foreground/50 ml-1">({item.variant})</span>}
                    </span>
                    <span className="font-semibold">₦{lineTotal.toLocaleString()}</span>
                  </div>
                )
              })}
            </div>

            <div className="flex justify-between text-foreground/60">
              <span>Delivery Fee</span>
              <span className="italic">{isPickup ? 'Pickup — no fee' : 'Paid to rider'}</span>
            </div>
            <div className="flex justify-between font-bold text-base text-primary pt-2 border-t border-primary/10">
              <span>Total Paid</span>
              <span>₦{order.subtotal.toLocaleString()}</span>
            </div>

            {/* Delivery/Pickup info */}
            <div className={`mt-2 rounded-xl p-3 text-sm ${isPickup ? 'bg-blue-50 text-blue-800' : 'bg-amber-50 text-amber-800'}`}>
              <span className="font-bold">{isPickup ? '📍 Pickup' : '🛵 Delivery'}: </span>
              {isPickup
                ? 'Uniosun second gate, opposite VIP Lodge, Osogbo'
                : order.delivery_address}
            </div>
          </div>
        </div>

        {/* Copy Tracking Link */}
        <div className="mb-5">
          <CopyLinkButton token={order.order_token} />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-[#25d366] hover:bg-[#1ebe5d] text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <MessageCircle className="w-5 h-5" />
            Message Us on WhatsApp
          </a>

          <Link
            href={`/track/${order.order_token}`}
            className="flex-1 flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary font-bold py-3.5 px-6 rounded-xl transition-all"
          >
            Track Order Status
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Footer note */}
        <p className="text-center text-foreground/40 text-xs">
          Save your order token <span className="font-mono font-semibold">{order.order_token}</span> to track your order anytime at{' '}
          <Link href="/track" className="text-accent hover:underline">niolaspasta.com/track</Link>
        </p>

      </div>
    </div>
  )
}
