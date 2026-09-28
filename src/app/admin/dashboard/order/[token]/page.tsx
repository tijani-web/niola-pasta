import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Package, Clock, MapPin, User, FileText, CreditCard } from "lucide-react"
import { updateOrderStatus } from "@/lib/api/admin"

export const dynamic = "force-dynamic"

export const metadata = { title: "Order Details | Admin Dashboard" }

const STATUS_OPTIONS = ["Pending Confirmation","Preparing","Out for Delivery","Delivered","Cancelled"]
const STATUS_COLORS: Record<string,string> = {
  "Pending Confirmation":"bg-yellow-100 text-yellow-800",
  "Preparing":"bg-blue-100 text-blue-800",
  "Out for Delivery":"bg-purple-100 text-purple-800",
  "Delivered":"bg-green-100 text-green-800",
  "Cancelled":"bg-red-100 text-red-800",
}

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ token: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/admin")

  const { token } = await params

  const { data: orderRaw } = await supabase.from("orders").select("*").eq("order_token", token).single()
  const order = orderRaw as any

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
          <p className="text-gray-500 mb-6">The order {token} does not exist or has been deleted.</p>
          <Link href="/admin/dashboard" className="text-primary hover:underline flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const items = Array.isArray(order.items) ? order.items : []
  const isPickup = order.delivery_address === "PICKUP"

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/admin/dashboard" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              Order {order.order_token}
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${order.payment_status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                {order.payment_status}
              </span>
            </h1>
            <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
              <Clock className="w-4 h-4" /> 
              {new Date(order.created_at).toLocaleString("en-NG", { dateStyle: "full", timeStyle: "short" })}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Details */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Items Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-gray-900">Order Items</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {items.map((item: any, idx: number) => {
                  const extrasTotal = item.extras?.reduce((s: number, e: any) => s + e.price, 0) || 0
                  const lineTotal = (item.price + extrasTotal) * item.quantity
                  return (
                    <div key={idx} className="flex justify-between items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                      <div>
                        <p className="font-semibold text-gray-900">{item.quantity}× {item.name}</p>
                        {item.variant && <p className="text-sm text-gray-500">Variant: {item.variant}</p>}
                        {item.extras && item.extras.length > 0 && (
                          <p className="text-xs text-gray-400 mt-1">
                            + {item.extras.map((e: any) => e.name).join(', ')}
                          </p>
                        )}
                      </div>
                      <p className="font-bold text-gray-900">₦{lineTotal.toLocaleString()}</p>
                    </div>
                  )
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Delivery</span>
                  <span>{isPickup ? 'Pickup (₦0)' : 'Included in total'}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2">
                  <span>Total Paid</span>
                  <span>₦{order.subtotal?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer & Delivery info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-gray-900 text-sm">Customer</h3>
              </div>
              <div className="p-5 text-sm space-y-3">
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">Name</p>
                  <p className="font-semibold text-gray-900">{order.customer_name}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">Phone</p>
                  <a href={`tel:${order.customer_phone}`} className="font-semibold text-blue-600 hover:underline">{order.customer_phone}</a>
                </div>
                {order.customer_email && (
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">Email</p>
                    <a href={`mailto:${order.customer_email}`} className="font-semibold text-blue-600 hover:underline">{order.customer_email}</a>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-gray-900 text-sm">Delivery Details</h3>
              </div>
              <div className="p-5 text-sm">
                <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold mb-3 ${isPickup ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                  {isPickup ? 'PICKUP' : 'DELIVERY'}
                </span>
                <p className="text-gray-700 leading-relaxed font-medium">
                  {isPickup 
                    ? "Customer will pick up at: Uniosun second gate, opposite VIP Lodge, Osogbo" 
                    : order.delivery_address}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-gray-900 text-sm">Order Status</h3>
            </div>
            <div className="p-5">
              <div className="mb-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 font-semibold">Current Status</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${STATUS_COLORS[order.order_status]||"bg-gray-100 text-gray-700"}`}>
                  {order.order_status}
                </span>
              </div>
              
              <form action={async(fd:FormData)=>{"use server";const status=fd.get("status") as string;await updateOrderStatus(order.id,status)}}>
                <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 font-semibold block">Update Status</label>
                <div className="flex flex-col gap-2">
                  <select name="status" defaultValue={order.order_status} className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    {STATUS_OPTIONS.map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                  <button type="submit" className="w-full bg-primary text-white px-4 py-2.5 rounded-xl hover:bg-primary/90 font-bold transition-colors cursor-pointer">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-gray-900 text-sm">Payment Details</h3>
            </div>
            <div className="p-5 space-y-3 text-sm">
              <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                <span className="text-gray-500">Status</span>
                <span className={`font-bold ${order.payment_status === 'PAID' ? 'text-green-600' : 'text-orange-500'}`}>
                  {order.payment_status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Reference ID</span>
                <span className="font-mono text-gray-900 text-xs bg-gray-100 px-2 py-1 rounded">
                  {order.paystack_reference || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
