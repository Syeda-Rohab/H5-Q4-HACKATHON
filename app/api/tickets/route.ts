import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - List all tickets with optional filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const channel = searchParams.get('channel')
    const limit = parseInt(searchParams.get('limit') || '50')

    let query = supabase
      .from('tickets')
      .select('*, customers(name, email, phone)')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (status) {
      query = query.eq('status', status)
    }
    if (priority) {
      query = query.eq('priority', priority)
    }
    if (channel) {
      query = query.eq('channel', channel)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ tickets: data || [] })
  } catch (error) {
    console.error('Tickets API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tickets' },
      { status: 500 }
    )
  }
}

// POST - Create a new ticket (admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerId, channel, priority, status, subject } = body

    const ticket = await supabase
      .from('tickets')
      .insert({
        customer_id: customerId,
        channel,
        priority: priority || 'medium',
        status: status || 'open',
        subject,
      })
      .select('*, customers(*)')
      .single()

    if (!ticket.data) {
      return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 })
    }

    return NextResponse.json({ success: true, ticket: ticket.data })
  } catch (error) {
    console.error('Create Ticket API Error:', error)
    return NextResponse.json(
      { error: 'Failed to create ticket' },
      { status: 500 }
    )
  }
}
