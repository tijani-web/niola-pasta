const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  const { data, error } = await supabase.from('menu_items').insert([
    {
      name: 'Pasta × Turkey × Plantain',
      slug: 'pasta-turkey-plantain',
      description: 'Our signature pasta served with juicy, well-seasoned turkey and sweet fried plantain.',
      short_description: 'Signature pasta with turkey and plantain.',
      price: 6000,
      category: 'Big Plate',
      is_sold_out: false,
      image_url: null,
      variants: JSON.stringify([]),
      extras: JSON.stringify([
        { name: 'Sausage', price: 500 },
        { name: 'Boiled Egg', price: 500 },
        { name: 'Extra Turkey', price: 2000 }
      ])
    }
  ])

  if (error) {
    console.error('Error inserting menu item:', error)
  } else {
    console.log('Successfully inserted menu item!', data)
  }
}

run()
