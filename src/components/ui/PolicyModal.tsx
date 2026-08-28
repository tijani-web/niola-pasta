'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Info } from 'lucide-react'

export function PolicyModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const hasSeenPolicy = localStorage.getItem('np_policy_seen')
    if (!hasSeenPolicy) {
      // Small delay so it doesn't instantly jump at them
      const timer = setTimeout(() => setIsOpen(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('np_policy_seen', 'true')
    setIsOpen(false)
  }

  if (!mounted) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-background rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            <div className="p-6 border-b border-primary/10 flex items-start gap-4 bg-primary/5">
              <div className="p-2 bg-primary/10 rounded-full text-primary">
                <Info className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-primary">Before you order</h2>
                <p className="text-sm text-foreground/80 mt-1">Please note our key policies</p>
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Delivery Fees</h3>
                <p className="text-sm text-foreground/80">Delivery is <strong>not included</strong> in the online checkout total. You will pay the dispatch rider directly upon delivery.</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Waiting Time</h3>
                <p className="text-sm text-foreground/80">Riders will wait a maximum of 10 minutes at your location. Please be available to receive your order.</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Cancellations</h3>
                <p className="text-sm text-foreground/80">Orders can only be cancelled before preparation begins. Once marked "Preparing", cancellations are not allowed.</p>
              </div>
            </div>

            <div className="p-6 border-t border-primary/10 bg-white">
              <button
                onClick={handleAccept}
                className="w-full bg-accent hover:bg-accent/90 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-md active:scale-95"
              >
                I Understand
              </button>
              <p className="text-center text-xs text-foreground/50 mt-4">
                You can always read the full details on our <a href="/policy" className="underline hover:text-accent">Policy Page</a>.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
