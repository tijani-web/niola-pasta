import { Hero } from '@/components/home/Hero'
import { ProductCard } from '@/components/ui/ProductCard'
import { getMenuItems } from '@/lib/api/menu'
import Link from 'next/link'
import { ArrowRight, Truck, Clock, Star, Shield } from 'lucide-react'

export default async function Home() {
  const items = await getMenuItems()

  const categories = ['Big Plate', 'Budget Plate', 'Small Plate', 'Combo', 'Sides', 'Extras']

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />

      {/* Feature Strip */}
      <section className="bg-accent text-white py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-sm font-semibold">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4" />
              <span>Home Delivery Available</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Mon–Fri 9am–9pm · Sat–Sun 10am–9pm</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              <span>Made Fresh To Order</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Secure Online Payment</span>
            </div>
          </div>
        </div>
      </section>

      {/* Full Menu Grid */}
      <section id="menu" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-16">
          <span className="inline-block bg-primary/10 text-primary text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            Our Menu
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
            What Would You Like Today?
          </h2>
          <p className="text-foreground/60 max-w-2xl mx-auto text-lg">
            Every plate is made fresh to order with generous portions. No bland food here.
          </p>
        </div>

        <div className="space-y-16">
          {categories.map(cat => {
            const catItems = items.filter(i => i.category === cat)
            if (catItems.length === 0) return null
            return (
              <div key={cat}>
                <div className="flex items-center gap-4 mb-8">
                  <h3 className="text-2xl font-serif font-bold text-primary">{cat}</h3>
                  <div className="flex-1 h-px bg-primary/10" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {catItems.map(item => (
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
            )
          })}
        </div>
      </section>

      {/* About Teaser */}
      <section className="bg-primary text-white relative overflow-hidden py-24">
        {/* stripe bg */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'repeating-linear-gradient(-45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px'
        }} />
        <div className="absolute -left-32 -bottom-32 w-96 h-96 bg-accent/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -right-32 -top-32 w-96 h-96 bg-highlight/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div className="space-y-6">
              <span className="inline-block bg-highlight/20 text-highlight text-sm font-bold px-4 py-1.5 rounded-full">
                Our Story
              </span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight">
                Born From a Passion <br/>
                <span className="text-highlight italic">For Great Food.</span>
              </h2>
              <p className="text-white/75 text-lg leading-relaxed">
                Niola&apos;s Pasta started with a simple mission — to bring Osogbo the most flavour-packed, 
                satisfying stir-fried pasta they&apos;ve ever tasted. No shortcuts, no blandness. 
                Just bold flavours, fresh ingredients, and plates cooked with real love.
              </p>
              <p className="text-white/60 leading-relaxed">
                From our signature peppered chicken to our loaded sardine special, every dish is made to order — 
                because we believe great food is worth the wait.
              </p>
              <div className="pt-4 flex items-center gap-6">
                <Link
                  href="/about"
                  className="group inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-bold py-3.5 px-7 rounded-xl transition-all hover:scale-105 shadow-lg"
                >
                  Read Our Story
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right — Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '100+', label: 'Happy Customers', icon: '😊' },
                { value: '10+', label: 'Menu Items', icon: '🍝' },
                { value: '5★', label: 'Customer Rating', icon: '⭐' },
                { value: 'Daily', label: 'Fresh Batches', icon: '🔥' },
              ].map(s => (
                <div key={s.label} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/15 transition-colors">
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <div className="text-3xl font-serif font-bold text-highlight">{s.value}</div>
                  <div className="text-white/70 text-sm mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial / CTA Section */}
      <section className="py-24 bg-background stripe-bg">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <div className="text-5xl">🍝</div>
          <blockquote className="font-serif text-3xl md:text-4xl font-bold text-primary leading-snug">
            &ldquo;Best pasta I&apos;ve had in Osogbo. <span className="text-accent italic">Hands down.</span>&rdquo;
          </blockquote>
          <p className="text-foreground/60">— Verified Customer, Osogbo</p>
          <div className="text-highlight text-2xl tracking-widest">★★★★★</div>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 bg-primary hover:bg-accent text-white font-bold py-4 px-10 rounded-2xl transition-all duration-300 hover:scale-105 shadow-xl"
          >
            Order Your Plate Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': ['FoodEstablishment', 'Restaurant'],
            name: "Niola's Pasta",
            image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&q=80&w=1200',
            url: 'https://niolaspasta.com',
            telephone: '',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Uniosun second gate opposite VIP LODGE',
              addressLocality: 'Osogbo',
              addressRegion: 'Osun',
              addressCountry: 'NG'
            },
            servesCuisine: 'Pasta, Stir-fried Pasta, Nigerian',
            priceRange: '₦2000 - ₦7000',
            openingHoursSpecification: [
              {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                opens: '09:00',
                closes: '21:00'
              },
              {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Saturday', 'Sunday'],
                opens: '10:00',
                closes: '21:00'
              }
            ],
            sameAs: []
          })
        }}
      />
    </div>
  )
}
