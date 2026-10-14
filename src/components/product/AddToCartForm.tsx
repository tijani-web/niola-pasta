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
    category?: string
    description?: string | null
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
  
  // Chicken choice: Peppered Chicken (+₦0) vs Crunchy Chicken (+₦200)
  const isChickenDish =
    product.name.toLowerCase().includes('chicken') ||
    (Boolean(product.description) && product.description!.toLowerCase().includes('chicken')) ||
    (product.variants && Array.isArray(product.variants) && product.variants.some((v: any) => String(v).toLowerCase().includes('chicken'))) ||
    (!product.name.toLowerCase().includes('turkey') && 
     !product.name.toLowerCase().includes('gizzy') && 
     !product.name.toLowerCase().includes('sardine') && 
     !product.name.toLowerCase().includes('egg') &&
     (product.category === 'Big Plate' || product.category === 'Small Plate' || product.category === 'Budget Plate' || product.category === 'Budget'))

  const [selectedChicken, setSelectedChicken] = useState<'Peppered Chicken' | 'Crunchy Chicken'>('Peppered Chicken')
  
  const { addItem } = useCartStore()

  const handleExtraToggle = (extra: {name: string, price: number}) => {
    setSelectedExtras(prev => 
      prev.some(e => e.name === extra.name)
        ? prev.filter(e => e.name !== extra.name)
        : [...prev, extra]
    )
  }

  const chickenExtraPrice = isChickenDish && selectedChicken === 'Crunchy Chicken' ? 200 : 0
  const unitPrice = product.price + chickenExtraPrice
  const totalExtrasPrice = selectedExtras.reduce((sum, e) => sum + e.price, 0)
  const totalPrice = (unitPrice + totalExtrasPrice) * quantity

  const handleAddToCart = () => {
    if (product.isSoldOut) return

    let variantLabel: string | null = selectedVariant
    if (isChickenDish) {
      const chickenTag = selectedChicken === 'Crunchy Chicken' ? 'Crunchy Chicken (+₦200)' : 'Peppered Chicken'
      variantLabel = selectedVariant ? `${selectedVariant} • ${chickenTag}` : chickenTag
    }

    addItem({
      menuItemId: product.id,
      name: product.name,
      price: unitPrice,
      quantity,
      imageUrl: product.imageUrl,
      variant: variantLabel,
      extras: selectedExtras
    })
  }

  if (product.isSoldOut) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 font-medium text-center">
        This item is currently sold out. Check back later!
      </div>
    )
  }

  const parsedExtras: {name: string, price: number}[] = Array.isArray(product.extras)
    ? product.extras.flatMap((e: any) => {
        const item = typeof e === 'string' ? { name: e, price: 0 } : e
        if (item.name?.toLowerCase() === 'extra chicken' || item.name?.toLowerCase() === 'chicken') {
          return [
            { name: 'Extra Peppered Chicken', price: 1300 },
            { name: 'Extra Crunchy Chicken', price: 1500 }
          ]
        }
        return [item]
      })
    : (isChickenDish ? [
        { name: 'Extra Peppered Chicken', price: 1300 },
        { name: 'Extra Crunchy Chicken', price: 1500 },
        { name: 'Extra Plantain', price: 500 },
        { name: 'Extra Sausage', price: 500 },
        { name: 'Extra Boiled Egg', price: 500 },
      ] : [])

  const parsedVariants: string[] = Array.isArray(product.variants)
    ? product.variants.map((v: any) => typeof v === 'string' ? v : v?.name || String(v))
    : []

  return (
    <div className="space-y-8">
      {/* Choice of Chicken (Peppered vs Crunchy) */}
      {isChickenDish && (
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-primary/10 pb-2">
            <div>
              <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                <span>🍗</span>
                <span>Choice of Chicken</span>
              </h3>
              <p className="text-xs text-foreground/60 mt-0.5">
                Select your preferred chicken preparation
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-accent/10 text-accent">
              Included
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                name: 'Peppered Chicken' as const,
                tag: 'Signature',
                price: 0,
                desc: 'Juicy chicken cooked in rich signature pepper sauce',
                badge: 'Same Price (+₦0)'
              },
              {
                name: 'Crunchy Chicken' as const,
                tag: 'Crispy',
                price: 200,
                desc: 'Deep-fried golden crunch with irresistible savory coat',
                badge: '+₦200'
              }
            ].map(opt => {
              const isSelected = selectedChicken === opt.name
              return (
                <button
                  key={opt.name}
                  type="button"
                  onClick={() => setSelectedChicken(opt.name)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-accent bg-accent/5 ring-2 ring-accent shadow-sm'
                      : 'border-primary/10 hover:border-primary/30 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-foreground">
                          {opt.name}
                        </span>
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-accent text-white' : 'bg-primary/10 text-primary'
                        }`}>
                          {opt.tag}
                        </span>
                      </div>
                      <p className="text-xs text-foreground/60 mt-1 leading-snug">
                        {opt.desc}
                      </p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isSelected ? 'border-accent bg-accent' : 'border-gray-300'
                    }`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-primary/5 mt-2">
                    <span className="text-xs text-foreground/50">Price Adjustment</span>
                    <span className={`text-sm font-black ${opt.price > 0 ? 'text-accent' : 'text-green-600'}`}>
                      {opt.badge}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Additional Variants Selection if configured */}
      {parsedVariants.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-foreground border-b border-primary/10 pb-2">Choice of Protein</h3>
          <div className="grid grid-cols-2 gap-3">
            {parsedVariants.map((variant: string) => (
              <button
                key={variant}
                type="button"
                onClick={() => setSelectedVariant(variant)}
                className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                  selectedVariant === variant 
                    ? 'border-accent bg-accent/5 text-accent font-bold' 
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
                  className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-accent bg-accent/5 shadow-sm' 
                      : 'border-primary/10 hover:border-primary/30 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={isSelected}
                      onChange={() => handleExtraToggle(extra)}
                      className="w-5 h-5 rounded text-accent focus:ring-accent accent-accent cursor-pointer"
                    />
                    <span className={`font-medium ${isSelected ? 'text-accent font-semibold' : 'text-foreground'}`}>
                      {extra.name}
                    </span>
                  </div>
                  <span className="text-foreground/80 font-bold text-sm">
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
              type="button"
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white text-primary hover:shadow-sm transition-all"
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="text-lg font-bold w-6 text-center">{quantity}</span>
            <button 
              type="button"
              onClick={() => setQuantity(q => q + 1)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white text-primary hover:shadow-sm transition-all"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        <button 
          type="button"
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
