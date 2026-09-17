import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// This endpoint is meant to be hit by a cron job (e.g. Vercel Cron or cron-job.org)
// to keep the Supabase free tier database from pausing due to 7-day inactivity.
export async function GET() {
  try {
    const supabase = await createClient()
    
    // A lightweight query to keep the database active
    const { data, error } = await supabase
      .from('menu_items')
      .select('id')
      .limit(1)

    if (error) {
      console.error('Keepalive ping error:', error)
      return NextResponse.json({ status: 'error', message: error.message }, { status: 500 })
    }

    return NextResponse.json({ status: 'ok', message: 'Supabase keepalive ping successful' })
  } catch (error) {
    console.error('Keepalive error:', error)
    return NextResponse.json({ status: 'error', message: 'Internal Server Error' }, { status: 500 })
  }
}
