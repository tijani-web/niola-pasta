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
    console.log('FULL FLUTTERWAVE EVENT:', JSON.stringify(event, null, 2))

    // Handle both flat (test) and nested (live) payload structures
    const dataObj = event.data || event
    
    const status = dataObj.status
    const txRef = dataObj.tx_ref || dataObj.txRef
    const transactionId = dataObj.id ? String(dataObj.id) : ''

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
