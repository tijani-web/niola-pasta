import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const text = await request.text()
    const signature = request.headers.get('verif-hash')
    const secretHash = process.env.FLUTTERWAVE_SECRET_HASH || ''
    
    // Validate signature
    if (!signature || signature !== secretHash) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 400 })
    }
    
    const event = JSON.parse(text)
    
    if (event.event === 'charge.completed' && event.data.status === 'successful') {
      const reference = event.data.id.toString() // Flutterwave sends 'id' as the transaction_id
      
      const supabase = createAdminClient()
      
      // Update order status based on successful payment
      await (supabase.from('orders') as any)
        .update({ payment_status: 'PAID', order_status: 'Pending Confirmation' })
        .eq('paystack_reference', reference)
    }
    
    return NextResponse.json({ status: 'success' })
  } catch (error) {
    console.error('Webhook Error:', error)
    return NextResponse.json({ message: 'Webhook error' }, { status: 500 })
  }
}
