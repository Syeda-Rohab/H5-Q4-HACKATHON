import { NextRequest, NextResponse } from 'next/server'
import { createTicket, sendGmailEmail } from '@/lib/tools'

// Gmail webhook - receives incoming emails
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Parse Gmail API push notification or webhook payload
    const { email, from, subject, message, threadId } = body

    if (!email || !message) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    // Create ticket from email
    const result = await createTicket({
      customerEmail: email,
      customerName: from,
      channel: 'gmail',
      message: `${subject ? `Subject: ${subject}\n\n` : ''}${message}`,
      priority: 'medium',
    })

    if (result.success && result.ticket) {
      // Auto-reply via Gmail
      await sendGmailEmail(
        email,
        `Re: ${subject || 'Support Request'}`,
        `Hi,\n\nThank you for contacting support. We've received your email and created ticket: ${result.ticket.id}\n\nOur team will respond within 24 hours.\n\nTicket ID: ${result.ticket.id}\n\nBest regards,\nSupport Team`
      )
    }

    return NextResponse.json({
      success: true,
      ticket: result.ticket,
      threadId,
    })
  } catch (error) {
    console.error('Gmail webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// Handle Gmail push notifications
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const token = searchParams.get('token')

  // Verify webhook subscription
  if (token === process.env.GMAIL_WEBHOOK_TOKEN) {
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
