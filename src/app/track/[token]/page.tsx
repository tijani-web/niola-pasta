import { getOrderByToken } from '@/lib/api/orders'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Clock, ChefHat, Truck, Home, ShoppingBag, MessageCircle, RefreshCw } from 'lucide-react'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }) {
  const token = (await params).token
  return {
    title: `Track Order ${token} | Niola's Pasta`,
    description: `Track the status of your order ${token} from Niola's Pasta.`
  }
}

export default async function TrackOrderPage({ params }: { params: Promise<{ token: string }> }) {
  const token = (await params).token
  const order = await getOrderByToken(token)

  if (!order) {
    notFound()
  }

  const isPickup = order.delivery_address === 'PICKUP'

  const statuses = isPickup
    ? [
        { id: 'Pending Confirmation', label: 'Order Placed', sub: 'Awaiting shop confirmation', icon: Clock },
        { id: 'Preparing', label: 'Preparing', sub: 'Your food is being made', icon: ChefHat },
        { id: 'Ready for Pickup', label: 'Ready for Pickup', sub: 'Come collect your order!', icon: ShoppingBag },
        { id: 'Delivered', label: 'Picked Up', sub: 'Enjoy your meal!', icon: Home },
      ]
    : [
        { id: 'Pending Confirmation', label: 'Order Placed', sub: 'Awaiting shop confirmation', icon: Clock },
        { id: 'Preparing', label: 'Preparing', sub: 'Your food is being made', icon: ChefHat },
        { id: 'Out for Delivery', label: 'Out for Delivery', sub: 'Rider is on the way!', icon: Truck },
        { id: 'Delivered', label: 'Delivered', sub: 'Enjoy your meal!', icon: Home },
      ]

  const currentStatusIndex = statuses.findIndex(s => s.id === order.order_status)
  const progress = currentStatusIndex === -1 ? 0 : (currentStatusIndex / (statuses.length - 1)) * 100

  const formattedDate = new Date(order.created_at).toLocaleString('en-NG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  const isCancelled = order.order_status === 'Cancelled'

  return (
    <div className="bg-primary/5 min-h-screen pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 md:py-12">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/track"
            className="inline-flex items-center gap-2 text-foreground/60 hover:text-accent transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Track Another Order
          </Link>

          <a
            href={`/track/${token}`}
            className="inline-flex items-center gap-1.5 text-sm text-foreground/50 hover:text-primary transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </a>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-primary/10 overflow-hidden mb-6">

          <div className="p-6 md:p-8 border-b border-primary/10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-primary font-serif mb-1">
                  Order Status
                </h1>
                <p className="text-foreground/60 text-sm">
                  Hi <span className="font-semibold text-foreground">{order.customer_name}</span>, 
                  placed on {formattedDate}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-foreground/50 mb-1">Order Token</p>
                <span className="font-mono font-bold text-primary text-sm bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10">
                  {order.order_token}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-10">
            {isCancelled ? (
              <div className="bg-red-50 text-red-600 p-5 rounded-2xl text-center font-bold border border-red-100">
                ❌ This order has been cancelled.
                <p className="font-normal text-sm mt-1">Please contact us on WhatsApp for assistance.</p>
              </div>
            ) : (
              <>
                {/* Progress bar (desktop) */}
                <div className="hidden md:block relative mb-10">
                  <div className="absolute top-6 left-6 right-6 h-1.5 bg-primary/10 rounded-full">
                    <div
                      className="absolute top-0 left-0 h-full bg-accent transition-all duration-700 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between relative">
                    {statuses.map((status, index) => {
                      const isCompleted = index <= currentStatusIndex
                      const isCurrent = index === currentStatusIndex
                      const Icon = status.icon
                      return (
                        <div key={status.id} className="flex flex-col items-center gap-3 w-24 text-center">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                            isCompleted
                              ? 'bg-accent border-accent text-white shadow-md'
                              : 'bg-white border-primary/15 text-primary/30'
                          } ${isCurrent ? 'ring-4 ring-accent/20 scale-110' : ''}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className={`text-xs font-bold leading-tight ${isCompleted ? 'text-primary' : 'text-foreground/35'}`}>
                              {status.label}
                            </p>
                            {isCurrent && (
                              <p className="text-xs text-accent mt-0.5">{status.sub}</p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Mobile: vertical steps */}
                <div className="md:hidden space-y-4">
                  {statuses.map((status, index) => {
                    const isCompleted = index <= currentStatusIndex
                    const isCurrent = index === currentStatusIndex
                    const Icon = status.icon
                    return (
                      <div key={status.id} className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 shrink-0 transition-all ${
                          isCompleted
                            ? 'bg-accent border-accent text-white'
                            : 'bg-white border-primary/15 text-primary/30'
                        } ${isCurrent ? 'ring-4 ring-accent/20' : ''}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className={`font-bold text-sm ${isCompleted ? 'text-primary' : 'text-foreground/35'}`}>
                            {status.label}
                          </p>
                          {isCurrent && (
                            <p className="text-xs text-accent">{status.sub}</p>
                          )}
                        </div>
                        {isCompleted && !isCurrent && (
                          <CheckCircle2 className="w-4 h-4 text-accent ml-auto shrink-0" />
                        )}
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-3xl shadow-sm border border-primary/10 overflow-hidden mb-6">
          <div className="p-6 border-b border-primary/10 bg-primary/5">
            <h2 className="text-lg font-bold text-primary font-serif">Order Details</h2>
          </div>
          <div className="p-6">
            <ul className="space-y-3 mb-5">
              {Array.isArray(order.items) && order.items.map((item: any, idx: number) => {
                const extrasTotal = item.extras?.reduce((s: number, e: any) => s + e.price, 0) || 0
                const lineTotal = (item.price + extrasTotal) * item.quantity
                return (
                  <li key={idx} className="flex justify-between items-start">
                    <div>
                      <span className="font-medium text-foreground">{item.quantity}× {item.name}</span>
                      {item.variant && <span className="text-sm text-foreground/50 ml-2">({item.variant})</span>}
                      {item.extras?.length > 0 && (
                        <p className="text-xs text-foreground/40 mt-0.5">+ {item.extras.map((e: any) => e.name).join(', ')}</p>
                      )}
                    </div>
                    <span className="font-bold text-foreground shrink-0 ml-4">₦{lineTotal.toLocaleString()}</span>
                  </li>
                )
              })}
            </ul>

            <div className="border-t border-primary/10 pt-4 flex justify-between font-bold text-primary">
              <span>Total Paid</span>
              <span>₦{order.subtotal?.toLocaleString()}</span>
            </div>

            {/* Delivery info */}
            <div className={`mt-4 rounded-xl p-3 text-sm ${isPickup ? 'bg-blue-50 text-blue-800' : 'bg-amber-50 text-amber-800'}`}>
              <span className="font-bold">{isPickup ? '📍 Pickup location: ' : '🛵 Delivering to: '}</span>
              {isPickup ? 'Uniosun second gate, opposite VIP Lodge, Osogbo' : order.delivery_address}
            </div>
          </div>
        </div>

        {/* Help */}
        <div className="bg-white rounded-2xl border border-primary/10 shadow-sm p-5 text-center">
          <p className="text-foreground/60 mb-3 text-sm">Need help or have a question about your order?</p>
          <a
            href={`https://wa.me/2347030462283?text=${encodeURIComponent(`Hi Niola's Pasta! I'm checking on my order ${order.order_token}.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25d366] hover:bg-[#1ebe5d] text-white font-bold px-6 py-3 rounded-xl transition-all shadow-sm"
          >
            <MessageCircle className="w-5 h-5" />
            Message Us on WhatsApp
          </a>
        </div>

      </div>
    </div>
  )
}
