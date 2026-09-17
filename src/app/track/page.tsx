'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Package, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function TrackOrderPage() {
  const router = useRouter()
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = token.trim().toUpperCase()
    if (!trimmed) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/orders/lookup?token=${encodeURIComponent(trimmed)}`)
      if (res.ok) {
        router.push(`/track/${trimmed}`)
      } else {
        setError("We couldn't find an order with that token. Please double-check and try again.")
        setLoading(false)
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center">
            <Package className="w-10 h-10 text-accent" />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl font-bold text-primary mb-3">Track Your Order</h1>
          <p className="text-foreground/60 text-lg">
            Enter your order token to see your current order status.
          </p>
          <p className="text-foreground/50 text-sm mt-2">
            Your token looks like: <span className="font-mono font-bold text-primary">NP-1234-5678</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-primary/10 shadow-sm p-8">
          <label className="block text-sm font-bold text-foreground mb-2">
            Order Token
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={token}
              onChange={(e) => { setToken(e.target.value); setError('') }}
              placeholder="e.g. NP-1234-5678"
              className="flex-1 p-3.5 rounded-xl border border-primary/20 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all font-mono uppercase placeholder:normal-case placeholder:font-sans"
              required
            />
            <button
              type="submit"
              disabled={loading || !token.trim()}
              className="bg-accent hover:bg-accent/90 disabled:opacity-50 text-white font-bold px-5 py-3.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              Track
            </button>
          </div>

          {error && (
            <p className="mt-4 text-red-500 text-sm font-medium bg-red-50 border border-red-100 px-4 py-3 rounded-xl">
              {error}
            </p>
          )}
        </form>

        {/* Help text */}
        <div className="mt-6 text-center space-y-3">
          <p className="text-foreground/50 text-sm">
            Your order token was shown on your confirmation page and sent via email/SMS.
          </p>
          <p className="text-sm text-foreground/50">
            Can&apos;t find your token?{' '}
            <a
              href="https://wa.me/2347030462283?text=Hi%20Niola's%20Pasta!%20I%20need%20help%20tracking%20my%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent font-semibold hover:underline"
            >
              Message us on WhatsApp
            </a>
          </p>
          <Link href="/menu" className="inline-flex items-center gap-1 text-sm text-primary/60 hover:text-primary transition-colors">
            <ArrowRight className="w-4 h-4" />
            Order Something New
          </Link>
        </div>

      </div>
    </div>
  )
}
