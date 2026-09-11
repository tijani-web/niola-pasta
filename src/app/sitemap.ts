import { MetadataRoute } from 'next'
import { getMenuItems } from '@/lib/api/menu'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://niolaspasta.com'

  // Base routes
  const routes = ['', '/menu', '/cart', '/checkout', '/contact'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  try {
    // Dynamic menu item routes
    const items = await getMenuItems()
    const productRoutes = items.map((item) => ({
      url: `${baseUrl}/product/${item.slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }))

    return [...routes, ...productRoutes]
  } catch (error) {
    console.error('Failed to generate dynamic sitemap for products:', error)
    return routes
  }
}
