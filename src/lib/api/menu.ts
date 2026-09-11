import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/database'

export type MenuItem = Database['public']['Tables']['menu_items']['Row']

export async function getMenuItems(): Promise<MenuItem[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .order('price', { ascending: true }) as any
    
  if (error) {
    console.error('Error fetching menu items:', error)
    return []
  }
  
  return data as MenuItem[]
}
