'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { items, setIsOpen } = useCartStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <header className={`fixed top-0 w-full z-40 transition-all duration-300 ${
      isScrolled
        ? 'bg-background/95 backdrop-blur-md shadow-sm border-b border-primary/10 py-3'
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 z-50">
          <Image
            src="/niolas-img/logo/logo.png"
            alt="Niola's Pasta"
            width={150}
            height={60}
            className="h-14 w-auto object-contain drop-shadow-sm"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground hover:text-accent transition-colors font-medium relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full rounded-full" />
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3 z-50">
          {/* Order CTA */}
          <Link
            href="/menu"
            className="hidden md:inline-flex items-center gap-1.5 bg-accent hover:bg-accent/90 text-white text-sm font-bold py-2.5 px-5 rounded-xl transition-all hover:scale-105 shadow-md"
          >
            Order Now
          </Link>

          {/* Cart */}
          <button
            onClick={() => setIsOpen(true)}
            className="relative p-2.5 text-foreground hover:text-accent transition-colors rounded-xl hover:bg-primary/5"
            aria-label="Open cart"
          >
            <ShoppingCart className="w-6 h-6" />
            {mounted && cartItemCount > 0 && (
              <span className="absolute top-0.5 right-0.5 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-accent rounded-full border-2 border-background animate-pulse">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 w-full bg-background shadow-xl py-5 px-4 flex flex-col gap-2 md:hidden border-t border-primary/10"
          >
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium text-foreground hover:text-accent py-3 px-4 rounded-xl hover:bg-primary/5 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/menu"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-2 w-full text-center bg-accent text-white font-bold py-3.5 px-6 rounded-xl"
            >
              Order Now
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
