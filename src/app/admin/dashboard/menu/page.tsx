import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import MenuManagerClient from "./MenuManagerClient"

export const dynamic = "force-dynamic"
export const metadata = { title: "Menu Manager | Niola'\''s Pasta Admin" }

export default async function MenuManagerPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/admin")

  const { data: items } = await supabase
    .from("menu_items")
    .select("*")
    .order("category")
    .order("name")

  return <MenuManagerClient items={items || []} />
}
