import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle2, Heart, Leaf, UtensilsCrossed } from 'lucide-react'

export const metadata = {
  title: 'About Us | Niola\'s Pasta',
}

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif mb-6">
            More Than Just <span className="text-highlight italic">Pasta.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            We are redefining street-food comfort in Osogbo by delivering premium, flavour-packed, stir-fried pasta directly to your door.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative aspect-square md:aspect-video lg:aspect-square rounded-[2rem] overflow-hidden shadow-2xl border-8 border-primary/5">
            <Image 
              src="https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=800" 
              alt="Cooking pasta"
              fill
              className="object-cover"
            />
          </div>
          
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent text-sm font-bold px-4 py-2 rounded-full mb-2">
              <Heart className="w-4 h-4" /> Our Story
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">Born out of a love for real flavour.</h2>
            <div className="space-y-4 text-foreground/80 leading-relaxed text-lg">
              <p>
                Niola&apos;s Pasta started with a simple observation: it was too hard to find genuinely flavourful, hearty, and satisfying stir-fried pasta in Osogbo without breaking the bank or waiting forever.
              </p>
              <p>
                We set out to change that. We don&apos;t believe in bland food, and we definitely don&apos;t believe in skimping on portions. Every plate we serve is a carefully crafted symphony of rich Nigerian flavours, fresh local ingredients, and generous portions of your favourite proteins.
              </p>
              <p>
                Whether you&apos;re a student burning the midnight oil, a professional on a quick lunch break, or just craving a delicious homemade meal, Niola&apos;s Pasta is cooked hot, fast, and exactly the way you like it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-primary/5 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Why People Love Us</h2>
            <p className="text-foreground/70 text-lg">We don't cut corners. Here's what makes our pasta stand out from the rest.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-primary/10 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-highlight/20 text-highlight rounded-full flex items-center justify-center mb-6">
                <Leaf className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Fresh Ingredients</h3>
              <p className="text-foreground/70 leading-relaxed">
                We source our vegetables, proteins, and spices fresh every single day. No stale ingredients, just vibrant, mouth-watering freshness.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-primary/10 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-highlight/20 text-highlight rounded-full flex items-center justify-center mb-6">
                <UtensilsCrossed className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Made to Order</h3>
              <p className="text-foreground/70 leading-relaxed">
                We don't do pre-cooked batches. When you place an order, the pan gets hot. Your food is cooked specifically for you, ensuring maximum flavour and heat.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-primary/10 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-highlight/20 text-highlight rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Unbeatable Value</h3>
              <p className="text-foreground/70 leading-relaxed">
                Gourmet taste shouldn't cost a fortune. We pack our plates with generous portions of pasta, chicken, and sausages at prices that make sense.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 text-center px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-primary mb-6">Hungry Yet?</h2>
        <p className="text-lg text-foreground/80 mb-8">
          Stop reading and start eating. Browse our menu and get a hot plate of Osogbo's finest stir-fried pasta delivered right to your location.
        </p>
        <Link 
          href="/menu" 
          className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white font-bold py-4 px-10 rounded-2xl transition-all hover:scale-105 shadow-lg shadow-accent/30 text-lg"
        >
          Order Now
        </Link>
      </section>
    </div>
  )
}
