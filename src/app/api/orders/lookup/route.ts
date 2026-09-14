import { NextResponse } from 'next/server'
import { getOrderByToken } from '@/lib/api/orders'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Token required' }, { status: 400 })
  }

  const order = await getOrderByToken(token)

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  // Only return safe, non-sensitive fields
  return NextResponse.json({
    order_token: order.order_token,
    order_status: order.order_status,
    payment_status: order.payment_status,
    customer_name: order.customer_name,
  })
}
