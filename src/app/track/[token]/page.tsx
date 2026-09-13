import { getOrderByToken } from '@/lib/api/orders'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Clock, Truck, Home } from 'lucide-react'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }) {
  const token = (await params).token
  return { title: `Track Order ${token} | Niola's Pasta` }
}

export default async function TrackOrderPage({ params }: { params: Promise<{ token: string }> }) {
  const token = (await params).token
  
  const dbOrder = await getOrderByToken(token)

  if (!dbOrder) {
    notFound()
  }

  const order = dbOrder

  const statuses = [
    { id: 'Pending Confirmation', label: 'Pending Confirmation', icon: Clock },
    { id: 'Preparing', label: 'Preparing', icon: CheckCircle2 },
    { id: 'Out for Delivery', label: 'Out for Delivery', icon: Truck },
    { id: 'Delivered', label: 'Delivered', icon: Home }
  ]
  
  const currentStatusIndex = statuses.findIndex(s => s.id === order.order_status)
  
  const formattedDate = new Date(order.created_at).toLocaleString('en-NG', {
    dateStyle: 'medium',
    timeStyle: 'short'
  })

  return (
    <div className="bg-primary/5 min-h-screen pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex justify-between items-center mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-foreground/60 hover:text-accent transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <div className="text-right">
            <p className="text-sm text-foreground/60">Order Reference</p>
            <p className="font-bold text-primary font-mono">{order.order_token}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-primary/10 overflow-hidden mb-8">
          <div className="p-6 md:p-8 border-b border-primary/10">
            <h1 className="text-2xl md:text-3xl font-bold text-primary font-serif mb-2">
              Order Status
            </h1>
            <p className="text-foreground/70">
              Hi {order.customer_name}, here's the status of your order placed on {formattedDate}.
            </p>
          </div>

          <div className="p-6 md:p-10">
            {/* Status Pipeline */}
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-6 left-6 right-6 h-1 bg-primary/10 -z-10 rounded-full hidden md:block">
                <div 
                  className="absolute top-0 left-0 h-full bg-accent transition-all duration-500 rounded-full"
                  style={{ width: `${(Math.max(0, currentStatusIndex) / (statuses.length - 1)) * 100}%` }}
                ></div>
              </div>

              <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-0">
                {statuses.map((status, index) => {
                  const isCompleted = index <= currentStatusIndex
                  const isCurrent = index === currentStatusIndex
                  const Icon = status.icon

                  return (
                    <div key={status.id} className="flex md:flex-col items-center gap-4 md:gap-3 text-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-colors ${
                        isCompleted 
                          ? 'bg-accent border-accent text-white shadow-md' 
                          : 'bg-white border-primary/10 text-primary/30'
                      } ${isCurrent ? 'ring-4 ring-accent/20' : ''}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="text-left md:text-center">
                        <p className={`font-bold ${isCompleted ? 'text-primary' : 'text-foreground/40'}`}>
                          {status.label}
                        </p>
                        {isCurrent && index === 0 && (
                          <p className="text-xs text-accent mt-1 max-w-[120px]">Awaiting shop confirmation</p>
                        )}
                        {isCurrent && index === 2 && (
                          <p className="text-xs text-accent mt-1 max-w-[120px]">Rider is on the way!</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            
            {order.order_status === 'Cancelled' && (
              <div className="mt-8 bg-red-50 text-red-600 p-4 rounded-xl text-center font-bold border border-red-100">
                This order has been cancelled.
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-3xl shadow-sm border border-primary/10 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-primary/10 bg-primary/5">
            <h2 className="text-xl font-bold text-primary font-serif">Order Details</h2>
          </div>
          
          <div className="p-6 md:p-8">
            <ul className="space-y-4 mb-6">
              {Array.isArray(order.items) && order.items.map((item: any, idx: number) => (
                <li key={idx} className="flex justify-between items-center">
                  <div>
                    <span className="font-medium text-foreground">{item.quantity}x {item.name}</span>
                    {item.variant && <span className="text-sm text-foreground/60 ml-2">({item.variant})</span>}
                  </div>
                  <span className="font-bold text-foreground">₦{((item.price) * item.quantity).toLocaleString()}</span>
                </li>
              ))}
            </ul>
            
            <div className="border-t border-primary/10 pt-4 space-y-2">
              <div className="flex justify-between text-foreground/80">
                <span>Food Subtotal</span>
                <span>₦{order.subtotal?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-primary pt-2 border-t border-primary/10">
                <span>Total Paid</span>
                <span>₦{order.subtotal?.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-8 bg-accent/10 border border-accent/20 rounded-xl p-4 text-center">
              <p className="text-accent font-medium">Need help with your order?</p>
              <a 
                href={`https://wa.me/2347030462283?text=${encodeURIComponent(`Hi Niola's Pasta, I'm checking on my order ${order.order_token}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold transition-colors"
              >
                Message on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
