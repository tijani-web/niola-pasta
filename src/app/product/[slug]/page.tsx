import { getMenuItems } from '@/lib/api/menu'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Star, Check } from 'lucide-react'
import { AddToCartForm } from '@/components/product/AddToCartForm'
import { ProductCard } from '@/components/ui/ProductCard'
import { ReviewForm } from '@/components/product/ReviewForm'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug
  const items = await getMenuItems()
  const product = items.find(i => i.slug === slug)

  if (!product) return { title: 'Product Not Found' }

  const title = `${product.name} | Niola's Pasta`
  const description = product.description || product.short_description || `Order ${product.name} fresh online from Niola's Pasta in Osogbo.`
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://niolaspasta.com'}/product/${product.slug}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      images: product.image_url ? [
        {
          url: product.image_url,
          width: 800,
          height: 800,
          alt: product.name,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product.image_url ? [product.image_url] : [],
    },
    alternates: {
      canonical: url,
    }
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug
  const items = await getMenuItems()
  const product = items.find(i => i.slug === slug)

  if (!product) notFound()

  // Fetch reviews for this product
  const supabase = await createClient()
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('menu_item_id', product.id)
    .order('created_at', { ascending: false }) as any

  const reviewList = reviews || []
  const avgRating = reviewList.length > 0
    ? (reviewList.reduce((sum: number, r: any) => sum + r.rating, 0) / reviewList.length).toFixed(1)
    : null

  // Related products — same category, exclude current
  const related = items.filter(i => i.category === product.category && i.slug !== slug).slice(0, 4)

  const extras = Array.isArray(product.extras) ? product.extras :
    (typeof product.extras === 'string' ? JSON.parse(product.extras) : null)

  // JSON-LD Structured Data for Product
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image_url ? [product.image_url] : [],
    description: product.description || product.short_description || `Delicious ${product.name} from Niola's Pasta.`,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'NGN',
      availability: product.is_sold_out ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://niolaspasta.com'}/product/${product.slug}`,
      seller: {
        '@type': 'Organization',
        name: "Niola's Pasta"
      }
    },
    ...(avgRating ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: avgRating,
        reviewCount: reviewList.length,
      }
    } : {})
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Link href="/menu" className="inline-flex items-center gap-2 text-foreground/60 hover:text-accent mb-8 transition-colors font-medium group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Menu
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image */}
          <div className="space-y-4">
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-gray-100 shadow-lg">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-4">
                  <div className="text-8xl">🍝</div>
                  <p className="text-gray-400 font-medium">Photo Coming Soon</p>
                </div>
              )}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-primary font-bold px-4 py-1.5 rounded-full text-sm shadow">
                {product.category}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            {avgRating && (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex text-highlight">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.round(Number(avgRating)) ? 'fill-current' : ''}`} />
                  ))}
                </div>
                <span className="font-semibold text-foreground/70 text-sm">{avgRating} ({reviewList.length} reviews)</span>
              </div>
            )}

            <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary leading-tight mb-3">
              {product.name}
            </h1>
            <p className="text-3xl font-bold text-accent mb-6">
              ₦{product.price.toLocaleString()}
            </p>

            <p className="text-foreground/75 text-lg leading-relaxed mb-6">
              {product.description || product.short_description}
            </p>

            {extras && extras.length > 0 && (
              <div className="mb-6 p-4 bg-primary/5 rounded-2xl">
                <p className="font-semibold text-primary text-sm mb-3">Available Add-ons:</p>
                <div className="flex flex-wrap gap-2">
                  {extras.map((e: any) => (
                    <span key={e.name} className="inline-flex items-center gap-1 text-xs bg-white border border-primary/10 text-foreground/70 px-3 py-1.5 rounded-full">
                      <Check className="w-3 h-3 text-accent" />
                      {e.name} {e.price > 0 ? `(+₦${e.price})` : '(Free)'}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-auto">
              <AddToCartForm
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  imageUrl: product.image_url,
                  isSoldOut: product.is_sold_out,
                  variants: product.variants,
                  extras: product.extras
                }}
              />
            </div>

            {/* Delivery note */}
            <div className="mt-6 flex items-start gap-3 bg-accent/5 border border-accent/15 rounded-2xl p-4">
              <span className="text-xl">🚚</span>
              <p className="text-sm text-foreground/70 leading-relaxed">
                <strong className="text-foreground">Delivery available across Osogbo.</strong> The delivery fee is calculated at checkout based on your selected location zone.
              </p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="font-serif text-3xl font-bold text-primary mb-8">Customer Reviews</h2>
            {reviewList.length === 0 ? (
              <div className="text-center py-12 bg-primary/5 rounded-2xl">
                <p className="text-4xl mb-3">⭐</p>
                <p className="font-semibold text-primary">No reviews yet</p>
                <p className="text-foreground/60 text-sm mt-1">Be the first to review this dish!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviewList.map((r: any) => (
                  <div key={r.id} className="bg-white border border-primary/10 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-bold text-foreground">{r.customer_name}</p>
                        <p className="text-xs text-foreground/40 mt-0.5">
                          {new Date(r.created_at).toLocaleDateString('en-NG', { dateStyle: 'medium' })}
                        </p>
                      </div>
                      <div className="flex text-highlight">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                    </div>
                    {r.comment && <p className="text-foreground/70 text-sm leading-relaxed">{r.comment}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Leave a Review */}
          <div>
            <h2 className="font-serif text-3xl font-bold text-primary mb-8">Leave a Review</h2>
            <ReviewForm menuItemId={product.id} />
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="font-serif text-3xl font-bold text-primary mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map(item => (
                <ProductCard
                  key={item.id}
                  id={item.id}
                  slug={item.slug}
                  name={item.name}
                  shortDescription={item.short_description}
                  price={item.price}
                  imageUrl={item.image_url}
                  isSoldOut={item.is_sold_out}
                  hasVariants={!!item.variants}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
