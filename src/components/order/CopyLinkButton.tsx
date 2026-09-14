'use client'

import { useState } from 'react'
import { Copy, Check, Link2 } from 'lucide-react'

export default function CopyLinkButton({ token }: { token: string }) {
  const [copied, setCopied] = useState(false)

  const trackingUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://niolaspasta.com'}/track/${token}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(trackingUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Fallback for browsers that block clipboard
      const input = document.createElement('input')
      input.value = trackingUrl
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  return (
    <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <Link2 className="w-4 h-4 text-primary/60" />
        <span className="text-sm font-bold text-primary">Save your tracking link</span>
      </div>
      <p className="text-xs text-foreground/50 mb-3">
        Bookmark or copy this link to check your order status anytime — no account needed.
      </p>
      <div className="flex gap-2">
        <div className="flex-1 bg-white border border-primary/10 rounded-lg px-3 py-2 text-xs font-mono text-foreground/60 truncate">
          {trackingUrl}
        </div>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            copied
              ? 'bg-green-500 text-white'
              : 'bg-primary text-white hover:bg-primary/90'
          }`}
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  )
}
