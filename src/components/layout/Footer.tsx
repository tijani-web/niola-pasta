import Link from 'next/link'
import Image from 'next/image'
import { Phone, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground border-t-4 border-accent mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="inline-block">
              <div className="bg-white/10 rounded-2xl p-3 inline-block border border-white/10">
                <Image
                  src="/niolas-img/logo/logo.png"
                  alt="Niola's Pasta"
                  width={130}
                  height={52}
                  className="h-14 w-auto object-contain"
                />
              </div>
            </Link>
            <p className="text-white/80 text-sm">
              The best stir-fried pasta in Osogbo. Fresh, hot, and packed with flavour.
            </p>
          </div>

          {/* Contact */}
          <div className="md:col-span-1 space-y-4">
            <h3 className="font-bold text-white text-lg">Contact Us</h3>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-highlight flex-shrink-0" />
                <span>Uniosun second gate, opposite VIP Lodge, Okebaale, Osogbo</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-highlight flex-shrink-0" />
                <div className="flex flex-col">
                  <span>0703 046 2283</span>
                  <span>0811 303 7582</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div className="md:col-span-1 space-y-4">
            <h3 className="font-bold text-white text-lg">Working Hours</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li className="flex justify-between">
                <span>Mon - Fri</span>
                <span>9:00 AM - 9:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sat - Sun</span>
                <span>10:00 AM - 9:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div className="md:col-span-1 space-y-4">
            <h3 className="font-bold text-white text-lg">Quick Links</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link href="/menu" className="hover:text-highlight transition-colors">Full Menu</Link></li>
              <li><Link href="/policy" className="hover:text-highlight transition-colors">Our Policies</Link></li>
              <li><Link href="/about" className="hover:text-highlight transition-colors">About Us</Link></li>
            </ul>
            <div className="flex gap-4 pt-4">
              <a href="https://www.instagram.com/mypastabyniola" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-accent transition-colors text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
              </a>
              <a href="https://www.facebook.com/share/1BxBDjubvq/" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-accent transition-colors text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
              </a>
              <a href="https://vm.tiktok.com/ZS9kphQGQBAP5-mYq6M/" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-accent transition-colors text-white flex items-center justify-center w-9 h-9">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/60">
          <p>&copy; {new Date().getFullYear()} Niola&apos;s Pasta. All rights reserved.</p>
          <p>Delivery fee is paid directly to the dispatch rider.</p>
        </div>
      </div>
    </footer>
  )
}
