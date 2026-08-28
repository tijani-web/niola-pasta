import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'About Us | Niola\'s Pasta',
}

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary font-serif mb-8 text-center border-b border-primary/10 pb-8">
          About Niola&apos;s Pasta
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-square rounded-3xl overflow-hidden shadow-lg border-4 border-primary/5">
            <Image 
              src="https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=800" 
              alt="Cooking pasta"
              fill
              className="object-cover"
            />
          </div>
          
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-primary">Made with Love in Osogbo</h2>
            <p className="text-foreground/80 leading-relaxed">
              Niola&apos;s Pasta started with a simple passion: to bring the best, most flavour-packed stir-fried pasta to the people of Osogbo. 
              We don&apos;t believe in bland food. Every plate we serve is loaded with rich flavours, fresh ingredients, and generous portions of your favourite proteins.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              Whether you&apos;re craving the smoky kick of our peppered chicken, the sweet and savoury combination of plantain, or a fully loaded sardine special, we cook every meal to order.
            </p>
            <div className="pt-4">
              <Link 
                href="/menu" 
                className="bg-accent hover:bg-accent/90 text-white font-medium py-3 px-6 rounded-xl inline-block transition-transform hover:scale-105 shadow-md"
              >
                Explore Our Menu
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
