'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

const GALLERY = [
  {
    src: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&q=80&w=600',
    label: 'Chicken & Plantain Pasta'
  },
  {
    src: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&q=80&w=600',
    label: 'Chicken Pasta'
  },
  {
    src: 'https://images.unsplash.com/photo-1626844131082-256783844137?auto=format&fit=crop&q=80&w=600',
    label: 'Chicken & Sausage Pasta'
  },
  {
    src: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&q=80&w=600',
    label: 'Sardine Special'
  },
]

export function Hero() {
  const [active, setActive] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const next = useCallback(() => setActive(a => (a + 1) % GALLERY.length), [])
  const prev = useCallback(() => setActive(a => (a - 1 + GALLERY.length) % GALLERY.length), [])

  useEffect(() => {
    if (isHovered) return
    const interval = setInterval(next, 2500)
    return () => clearInterval(interval)
  }, [next, isHovered])

  // Build ring positions: front (center), left, right, back
  const positions = GALLERY.map((_, i) => {
    const offset = (i - active + GALLERY.length) % GALLERY.length
    return offset // 0=front, 1=right, 2=back, 3=left
  })

  return (
    <section className="relative overflow-hidden bg-primary text-white">
      {/* Diagonal stripe overlay */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: 'repeating-linear-gradient(-45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
        backgroundSize: '20px 20px'
      }} />

      {/* Radial glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — Text */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/30 text-highlight text-sm font-semibold px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-highlight rounded-full animate-pulse" />
              Now Taking Orders in Osogbo
            </div>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
              Fresh, Hot &amp; <br />
              <span className="text-highlight italic">Packed With</span> <br />
              Flavour.
            </h1>

            <p className="text-lg md:text-xl text-white/75 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Osogbo&apos;s finest stir-fried pasta — made to order with juicy peppered chicken, sweet plantain, savory sausage &amp; more.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/menu"
                className="group inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg shadow-accent/30"
              >
                Order Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/menu"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 border border-white/20"
              >
                View Full Menu
              </Link>
            </div>

            {/* Social proof strip */}
            <div className="flex items-center gap-6 justify-center lg:justify-start pt-2">
              <div>
                <div className="text-highlight text-lg tracking-wider">★★★★★</div>
                <div className="text-white/60 text-xs mt-0.5">100+ happy customers</div>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div>
                <div className="font-bold text-white text-lg">Fast</div>
                <div className="text-white/60 text-xs mt-0.5">Fresh to order</div>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div>
                <div className="font-bold text-white text-lg">₦500+</div>
                <div className="text-white/60 text-xs mt-0.5">Starting price</div>
              </div>
            </div>
          </div>

          {/* Right — Rotating Gallery */}
          <div
            className="relative flex items-center justify-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ height: 480 }}
          >
            {GALLERY.map((item, i) => {
              const pos = positions[i]
              const styles: Record<number, React.CSSProperties> = {
                0: { // front-center
                  transform: 'translateX(0) translateY(0) scale(1)',
                  zIndex: 30,
                  opacity: 1,
                },
                1: { // right
                  transform: 'translateX(55%) translateY(5%) scale(0.8)',
                  zIndex: 20,
                  opacity: 0.7,
                },
                2: { // back (hidden behind)
                  transform: 'translateX(0) translateY(12%) scale(0.6)',
                  zIndex: 10,
                  opacity: 0.3,
                },
                3: { // left
                  transform: 'translateX(-55%) translateY(5%) scale(0.8)',
                  zIndex: 20,
                  opacity: 0.7,
                },
              }

              return (
                <div
                  key={i}
                  onClick={() => pos !== 0 && setActive(i)}
                  className="absolute cursor-pointer"
                  style={{
                    ...styles[pos],
                    transition: 'all 0.6s cubic-bezier(0.4,0,0.2,1)',
                    width: 280,
                    height: 280,
                  }}
                >
                  <div className={`w-full h-full rounded-3xl overflow-hidden border-4 shadow-2xl ${pos === 0 ? 'border-highlight/60' : 'border-white/10'}`}>
                    <div className="relative w-full h-full bg-gray-100">
                      <Image
                        src={item.src}
                        alt={item.label}
                        fill
                        className="object-cover"
                        sizes="280px"
                      />
                      {pos === 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                          <p className="text-white font-semibold text-sm">{item.label}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Controls */}
            <button
              onClick={prev}
              className="absolute left-0 bottom-6 z-40 bg-white/10 hover:bg-white/20 border border-white/20 text-white p-2 rounded-full transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-0 bottom-6 z-40 bg-white/10 hover:bg-white/20 border border-white/20 text-white p-2 rounded-full transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex gap-2">
              {GALLERY.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`rounded-full transition-all duration-300 ${i === active ? 'w-6 h-2 bg-highlight' : 'w-2 h-2 bg-white/30'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
