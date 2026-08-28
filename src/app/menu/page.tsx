import { getMenuItems } from '@/lib/api/menu'
import { MenuClient } from './MenuClient'

export const metadata = {
  title: 'Full Menu | Niola\'s Pasta',
  description: 'Browse our full menu of delicious stir-fried pasta options.',
}

export default async function MenuPage() {
  const dbItems = await getMenuItems()
  
  // Fallback if DB is empty
  const items = dbItems.length > 0 ? dbItems : [
    {
      id: '1', slug: 'chicken-pasta', name: 'Chicken Pasta', short_description: 'Stir-fried pasta with juicy peppered chicken.', price: 2800, category: 'Big Plate', image_url: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&q=80&w=400', is_sold_out: false
    },
    {
      id: '2', slug: 'chicken-sausage-pasta', name: 'Chicken & Sausage Pasta', short_description: 'Stir-fried pasta loaded with chicken and savory sausage.', price: 3200, category: 'Big Plate', image_url: 'https://images.unsplash.com/photo-1626844131082-256783844137?auto=format&fit=crop&q=80&w=400', is_sold_out: false
    },
    {
      id: '3', slug: 'egg-pasta', name: 'Egg Pasta', short_description: 'Tasty stir-fried pasta with well-seasoned egg.', price: 2600, category: 'Budget Plate', image_url: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&q=80&w=400', is_sold_out: false
    }
  ]

  // Group items
  const categories = ['Big Plate', 'Budget Plate', 'Small Plate', 'Combo', 'Sides']
  
  return (
    <div className="bg-white min-h-screen pb-24">
      <div className="bg-primary/5 py-12 md:py-20 border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif mb-4">Our Menu</h1>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Explore our range of flavour-packed stir-fried pasta dishes. Everything is made fresh to order.
          </p>
        </div>
      </div>

      <MenuClient items={items} categories={categories} />
    </div>
  )
}
