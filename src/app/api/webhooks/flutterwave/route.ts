import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    console.log('Webhook triggered!')
    const text = await request.text()
    const signature = request.headers.get('verif-hash')
    const secretHash = process.env.FLUTTERWAVE_SECRET_HASH || ''
    
    // Validate signature
    if (!signature || signature !== secretHash) {
      console.error(`Signature mismatch! Expected: ${secretHash}, Got: ${signature}`)
      return NextResponse.json({ message: 'Invalid signature' }, { status: 400 })
    }

    const event = JSON.parse(text)

    // Flutterwave sends a FLAT payload (no event.data nesting).
    // Fields: event.status, event.txRef, event.id, event["event.type"]
    const status = event.status        // "successful"
    const txRef = event.txRef          // "NP-XXXX-XXXX"
    const transactionId = String(event.id)

    console.log(`Webhook status: ${status}, txRef: ${txRef}, transactionId: ${transactionId}`)

    if (status === 'successful' && txRef) {
      console.log(`Marking order ${txRef} as PAID...`)
      const { markOrderPaid } = await import('@/lib/api/orders')
      await markOrderPaid(txRef, transactionId)
      console.log(`Order ${txRef} marked PAID successfully!`)
    } else {
      console.log(`Skipping — status was: ${status}`)
    }
    
    return NextResponse.json({ status: 'success' })
  } catch (error) {
    console.error('Webhook Error:', error)
    return NextResponse.json({ message: 'Webhook error' }, { status: 500 })
  }
}
