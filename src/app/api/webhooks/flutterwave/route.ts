import { NextResponse } from 'next/server'

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
      const txRef = event.data.tx_ref // Our order_token was passed as tx_ref
      const transactionId = event.data.id.toString()
      
      // Update order status based on successful payment
      if (txRef) {
        const { markOrderPaid } = await import('@/lib/api/orders')
        await markOrderPaid(txRef, transactionId)
      }
    }
    
    return NextResponse.json({ status: 'success' })
  } catch (error) {
    console.error('Webhook Error:', error)
    return NextResponse.json({ message: 'Webhook error' }, { status: 500 })
  }
}
