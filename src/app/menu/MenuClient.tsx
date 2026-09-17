'use client'

import { useState } from 'react'
import { ProductCard } from '@/components/ui/ProductCard'

interface MenuItem {
  id: string
  slug: string
  name: string
  short_description: string | null
  price: number
  image_url: string | null
  is_sold_out: boolean
  category: string
}

interface MenuClientProps {
  items: MenuItem[]
  categories: string[]
}

export function MenuClient({ items, categories }: MenuClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All')

  // Filter out empty categories
  const activeCategories = categories.filter(cat => items.some(item => item.category === cat))
  const displayCategories = ['All', ...activeCategories]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
      
      {/* Sidebar Filter (Desktop) & Sticky Top Filter (Mobile) */}
      <div className="w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-28 z-10 bg-white/80 backdrop-blur-md lg:bg-transparent lg:backdrop-blur-none py-4 lg:py-0 -mx-4 px-4 lg:mx-0 lg:px-0 border-b border-primary/10 lg:border-none mb-4 lg:mb-0">
        <h2 className="hidden lg:block font-serif text-2xl font-bold text-primary mb-6">Menu Categories</h2>
        <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2 lg:gap-3 pb-2 lg:pb-0 snap-x hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style dangerouslySetInnerHTML={{__html: `
            .hide-scrollbar::-webkit-scrollbar { display: none; }
          `}} />
          {displayCategories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap px-5 py-2.5 lg:py-3 lg:px-4 rounded-xl text-sm font-bold text-left transition-all snap-start ${
                activeCategory === category
                  ? 'bg-primary text-white shadow-md scale-100 lg:scale-[1.02]'
                  : 'bg-primary/5 text-foreground/70 hover:bg-primary/10 hover:text-primary'
              }`}
            >
              {category}
              {category !== 'All' && (
                <span className={`ml-2 text-xs py-0.5 px-2 rounded-full ${activeCategory === category ? 'bg-white/20' : 'bg-primary/10'}`}>
                  {items.filter(i => i.category === category).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content (Items Grid) */}
      <div className="flex-1 w-full min-h-[50vh]">
        {activeCategories
          .filter(cat => activeCategory === 'All' || activeCategory === cat)
          .map(category => {
            const categoryItems = items.filter(item => item.category === category)
            if (categoryItems.length === 0) return null
            
            return (
              <section key={category} className="mb-16 last:mb-0 animate-fade-in">
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-3xl font-serif font-bold text-primary">{category}</h2>
                  <div className="flex-1 h-px bg-primary/10 mt-2"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                  {categoryItems.map(item => (
                    <ProductCard
                      key={item.id}
                      id={item.id}
                      slug={item.slug}
                      name={item.name}
                      shortDescription={item.short_description || ''}
                      price={item.price}
                      imageUrl={item.image_url || null}
                      isSoldOut={item.is_sold_out}
                    />
                  ))}
                </div>
              </section>
            )
          })}
      </div>
    </div>
  )
}
