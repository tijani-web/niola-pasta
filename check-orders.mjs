import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function checkOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('order_token, payment_status, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  if (error) {
    console.error('Error fetching orders:', error)
  } else {
    console.log('Last 5 orders:')
    console.table(data)
  }
}

checkOrders()
