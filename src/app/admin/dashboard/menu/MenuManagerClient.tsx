"use client"

import { useState } from "react"
import { createMenuItem, updateMenuItem, deleteMenuItem, toggleSoldOut } from "@/lib/api/admin"
import Link from "next/link"
import { LayoutDashboard, ChefHat, LogOut, Plus, Pencil, Trash2, Check, X } from "lucide-react"

const CATEGORIES = ["Big Plate","Small Plate","Budget","Niolas Gizzy","Sides","Drinks"]

interface MenuItem {
  id: string
  name: string
  slug: string
  price: number
  category: string
  description: string | null
  image_url: string | null
  is_sold_out: boolean
}

interface Props { items: MenuItem[] }

export default function MenuManagerClient({ items }: Props) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string|null>(null)
  const [deletingId, setDeletingId] = useState<string|null>(null)
  const [loading, setLoading] = useState<string|null>(null)

  const handleToggle = async (id: string, current: boolean) => {
    setLoading(id)
    await toggleSoldOut(id, current)
    setLoading(null)
  }

  const handleDelete = async (id: string) => {
    setLoading(id)
    await deleteMenuItem(id)
    setDeletingId(null)
    setLoading(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-primary text-white p-6 hidden md:flex flex-col fixed top-0 left-0 h-full z-10">
        <div className="font-serif text-2xl font-bold mb-10">Niola&apos;s <span className="text-accent">Admin</span></div>
        <nav className="flex-1 space-y-2">
          <Link href="/admin/dashboard" className="flex items-center gap-3 hover:bg-white/5 px-4 py-3 rounded-xl font-medium transition-colors"><LayoutDashboard className="w-5 h-5"/>Orders</Link>
          <Link href="/admin/dashboard/menu" className="flex items-center gap-3 bg-white/10 px-4 py-3 rounded-xl font-medium"><ChefHat className="w-5 h-5"/>Menu Items</Link>
        </nav>
        <form action="/api/auth/signout" method="post">
          <button className="flex items-center gap-3 hover:bg-white/5 px-4 py-3 rounded-xl font-medium transition-colors w-full text-left text-red-300"><LogOut className="w-5 h-5"/>Sign Out</button>
        </form>
      </aside>

      <main className="flex-1 md:ml-64 p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Menu Items</h1>
              <p className="text-gray-500 mt-1">{items.length} items on the menu</p>
            </div>
            <button onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-primary/80 transition-colors shadow">
              <Plus className="w-5 h-5"/> Add Item
            </button>
          </div>

          {showAddForm && (
            <div className="bg-white rounded-2xl border border-primary/10 shadow-sm p-6 mb-8">
              <h2 className="text-xl font-bold text-primary mb-4">Add New Menu Item</h2>
              <form action={async (fd: FormData) => {
                await createMenuItem(fd)
                setShowAddForm(false)
              }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Name *</label>
                  <input name="name" required placeholder="e.g. Chicken Pasta" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"/>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Price (₦) *</label>
                  <input name="price" type="number" required placeholder="e.g. 2500" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"/>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Category *</label>
                  <select name="category" required className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Image URL</label>
                  <input name="image_url" placeholder="https://..." className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"/>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Description</label>
                  <textarea name="description" rows={2} placeholder="Short description of the dish..." className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"/>
                </div>
                <div className="sm:col-span-2 flex gap-3 justify-end">
                  <button type="button" onClick={() => setShowAddForm(false)} className="px-5 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50">Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/80">Add Item</button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {CATEGORIES.map(cat => {
              const catItems = items.filter(i => i.category === cat)
              if (catItems.length === 0) return null
              return (
                <div key={cat}>
                  <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">{cat}</h2>
                  <div className="space-y-3">
                    {catItems.map(item => (
                      <div key={item.id} className={`bg-white rounded-2xl border ${item.is_sold_out ? "border-red-100 opacity-70" : "border-gray-100"} shadow-sm p-5`}>
                        {editingId === item.id ? (
                          <form action={async (fd: FormData) => {
                            await updateMenuItem(fd)
                            setEditingId(null)
                          }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input type="hidden" name="id" value={item.id}/>
                            <div>
                              <label className="text-xs font-semibold text-gray-500 block mb-1">Name</label>
                              <input name="name" defaultValue={item.name} required className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"/>
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-gray-500 block mb-1">Price (₦)</label>
                              <input name="price" type="number" defaultValue={item.price} required className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"/>
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-gray-500 block mb-1">Category</label>
                              <select name="category" defaultValue={item.category} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-gray-500 block mb-1">Image URL</label>
                              <input name="image_url" defaultValue={item.image_url || ""} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"/>
                            </div>
                            <div className="sm:col-span-2">
                              <label className="text-xs font-semibold text-gray-500 block mb-1">Description</label>
                              <textarea name="description" defaultValue={item.description || ""} rows={2} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"/>
                            </div>
                            <input type="hidden" name="is_sold_out" value={String(item.is_sold_out)}/>
                            <div className="sm:col-span-2 flex gap-3 justify-end">
                              <button type="button" onClick={() => setEditingId(null)} className="flex items-center gap-1 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50"><X className="w-4 h-4"/>Cancel</button>
                              <button type="submit" className="flex items-center gap-1 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/80"><Check className="w-4 h-4"/>Save</button>
                            </div>
                          </form>
                        ) : (
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 flex-wrap">
                                <span className="font-bold text-gray-900">{item.name}</span>
                                <span className="font-bold text-primary">₦{item.price.toLocaleString()}</span>
                                {item.is_sold_out && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">Sold Out</span>}
                              </div>
                              {item.description && <p className="text-sm text-gray-500 mt-1">{item.description}</p>}
                              {item.image_url && <p className="text-xs text-gray-400 mt-1 truncate max-w-xs">{item.image_url}</p>}
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <button onClick={() => handleToggle(item.id, item.is_sold_out)} disabled={loading===item.id}
                                className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${item.is_sold_out ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-700 hover:bg-red-200"}`}>
                                {item.is_sold_out ? "Mark Available" : "Mark Sold Out"}
                              </button>
                              <button onClick={() => setEditingId(item.id)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
                                <Pencil className="w-4 h-4"/>
                              </button>
                              {deletingId === item.id ? (
                                <div className="flex items-center gap-1">
                                  <button onClick={() => handleDelete(item.id)} disabled={loading===item.id} className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg font-semibold">Delete</button>
                                  <button onClick={() => setDeletingId(null)} className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg font-semibold">Cancel</button>
                                </div>
                              ) : (
                                <button onClick={() => setDeletingId(item.id)} className="p-2 rounded-xl hover:bg-red-50 text-red-400 transition-colors">
                                  <Trash2 className="w-4 h-4"/>
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
