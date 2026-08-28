'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/useCartStore'
import { Plus, Minus, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react'

interface AddToCartFormProps {
  product: {
    id: string
    name: string
    price: number
    imageUrl: string | null
    isSoldOut: boolean
    variants: any
    extras: any
  }
}

export function AddToCartForm({ product }: AddToCartFormProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<string | null>(
    product.variants && Array.isArray(product.variants) && product.variants.length > 0
      ? product.variants[0]
      : null
  )
  const [selectedExtras, setSelectedExtras] = useState<{name: string, price: number}[]>([])
  
  const { addItem } = useCartStore()

  const handleExtraToggle = (extra: {name: string, price: number}) => {
    setSelectedExtras(prev => 
      prev.some(e => e.name === extra.name)
        ? prev.filter(e => e.name !== extra.name)
        : [...prev, extra]
    )
  }

  const handleAddToCart = () => {
    if (product.isSoldOut) return

    addItem({
      menuItemId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      imageUrl: product.imageUrl,
      variant: selectedVariant,
      extras: selectedExtras
    })
  }

  const totalExtrasPrice = selectedExtras.reduce((sum, e) => sum + e.price, 0)
  const totalPrice = (product.price + totalExtrasPrice) * quantity

  if (product.isSoldOut) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 font-medium text-center">
        This item is currently sold out. Check back later!
      </div>
    )
  }

  const parsedExtras: {name: string, price: number}[] = Array.isArray(product.extras)
    ? product.extras.map((e: any) => typeof e === 'string' ? { name: e, price: 0 } : e)
    : []

  const parsedVariants: string[] = Array.isArray(product.variants)
    ? product.variants.map((v: any) => typeof v === 'string' ? v : v?.name || String(v))
    : []

  const scrollExtras = (direction: 'left' | 'right') => {
    const container = document.getElementById('extras-container')
    if (container) {
      const scrollAmount = 200
      container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <div className="space-y-8">
      {/* Variants Selection */}
      {parsedVariants.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-foreground border-b border-primary/10 pb-2">Choice of Protein</h3>
          <div className="grid grid-cols-2 gap-3">
            {parsedVariants.map((variant: string) => (
              <button
                key={variant}
                onClick={() => setSelectedVariant(variant)}
                className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                  selectedVariant === variant 
                    ? 'border-accent bg-accent/5 text-accent' 
                    : 'border-primary/10 text-foreground/70 hover:border-primary/30'
                }`}
              >
                {variant}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Extras Selection */}
      {parsedExtras.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-foreground border-b border-primary/10 pb-2">Add Extras (Optional)</h3>
          <div className="space-y-2">
            {parsedExtras.map((extra: {name: string, price: number}) => {
              const isSelected = selectedExtras.some(e => e.name === extra.name)
              return (
                <label 
                  key={extra.name}
                  className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-accent bg-accent/5' 
                      : 'border-primary/10 hover:border-primary/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={isSelected}
                      onChange={() => handleExtraToggle(extra)}
                      className="w-5 h-5 rounded text-accent focus:ring-accent accent-accent cursor-pointer"
                    />
                    <span className={`font-medium ${isSelected ? 'text-accent' : 'text-foreground'}`}>
                      {extra.name}
                    </span>
                  </div>
                  <span className="text-foreground/70 font-medium">
                    +{extra.price === 0 ? 'FREE' : `₦${extra.price.toLocaleString()}`}
                  </span>
                </label>
              )
            })}
          </div>
        </div>
      )}

      {/* Quantity & Add to Cart */}
      <div className="pt-6 border-t border-primary/10 space-y-6">
        <div className="flex items-center justify-between">
          <span className="font-bold text-foreground">Quantity</span>
          <div className="flex items-center gap-4 bg-primary/5 rounded-full px-2 py-1">
            <button 
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white text-primary hover:shadow-sm transition-all"
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="text-lg font-bold w-6 text-center">{quantity}</span>
            <button 
              onClick={() => setQuantity(q => q + 1)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white text-primary hover:shadow-sm transition-all"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        <button 
          onClick={handleAddToCart}
          className="w-full bg-accent hover:bg-accent/90 text-white font-medium py-4 px-6 rounded-xl flex items-center justify-between transition-all transform hover:scale-[1.02] active:scale-95 shadow-md hover:shadow-lg"
        >
          <span className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Add to Order
          </span>
          <span className="font-bold bg-white/20 px-3 py-1 rounded-lg">
            ₦{totalPrice.toLocaleString()}
          </span>
        </button>
      </div>
    </div>
  )
}
