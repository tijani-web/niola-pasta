'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { ShoppingCart, Eye } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'

interface ProductCardProps {
  id: string
  slug: string
  name: string
  shortDescription: string | null
  price: number
  imageUrl: string | null
  isSoldOut: boolean
  hasVariants?: boolean
}

export function ProductCard({ id, slug, name, shortDescription, price, imageUrl, isSoldOut, hasVariants }: ProductCardProps) {
  const { addItem } = useCartStore()
  const [isAdded, setIsAdded] = useState(false)

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isSoldOut || hasVariants) return

    addItem({ menuItemId: id, name, price, quantity: 1, imageUrl })
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 1500)
  }

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col border border-primary/5 hover:border-accent/20 hover:-translate-y-1">
      {/* Image */}
      <Link href={`/product/${slug}`} className="block relative">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
              </svg>
            </div>
          )}

          {/* Hover overlay with quick view */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
            <Link
              href={`/product/${slug}`}
              onClick={e => e.stopPropagation()}
              className="flex items-center gap-2 bg-white text-primary font-semibold text-sm px-4 py-2.5 rounded-full shadow-lg hover:bg-background transition-colors"
            >
              <Eye className="w-4 h-4" />
              Quick View
            </Link>
          </div>

          {/* Badges */}
          {isSoldOut && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
              SOLD OUT
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <Link href={`/product/${slug}`}>
          <h3 className="font-bold text-lg text-foreground leading-snug group-hover:text-accent transition-colors mb-1">
            {name}
          </h3>
        </Link>
        <p className="text-sm text-foreground/60 line-clamp-2 mb-4 flex-1">
          {shortDescription}
        </p>

        <div className="flex items-center justify-between gap-3">
          <span className="text-xl font-bold text-primary">
            ₦{price.toLocaleString()}
          </span>

          {isSoldOut ? (
            <span className="text-sm text-gray-400 font-medium">Unavailable</span>
          ) : hasVariants ? (
            <Link
              href={`/product/${slug}`}
              className="flex items-center gap-1.5 bg-primary text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-accent transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              Choose
            </Link>
          ) : (
            <button
              onClick={handleQuickAdd}
              className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all duration-300 ${
                isAdded
                  ? 'bg-green-500 text-white scale-95'
                  : 'bg-primary text-white hover:bg-accent'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              {isAdded ? '✓ Added!' : 'Add'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
