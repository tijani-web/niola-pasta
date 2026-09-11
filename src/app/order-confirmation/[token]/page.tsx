import { getOrderByToken } from '@/lib/api/orders'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CheckCircle2, ArrowRight, MessageCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Order Confirmation | Niola\'s Pasta',
}

export default async function OrderConfirmationPage({ params }: { params: Promise<{ token: string }> }) {
  const token = (await params).token
  const order = await getOrderByToken(token)

  if (!order) {
    notFound()
  }

  // Use the verified WhatsApp number
  const whatsappNumber = '2347030462283'
  
  // Format the items for the WhatsApp message
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
*Delivery Address:* ${order.delivery_address}

*Order Details:*
${itemsText}

*Food Subtotal:* ₦${order.subtotal.toLocaleString()}

Please confirm my order and let me know the estimated delivery time!`

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`

  return (
    <div className="min-h-screen bg-background py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce-short">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
          Order Received!
        </h1>
        <p className="text-foreground/70 text-lg mb-2">
          Thank you for your order, <span className="font-semibold text-foreground">{order.customer_name}</span>.
        </p>
        <p className="text-foreground/60 mb-8 max-w-lg mx-auto">
          We've received your payment and your order is now <span className="font-semibold text-primary">{order.order_status}</span>.
        </p>

        <div className="bg-white rounded-2xl border border-primary/10 shadow-sm overflow-hidden mb-8 text-left max-w-md mx-auto">
          <div className="bg-primary/5 px-6 py-4 border-b border-primary/10 flex justify-between items-center">
            <span className="font-bold text-primary">Order Token</span>
            <span className="font-mono bg-white px-3 py-1 rounded-md text-sm border border-primary/10 shadow-sm">{order.order_token}</span>
          </div>
          <div className="px-6 py-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-foreground/60">Subtotal</span>
              <span className="font-bold">₦{order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/60">Delivery Fee</span>
              <span className="italic">To be paid to rider</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#25d366] hover:bg-[#1ebe5d] text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <MessageCircle className="w-5 h-5" />
            Message Us on WhatsApp
          </a>
          
          <Link
            href={`/track/${order.order_token}`}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary font-bold py-3.5 px-8 rounded-xl transition-all"
          >
            Track Order Status
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

      </div>
    </div>
  )
}
