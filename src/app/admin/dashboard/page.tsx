import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, LogOut, ChefHat } from "lucide-react"
import { updateOrderStatus } from "@/lib/api/admin"

export const dynamic = "force-dynamic"

export const metadata = { title: "Admin Dashboard | Niola'\''s Pasta" }

const STATUS_OPTIONS = ["Pending Confirmation","Preparing","Out for Delivery","Delivered","Cancelled"]
const STATUS_COLORS: Record<string,string> = {
  "Pending Confirmation":"bg-yellow-100 text-yellow-800",
  "Preparing":"bg-blue-100 text-blue-800",
  "Out for Delivery":"bg-purple-100 text-purple-800",
  "Delivered":"bg-green-100 text-green-800",
  "Cancelled":"bg-red-100 text-red-800",
}

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/admin")

  const resolvedParams = await searchParams
  const activeFilter = resolvedParams.filter || 'all'

  const { data: ordersRaw } = await supabase.from("orders").select("*").order("created_at",{ascending:false}).limit(100)
  const orders = (ordersRaw || []) as any[]

  const totalRevenue = orders?.filter(o=>o.payment_status==="PAID").reduce((s,o)=>s+(o.subtotal||0),0)||0
  const pendingCount = orders?.filter(o=>o.order_status==="Pending Confirmation").length||0
  const todayCount = orders?.filter(o=>new Date(o.created_at).toDateString()===new Date().toDateString()).length||0

  let filteredOrders = orders
  if (activeFilter === 'today') {
    filteredOrders = orders.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString())
  } else if (activeFilter === 'pending') {
    filteredOrders = orders.filter(o => o.order_status === "Pending Confirmation")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-primary text-white p-6 hidden md:flex flex-col fixed top-0 left-0 h-full z-10">
        <div className="mb-10">
          <Link href="/admin/dashboard">
            <img src="/logo.png" alt="Niola's Pasta" className="h-12 w-auto object-contain bg-white/10 p-1 rounded-xl" />
          </Link>
        </div>
        <nav className="flex-1 space-y-2">
          <Link href="/admin/dashboard" className="flex items-center gap-3 bg-white/10 px-4 py-3 rounded-xl font-medium"><LayoutDashboard className="w-5 h-5"/>Orders</Link>
          <Link href="/admin/dashboard/menu" className="flex items-center gap-3 hover:bg-white/5 px-4 py-3 rounded-xl font-medium transition-colors"><ChefHat className="w-5 h-5"/>Menu Items</Link>
        </nav>
        <form action="/api/auth/signout" method="post">
          <button className="flex items-center gap-3 hover:bg-white/5 px-4 py-3 rounded-xl font-medium transition-colors w-full text-left text-red-300"><LogOut className="w-5 h-5"/>Sign Out</button>
        </form>
      </aside>
      <main className="flex-1 md:ml-64 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
            <div className="flex gap-2">
              <Link href="/admin/dashboard" className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeFilter === 'all' ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>All</Link>
              <Link href="?filter=pending" className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeFilter === 'pending' ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>Pending</Link>
              <Link href="?filter=today" className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeFilter === 'today' ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>Today</Link>
            </div>
          </div>
          <p className="text-gray-500 mb-8">Manage and update all incoming orders</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
              <p className="text-3xl font-bold mt-1 text-green-600">N{totalRevenue.toLocaleString()}</p>
            </div>
            <Link href="?filter=pending" className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:border-yellow-300 transition-colors cursor-pointer group">
              <p className="text-sm text-gray-500 font-medium group-hover:text-yellow-600 transition-colors">Pending</p>
              <p className="text-3xl font-bold mt-1 text-yellow-600">{pendingCount}</p>
            </Link>
            <Link href="?filter=today" className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:border-blue-300 transition-colors cursor-pointer group">
              <p className="text-sm text-gray-500 font-medium group-hover:text-blue-600 transition-colors">Today</p>
              <p className="text-3xl font-bold mt-1 text-blue-600">{todayCount}</p>
            </Link>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm">
                    <th className="p-4 font-semibold">Order</th>
                    <th className="p-4 font-semibold">Customer</th>
                    <th className="p-4 font-semibold">Items</th>
                    <th className="p-4 font-semibold">Delivery</th>
                    <th className="p-4 font-semibold">Amount</th>
                    <th className="p-4 font-semibold">Date</th>
                    <th className="p-4 font-semibold min-w-[200px]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(filteredOrders||[]).map((order)=>{
                    const items = Array.isArray(order.items)?order.items:[]
                    const isPickup = order.delivery_address==="PICKUP"
                    return (
                      <tr key={order.id} className="hover:bg-gray-50/50 transition-colors align-top group">
                        <td className="p-4 font-mono font-bold text-gray-900 text-sm">
                          <Link href={`/admin/dashboard/order/${order.order_token}`} className="text-primary hover:underline group-hover:text-accent transition-colors block h-full w-full">{order.order_token}</Link>
                        </td>
                        <td className="p-4">
                          <Link href={`/admin/dashboard/order/${order.order_token}`} className="block">
                            <div className="font-semibold text-gray-900 group-hover:text-primary transition-colors">{order.customer_name}</div>
                            <div className="text-xs text-gray-400">{order.customer_email}</div>
                          </Link>
                          <a href={`tel:${order.customer_phone}`} className="text-sm text-blue-600 hover:underline inline-block mt-0.5">{order.customer_phone}</a>
                        </td>
                        <td className="p-4 text-sm text-gray-700 max-w-[180px]">
                          <Link href={`/admin/dashboard/order/${order.order_token}`} className="block">
                            {items.map((item:any,i:number)=>(
                              <div key={i}>{item.quantity}x {item.name}{item.variant?` (${item.variant})`:""}</div>
                            ))}
                          </Link>
                        </td>
                        <td className="p-4 text-sm">
                          <Link href={`/admin/dashboard/order/${order.order_token}`} className="block">
                            {isPickup?<span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">Pickup</span>:<span className="text-gray-600 text-xs">{order.delivery_address}</span>}
                          </Link>
                        </td>
                        <td className="p-4 font-bold text-gray-900 whitespace-nowrap">
                          <Link href={`/admin/dashboard/order/${order.order_token}`} className="block">N{order.subtotal?.toLocaleString()}</Link>
                        </td>
                        <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                          <Link href={`/admin/dashboard/order/${order.order_token}`} className="block">
                            {new Date(order.created_at).toLocaleDateString("en-NG",{day:"numeric",month:"short"})}
                            <br/><span className="text-xs">{new Date(order.created_at).toLocaleTimeString("en-NG",{hour:"2-digit",minute:"2-digit"})}</span>
                          </Link>
                        </td>
                        <td className="p-4 relative z-10">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold mb-2 ${STATUS_COLORS[order.order_status]||"bg-gray-100 text-gray-700"}`}>{order.order_status}</span>
                          <form action={async(fd:FormData)=>{"use server";const status=fd.get("status") as string;await updateOrderStatus(order.id,status)}}>
                            <div className="flex gap-2 mt-1">
                              <select name="status" defaultValue={order.order_status} className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary">
                                {STATUS_OPTIONS.map(s=><option key={s} value={s}>{s}</option>)}
                              </select>
                              <button type="submit" className="text-xs bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary/80 font-semibold cursor-pointer z-20">Save</button>
                            </div>
                          </form>
                        </td>
                      </tr>
                    )
                  })}
                  {filteredOrders.length===0&&<tr><td colSpan={7} className="p-12 text-center text-gray-400">No orders found.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
