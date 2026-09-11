'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
  const router = useRouter()

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isSoldOut || hasVariants) return

    addItem({ menuItemId: id, name, price, quantity: 1, imageUrl })
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 1500)
  }

  return (
    <div
      className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col border border-primary/5 hover:border-accent/20 hover:-translate-y-1 cursor-pointer"
      onClick={() => router.push(`/product/${slug}`)}
    >
      {/* Image */}
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
              <path d="M18.6 6.62c-1.44 0-2.8.56-3.77 1.53L12 10.66 10.48 12h.01L7.8 14.39c-.64.64-1.49.99-2.4.99-1.87 0-3.39-1.51-3.39-3.38S3.53 8.62 5.4 8.62c.91 0 1.76.35 2.44 1.03l1.13 1 1.51-1.34L9.22 8.2C8.2 7.18 6.84 6.62 5.4 6.62 2.42 6.62 0 9.04 0 12s2.42 5.38 5.4 5.38c1.44 0 2.8-.56 3.77-1.53l2.83-2.5.01.01L13.52 12h-.01l2.69-2.39c.64-.64 1.49-.99 2.4-.99 1.87 0 3.39 1.51 3.39 3.38s-1.52 3.38-3.39 3.38c-.9 0-1.76-.35-2.44-1.03l-1.14-1.01-1.51 1.34 1.27 1.12c1.02 1.01 2.37 1.57 3.82 1.57 2.98 0 5.4-2.41 5.4-5.38s-2.42-5.38-5.4-5.38z"/>
            </svg>
          </div>
        )}

        {/* Hover overlay — uses button not <a> to avoid nested anchors */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); router.push(`/product/${slug}`) }}
            className="flex items-center gap-2 bg-white text-primary font-semibold text-sm px-4 py-2.5 rounded-full shadow-lg hover:bg-background transition-colors"
          >
            <Eye className="w-4 h-4" />
            Quick View
          </button>
        </div>

        {/* Badges */}
        {isSoldOut && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
            SOLD OUT
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-lg text-foreground leading-snug group-hover:text-accent transition-colors mb-1">
          {name}
        </h3>
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
            <button
              onClick={(e) => { e.stopPropagation(); router.push(`/product/${slug}`) }}
              className="flex items-center gap-1.5 bg-primary text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-accent transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              Choose
            </button>
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
