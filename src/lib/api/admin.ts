'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  await (supabase.from('orders') as any).update({ order_status: status, updated_at: new Date().toISOString() }).eq('id', orderId)
  revalidatePath('/admin/dashboard')
}

export async function createMenuItem(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const name = formData.get('name') as string
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  const price = parseFloat(formData.get('price') as string)
  const category = formData.get('category') as string
  const description = formData.get('description') as string
  const imageUrl = formData.get('image_url') as string
  const isSoldOut = formData.get('is_sold_out') === 'true'

  await supabase.from('menu_items').insert({
    slug, name, price, category,
    description: description || null,
    image_url: imageUrl || null,
    is_sold_out: isSoldOut,
  } as any)
  revalidatePath('/admin/dashboard/menu')
}

export async function updateMenuItem(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const price = parseFloat(formData.get('price') as string)
  const category = formData.get('category') as string
  const description = formData.get('description') as string
  const imageUrl = formData.get('image_url') as string
  const isSoldOut = formData.get('is_sold_out') === 'true'

  await (supabase.from('menu_items') as any).update({
    name, price, category,
    description: description || null,
    image_url: imageUrl || null,
    is_sold_out: isSoldOut,
  }).eq('id', id)
  revalidatePath('/admin/dashboard/menu')
}

export async function deleteMenuItem(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  await (supabase.from('menu_items') as any).delete().eq('id', id)
  revalidatePath('/admin/dashboard/menu')
}

export async function toggleSoldOut(id: string, currentValue: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  await (supabase.from('menu_items') as any).update({ is_sold_out: !currentValue }).eq('id', id)
  revalidatePath('/admin/dashboard/menu')
}
