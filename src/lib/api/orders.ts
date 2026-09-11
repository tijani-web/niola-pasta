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

import { Resend } from 'resend'

async function sendNotifications(token: string, params: CreateOrderParams) {
  try {
    const itemsText = params.items.map((item: any) => {
      let text = `${item.quantity}x ${item.name}`
      if (item.variant) text += ` (${item.variant})`
      if (item.extras && item.extras.length > 0) text += ` + ${item.extras.map((e: any) => e.name).join(', ')}`
      return text
    }).join('<br/>')

    // Send Email via Resend
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'MyPasta.ng@gmail.com',
        subject: `New Order: ${token} - ₦${params.subtotal.toLocaleString()}`,
        html: `
          <h2>New Order Received!</h2>
          <p><strong>Order ID:</strong> ${token}</p>
          <p><strong>Customer:</strong> ${params.customerName} (${params.customerPhone})</p>
          <p><strong>Address:</strong> ${params.deliveryAddress}</p>
          <h3>Items:</h3>
          <p>${itemsText}</p>
          <h3>Subtotal: ₦${params.subtotal.toLocaleString()}</h3>
          <p><a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://niolaspasta.com'}/admin/dashboard">View in Admin Dashboard</a></p>
        `
      })
    }

    // Send SMS via Termii
    if (process.env.TERMII_API_KEY && process.env.TERMII_SENDER_ID) {
      const smsMessage = `New Order ${token}!\n${params.customerName}\n${params.customerPhone}\n₦${params.subtotal.toLocaleString()}`
      await fetch('https://api.ng.termii.com/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: '2347030462283', // Owner's number
          from: process.env.TERMII_SENDER_ID,
          sms: smsMessage,
          type: 'plain',
          api_key: process.env.TERMII_API_KEY,
          channel: 'generic'
        })
      })
    }
  } catch (err) {
    console.error('Failed to send notifications:', err)
  }
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
  
  // Fire and forget notifications
  sendNotifications(data.order_token, params)
  
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
