import { NextRequest, NextResponse } from 'next/server'
import { createTicket, sendWhatsAppMessage } from '@/lib/tools'

// WhatsApp webhook - receives incoming WhatsApp messages
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Parse Twilio WhatsApp webhook payload
    const {
      From,
      Body,
      MessageSid,
      To,
      ProfileName,
    } = body

    if (!From || !Body) {
      return NextResponse.json({ error: 'Invalid WhatsApp payload' }, { status: 400 })
    }

    // Extract phone number and create ticket
    const phoneNumber = From.replace('whatsapp:', '')
    const result = await createTicket({
      customerEmail: `${phoneNumber}@whatsapp.user`,
      customerName: ProfileName || 'WhatsApp User',
      customerPhone: phoneNumber,
      channel: 'whatsapp',
      message: Body,
      priority: 'medium',
    })

    if (result.success && result.ticket) {
      // Auto-reply via WhatsApp
      await sendWhatsAppMessage(
        From,
        `🎫 *Ticket Created*\n\nHi ${ProfileName || 'there'}!\n\nYour support ticket has been created:\n\n*Ticket ID:* \`${result.ticket.id}\`\n*Status:* Open\n\nOur AI agent will assist you shortly. Reply with your question!`
      )
    }

    return NextResponse.json({
      success: true,
      ticket: result.ticket,
      messageSid: MessageSid,
    })
  } catch (error) {
    console.error('WhatsApp webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// WhatsApp status callback
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const messageStatus = searchParams.get('MessageStatus')
  const messageSid = searchParams.get('MessageSid')

  console.log('WhatsApp status update:', { messageStatus, messageSid })

  return NextResponse.json({ success: true })
}
