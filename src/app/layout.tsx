import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { PolicyModal } from "@/components/ui/PolicyModal";
import { WhatsAppWidget } from "@/components/ui/WhatsAppWidget";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://niolaspasta.com'),
  manifest: '/manifest.json',
  title: {
    default: "Niola's Pasta — Osogbo's Finest Stir-Fried Pasta",
    template: "%s | Niola's Pasta",
  },
  description: "Flavour-packed stir-fried pasta made fresh to order in Osogbo. Chicken, sausage, plantain, sardine & more. Order online, delivered to your door.",
  keywords: ["pasta", "Osogbo", "Nigerian food", "stir-fried pasta", "food delivery", "Niola's Pasta", "restaurant", "best food in osogbo"],
  authors: [{ name: "Niola's Pasta" }],
  creator: "Niola's Pasta",
  publisher: "Niola's Pasta",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  appleWebApp: {
    title: "Niola's Pasta",
    statusBarStyle: 'default',
    capable: true,
  },
  openGraph: {
    title: "Niola's Pasta — Osogbo's Finest Stir-Fried Pasta",
    description: "Flavour-packed stir-fried pasta made fresh to order in Osogbo.",
    url: 'https://niolaspasta.com',
    siteName: "Niola's Pasta",
    locale: 'en_NG',
    type: "website",
    images: [
      {
        url: '/niolas-img/HeroSectionImage/hero.jpeg',
        width: 1200,
        height: 630,
        alt: "Niola's Pasta Signature Dish",
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Niola's Pasta — Osogbo's Finest Stir-Fried Pasta",
    description: "Flavour-packed stir-fried pasta made fresh to order in Osogbo.",
    images: ['/niolas-img/HeroSectionImage/hero.jpeg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const restaurantJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: "Niola's Pasta",
  image: 'https://niolaspasta.com/niolas-img/HeroSectionImage/hero.jpeg',
  '@id': 'https://niolaspasta.com',
  url: 'https://niolaspasta.com',
  telephone: '+2347030462283',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Osogbo',
    addressLocality: 'Osogbo',
    addressRegion: 'OS',
    postalCode: '230101',
    addressCountry: 'NG'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 7.7827,
    longitude: 4.5418
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '09:00',
      closes: '21:00'
    }
  ],
  servesCuisine: 'Pasta',
  priceRange: '₦₦',
  menu: 'https://niolaspasta.com/menu',
  acceptsReservations: 'false'
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: "Niola's Pasta",
  url: 'https://niolaspasta.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://niolaspasta.com/menu?category={search_term_string}',
    'query-input': 'required name=search_term_string'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${jakarta.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <meta name="theme-color" content="#d97706" />
        <meta name="geo.region" content="NG-OS" />
        <meta name="geo.placename" content="Osogbo" />
        <meta name="geo.position" content="7.7827;4.5418" />
        <meta name="ICBM" content="7.7827, 4.5418" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground pt-20">
        <Navbar />
        <CartDrawer />
        <PolicyModal />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppWidget />
      </body>
    </html>
  );
}
