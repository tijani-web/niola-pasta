import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const text = await request.text()
    
    // Validate signature
    const signature = request.headers.get('x-paystack-signature')
    const secret = process.env.PAYSTACK_SECRET_KEY || ''
    
    const hash = crypto.createHmac('sha512', secret).update(text).digest('hex')
    
    if (hash !== signature) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 400 })
    }
    
    const event = JSON.parse(text)
    
    if (event.event === 'charge.success') {
      const reference = event.data.reference
      
      const supabase = await createClient()
      
      // Update order status based on successful payment
      await (supabase.from('orders') as any)
        .update({ payment_status: 'PAID', order_status: 'Pending Confirmation' })
        .eq('paystack_reference', reference)
        
      // Here you would also integrate Resend email notifications:
      // await resend.emails.send({ ... })
    }
    
    return NextResponse.json({ status: 'success' })
  } catch (error) {
    console.error('Webhook Error:', error)
    return NextResponse.json({ message: 'Webhook error' }, { status: 500 })
  }
}
