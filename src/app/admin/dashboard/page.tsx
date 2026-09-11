import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, LogOut, PackageSearch } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Admin Dashboard | Niola\'s Pasta',
}

export default async function AdminDashboard() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/admin')
  }

  // Fetch recent orders
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  // Fallback for UI if DB is empty
  const displayOrders = orders && orders.length > 0 ? orders : [
    {
      id: 'mock-1',
      order_token: 'NP-1234',
      customer_name: 'John Doe',
      customer_phone: '08012345678',
      subtotal: 3200,
      payment_status: 'PAID',
      order_status: 'Pending Confirmation',
      created_at: new Date().toISOString()
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white p-6 hidden md:flex flex-col">
        <div className="font-serif text-2xl font-bold mb-10 flex items-center gap-2">
          Niola's <span className="text-accent">Admin</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          <Link href="/admin/dashboard" className="flex items-center gap-3 bg-white/10 px-4 py-3 rounded-xl font-medium">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/admin/dashboard/menu" className="flex items-center gap-3 hover:bg-white/5 px-4 py-3 rounded-xl font-medium transition-colors">
            <PackageSearch className="w-5 h-5" />
            Menu Items
          </Link>
        </nav>
        
        <form action="/auth/signout" method="post">
          <button className="flex items-center gap-3 hover:bg-white/5 px-4 py-3 rounded-xl font-medium transition-colors w-full text-left text-red-300">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </form>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Recent Orders</h1>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm">
                    <th className="p-4 font-semibold">Order ID</th>
                    <th className="p-4 font-semibold">Customer</th>
                    <th className="p-4 font-semibold">Amount</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Date</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {displayOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 font-mono font-bold text-gray-900">{order.order_token}</td>
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{order.customer_name}</div>
                        <div className="text-sm text-gray-500">{order.customer_phone}</div>
                      </td>
                      <td className="p-4 font-medium text-gray-900">₦{order.subtotal?.toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${order.order_status === 'Pending Confirmation' ? 'bg-yellow-100 text-yellow-800' :
                            order.order_status === 'Preparing' ? 'bg-blue-100 text-blue-800' :
                            order.order_status === 'Out for Delivery' ? 'bg-purple-100 text-purple-800' :
                            order.order_status === 'Delivered' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }
                        `}>
                          {order.order_status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <button className="text-accent hover:text-primary font-medium text-sm bg-accent/5 px-3 py-1.5 rounded-lg">
                          Update Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
