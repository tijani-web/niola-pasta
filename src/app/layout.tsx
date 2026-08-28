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
  title: {
    default: "Niola's Pasta — Osogbo's Finest Stir-Fried Pasta",
    template: "%s | Niola's Pasta",
  },
  description: "Flavour-packed stir-fried pasta made fresh to order in Osogbo. Chicken, sausage, plantain, sardine & more. Order online, delivered to your door.",
  keywords: ["pasta", "Osogbo", "Nigerian food", "stir-fried pasta", "food delivery", "Niola's Pasta", "restaurant"],
  authors: [{ name: "Niola's Pasta" }],
  creator: "Niola's Pasta",
  publisher: "Niola's Pasta",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
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
        url: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&q=80&w=1200',
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
    images: ['https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&q=80&w=1200'],
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
