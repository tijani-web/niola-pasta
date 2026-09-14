import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    console.log('Webhook triggered!')
    const text = await request.text()
    const signature = request.headers.get('verif-hash')
    const secretHash = process.env.FLUTTERWAVE_SECRET_HASH || ''
    
    console.log(`Received Signature: ${signature}`)
    
    // Validate signature
    if (!signature || signature !== secretHash) {
      console.error(`Signature mismatch! Expected: ${secretHash}, Got: ${signature}`)
      return NextResponse.json({ message: 'Invalid signature' }, { status: 400 })
    }
    
    console.log('Signature matched! Parsing event...')
    const event = JSON.parse(text)
    console.log('FULL FLUTTERWAVE EVENT:', JSON.stringify(event, null, 2))
    console.log('event.event:', event.event)
    console.log('event.data?.status:', event.data?.status)
    
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
