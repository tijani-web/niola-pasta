'use server'

import { createClient } from '@/lib/supabase/server'
import { Json } from '@/types/database'

interface CreateOrderParams {
  customerName: string
  customerPhone: string
  customerEmail: string | null
  deliveryAddress: string
  items: any[]
  subtotal: number
  paystackReference: string
}

export async function createOrder(params: CreateOrderParams) {
  const supabase = await createClient()
  
  // Generate a random token
  const orderToken = `NP-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`
  
  const { data, error } = await supabase
    .from('orders')
    .insert({
      order_token: orderToken,
      customer_name: params.customerName,
      customer_phone: params.customerPhone,
      customer_email: params.customerEmail,
      delivery_address: params.deliveryAddress,
      items: params.items as Json,
      subtotal: params.subtotal,
      paystack_reference: params.paystackReference,
      payment_status: 'PAID', // In reality, the webhook should verify this
      order_status: 'Pending Confirmation'
    } as any)
    .select('order_token')
    .single() as any
    
  if (error) {
    console.error('Failed to insert order:', error)
    throw new Error('Failed to create order')
  }
  
  return data.order_token
}

export async function getOrderByToken(token: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('order_token', token)
    .single() as any
    
  if (error) {
    return null
  }
  
  return data
}
