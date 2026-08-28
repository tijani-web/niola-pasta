'use client'

import { useState } from 'react'
import { Star, Loader2, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function ReviewForm({ menuItemId }: { menuItemId: string }) {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [name, setName] = useState('')
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) { setError('Please select a star rating.'); return }
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: err } = await (supabase.from('reviews') as any).insert({
      menu_item_id: menuItemId,
      customer_name: name,
      rating,
      comment: comment || null,
    })

    setLoading(false)
    if (err) {
      setError('Failed to submit review. Please try again.')
    } else {
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 bg-green-50 border border-green-100 rounded-2xl gap-3">
        <CheckCircle className="w-12 h-12 text-green-500" />
        <h3 className="font-bold text-green-800 text-lg">Review Submitted!</h3>
        <p className="text-green-600 text-sm">Thank you for your feedback. It&apos;s now live on the page.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-primary/10 rounded-2xl p-6 shadow-sm space-y-5">
      {/* Star Rating */}
      <div>
        <label className="block text-sm font-bold text-foreground mb-3">Your Rating *</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="text-3xl transition-transform hover:scale-125 focus:outline-none"
            >
              <Star
                className={`w-8 h-8 transition-colors ${
                  star <= (hover || rating) ? 'fill-highlight text-highlight' : 'text-gray-200'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-foreground mb-1.5">Your Name *</label>
        <input
          required
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Adebayo O."
          className="w-full p-3 rounded-xl border border-primary/20 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-foreground mb-1.5">Your Review (Optional)</label>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          rows={3}
          placeholder="Tell others what you thought about this dish..."
          className="w-full p-3 rounded-xl border border-primary/20 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm resize-none"
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm font-medium">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-accent text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Review'}
      </button>
    </form>
  )
}
