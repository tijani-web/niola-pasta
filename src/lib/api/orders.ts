'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Json } from '@/types/database'

interface CreateOrderParams {
  orderToken: string
  customerName: string
  customerPhone: string
  customerEmail: string | null
  deliveryAddress: string
  items: any[]
  subtotal: number
  paystackReference?: string
  paymentStatus?: 'PENDING' | 'PAID'
}

import { Resend } from 'resend'

async function sendNotifications(token: string, params: CreateOrderParams) {
  try {
    const isPickup = params.deliveryAddress === 'PICKUP'

    const itemsRows = params.items.map((item: any) => {
      const extrasTotal = item.extras?.reduce((s: number, e: any) => s + e.price, 0) || 0
      const lineTotal = (item.price + extrasTotal) * item.quantity
      const variantStr = item.variant ? ` <span style="color:#888;font-size:13px;">(${item.variant})</span>` : ''
      const extrasStr = item.extras?.length ? `<br/><span style="color:#aaa;font-size:12px;">+ ${item.extras.map((e: any) => e.name).join(', ')}</span>` : ''
      return `<tr>
        <td style="padding:10px 16px;border-bottom:1px solid #f0ebe4;">
          <span style="font-weight:600;">${item.quantity}&times; ${item.name}</span>${variantStr}${extrasStr}
        </td>
        <td style="padding:10px 16px;border-bottom:1px solid #f0ebe4;text-align:right;font-weight:700;white-space:nowrap;">
          &#8358;${lineTotal.toLocaleString()}
        </td>
      </tr>`
    }).join('')

    const itemsSmsText = params.items.map((item: any) => {
      let text = `${item.quantity}x ${item.name}`
      if (item.variant) text += ` (${item.variant})`
      return text
    }).join(', ')

    const deliveryRow = isPickup
      ? `<tr><td colspan="2" style="padding:12px 16px;background:#f9f5f0;border-radius:8px;">
           <strong style="color:#7c3f00;">PICKUP ORDER</strong><br/>
           <span style="color:#555;font-size:14px;">Customer collects at: Uniosun second gate, opposite VIP Lodge, Osogbo</span>
         </td></tr>`
      : `<tr><td colspan="2" style="padding:12px 16px;background:#fff8f0;border-radius:8px;">
           <strong style="color:#7c3f00;">DELIVERY ORDER</strong><br/>
           <span style="color:#555;font-size:14px;">Deliver to: ${params.deliveryAddress}</span>
         </td></tr>`

    const emailHtml = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f0ea;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0ea;padding:32px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
<tr><td style="background:linear-gradient(135deg,#7c3f00,#b05a00);padding:32px 40px;text-align:center;">
  <h1 style="margin:0;color:#fff;font-size:28px;font-weight:800;">Niola's Pasta</h1>
  <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">New Order Notification</p>
</td></tr>
<tr><td style="background:#fff3cd;padding:14px 40px;border-bottom:2px solid #ffc107;text-align:center;">
  <span style="font-size:16px;font-weight:700;color:#7c5c00;">NEW ORDER — ${token}</span>
</td></tr>
<tr><td style="padding:32px 40px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f5f0;border-radius:12px;padding:20px;margin-bottom:24px;border:1px solid #ede8e0;">
    <tr><td colspan="2" style="padding-bottom:12px;font-weight:800;font-size:13px;color:#7c3f00;text-transform:uppercase;letter-spacing:0.5px;">Customer Details</td></tr>
    <tr>
      <td style="padding:4px 0;color:#888;font-size:14px;width:100px;">Name</td>
      <td style="padding:4px 0;font-weight:600;">${params.customerName}</td>
    </tr>
    <tr>
      <td style="padding:4px 0;color:#888;font-size:14px;">Phone</td>
      <td style="padding:4px 0;font-weight:600;"><a href="tel:${params.customerPhone}" style="color:#b05a00;text-decoration:none;">${params.customerPhone}</a></td>
    </tr>
    ${params.customerEmail ? `<tr><td style="padding:4px 0;color:#888;font-size:14px;">Email</td><td style="padding:4px 0;font-weight:600;">${params.customerEmail}</td></tr>` : ''}
  </table>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">${deliveryRow}</table>
  <p style="font-weight:800;font-size:13px;color:#7c3f00;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 8px;">Order Items</p>
  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0ebe4;border-radius:12px;overflow:hidden;margin-bottom:16px;">
    <thead><tr style="background:#fdf8f3;">
      <th style="padding:10px 16px;text-align:left;font-size:12px;color:#888;text-transform:uppercase;">Item</th>
      <th style="padding:10px 16px;text-align:right;font-size:12px;color:#888;text-transform:uppercase;">Price</th>
    </tr></thead>
    <tbody>${itemsRows}</tbody>
    <tfoot><tr style="background:#7c3f00;">
      <td style="padding:14px 16px;font-weight:800;color:#fff;font-size:16px;">Total Paid</td>
      <td style="padding:14px 16px;font-weight:900;color:#fff;font-size:18px;text-align:right;">&#8358;${params.subtotal.toLocaleString()}</td>
    </tr></tfoot>
  </table>
  <div style="text-align:center;margin-top:32px;">
    <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://niolaspasta.com'}/admin/dashboard"
       style="display:inline-block;background:#7c3f00;color:#fff;text-decoration:none;padding:14px 32px;border-radius:50px;font-weight:800;font-size:16px;">
      View Admin Dashboard
    </a>
  </div>
</td></tr>
<tr><td style="background:#f9f5f0;padding:20px 40px;text-align:center;border-top:1px solid #ede8e0;">
  <p style="margin:0;color:#aaa;font-size:12px;">Automated notification from Niola's Pasta &bull; Order: <strong>${token}</strong></p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`

    // Send Email via Resend
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const emailResult = await resend.emails.send({
        from: 'Niolas Pasta <orders@niolaspasta.com>',
        to: 'MyPasta.ng@gmail.com',
        subject: `New Order ${token} — N${params.subtotal.toLocaleString()} (${isPickup ? 'PICKUP' : 'DELIVERY'})`,
        html: emailHtml
      })
      console.log('Resend result:', JSON.stringify(emailResult))
    }

    // Send SMS via Termii — 'dnd' channel required for Nigerian numbers with N-Alert
    if (process.env.TERMII_API_KEY && process.env.TERMII_SENDER_ID) {
      const deliveryLabel = isPickup ? 'PICKUP' : `DELIVERY to: ${params.deliveryAddress}`
      const smsMessage = `New Order ${token}!\nItems: ${itemsSmsText}\nCustomer: ${params.customerName}\nPhone: ${params.customerPhone}\n${deliveryLabel}\nTotal: N${params.subtotal}`
      const termiiRes = await fetch('https://api.ng.termii.com/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: '2347030462283',
          from: process.env.TERMII_SENDER_ID,
          sms: smsMessage,
          type: 'plain',
          api_key: process.env.TERMII_API_KEY,
          channel: 'dnd'
        }),
        signal: AbortSignal.timeout(10000),
      })
      const termiiData = await termiiRes.json()
      console.log('Termii result:', JSON.stringify(termiiData))
    }
  } catch (err) {
    console.error('Failed to send notifications:', err)
  }
}

export async function createOrder(params: CreateOrderParams) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('orders')
    .insert({
      order_token: params.orderToken,
      customer_name: params.customerName,
      customer_phone: params.customerPhone,
      customer_email: params.customerEmail,
      delivery_address: params.deliveryAddress,
      items: params.items as Json,
      subtotal: params.subtotal,
      paystack_reference: params.paystackReference || null,
      payment_status: params.paymentStatus || 'PAID',
      order_status: 'Pending Confirmation'
    } as any)
    .select('order_token')
    .single() as any
    
  if (error) {
    console.error('Failed to insert order:', error)
    throw new Error('Failed to create order')
  }
  
  // Await notifications so Vercel doesn't terminate before they send
  if (params.paymentStatus !== 'PENDING') {
    await sendNotifications(data.order_token, params)
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

export async function markOrderPaid(token: string, txRef: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('orders')
    .update({ 
      payment_status: 'PAID',
      paystack_reference: txRef
    } as any)
    .eq('order_token', token)
    .select()
    .single() as any
    
  if (error) {
    console.error('Failed to mark order paid:', error)
    throw new Error('Failed to mark order paid')
  }

  if (data) {
    await sendNotifications(token, {
      customerName: data.customer_name,
      customerPhone: data.customer_phone,
      customerEmail: data.customer_email,
      deliveryAddress: data.delivery_address,
      items: data.items,
      subtotal: data.subtotal,
      paymentStatus: 'PAID'
    })
  }

  return true
}
