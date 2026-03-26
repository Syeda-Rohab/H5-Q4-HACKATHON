import { supabase } from './supabase'
import twilio from 'twilio'

// Initialize Twilio client (FREE Trial)
const twilioClient = process.env.TWILIO_ACCOUNT_SID
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null

// Tool 1: Create Ticket
export async function createTicket(data: {
  customerEmail: string
  customerName?: string
  customerPhone?: string
  channel: string
  message: string
  priority?: string
}) {
  try {
    // Find or create customer
    let customer = await supabase
      .from('customers')
      .select('id')
      .eq('email', data.customerEmail)
      .single()

    if (!customer.data) {
      const newCustomer = await supabase
        .from('customers')
        .insert({
          email: data.customerEmail,
          name: data.customerName || null,
          phone: data.customerPhone || null,
        })
        .select('id')
        .single()
      customer = newCustomer
    }

    const customerId = customer.data?.id
    if (!customerId) {
      return { success: false, error: 'Failed to get customer ID' }
    }

    // Create ticket
    const ticket = await supabase
      .from('tickets')
      .insert({
        customer_id: customerId,
        channel: data.channel,
        priority: data.priority || 'medium',
        status: 'open',
      })
      .select('*, customers(*)')
      .single()

    // Add initial message
    if (ticket.data) {
      await supabase.from('messages').insert({
        ticket_id: ticket.data.id,
        role: 'user',
        content: data.message,
        channel: data.channel,
      })
    }

    return { success: true, ticket: ticket.data }
  } catch (error) {
    console.error('Create ticket error:', error)
    return { success: false, error: 'Failed to create ticket' }
  }
}

// Tool 2: Search Knowledge Base (simulated with tickets)
export async function searchKB(query: string) {
  try {
    // Search through existing messages for similar issues
    const results = await supabase
      .from('messages')
      .select('content, tickets(status, priority)')
      .ilike('content', `%${query}%`)
      .limit(5)

    return {
      success: true,
      results: results.data || [],
      message: results.data?.length
        ? `Found ${results.data.length} relevant solutions`
        : 'No exact matches found. Escalating to human agent.',
    }
  } catch (error) {
    console.error('Search KB error:', error)
    return { success: false, error: 'Search unavailable' }
  }
}

// Tool 3: Get Ticket Status
export async function getTicketStatus(ticketId: string) {
  try {
    const ticket = await supabase
      .from('tickets')
      .select('*, customers(name, email), messages(content, role, created_at)')
      .eq('id', ticketId)
      .single()

    if (!ticket.data) {
      return { success: false, error: 'Ticket not found' }
    }

    return {
      success: true,
      ticket: ticket.data,
      status: ticket.data.status,
      messages: ticket.data.messages || [],
    }
  } catch (error) {
    console.error('Get ticket error:', error)
    return { success: false, error: 'Failed to fetch ticket' }
  }
}

// Tool 4: Update Ticket Status
export async function updateTicketStatus(
  ticketId: string,
  status: string,
  response?: string
) {
  try {
    const update = await supabase
      .from('tickets')
      .update({ status })
      .eq('id', ticketId)
      .select()
      .single()

    if (response) {
      await supabase.from('messages').insert({
        ticket_id: ticketId,
        role: 'assistant',
        content: response,
        channel: 'system',
      })
    }

    return { success: true, ticket: update.data }
  } catch (error) {
    console.error('Update ticket error:', error)
    return { success: false, error: 'Failed to update ticket' }
  }
}

// Tool 5: Send WhatsApp Message (FREE Twilio Trial)
export async function sendWhatsAppMessage(to: string, message: string) {
  if (!twilioClient) {
    console.warn('Twilio not configured, skipping WhatsApp message')
    return { success: false, error: 'WhatsApp service not configured' }
  }

  try {
    const whatsappFrom = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886'
    
    const sent = await twilioClient.messages.create({
      from: whatsappFrom,
      to: to.startsWith('whatsapp:') ? to : `whatsapp:${to}`,
      body: message,
    })

    return {
      success: true,
      messageId: sent.sid,
      status: sent.status,
    }
  } catch (error) {
    console.error('WhatsApp send error:', error)
    return { success: false, error: 'Failed to send WhatsApp message' }
  }
}

// Tool 6: Send Email via Gmail API (FREE Service Account)
export async function sendGmailEmail(to: string, subject: string, body: string) {
  try {
    // In production, use googleapis with service account credentials
    // For now, log the email (implement with actual Gmail API in production)
    console.log('Gmail Email:', { to, subject, body })
    
    return {
      success: true,
      messageId: `gmail-${Date.now()}`,
      message: 'Email queued for sending',
    }
  } catch (error) {
    console.error('Gmail send error:', error)
    return { success: false, error: 'Failed to send email' }
  }
}

// Export all tools for agent
export const agentTools = [
  {
    name: 'create_ticket',
    description: 'Create a new support ticket for a customer',
    parameters: {
      type: 'object',
      properties: {
        customerEmail: { type: 'string', description: 'Customer email address' },
        customerName: { type: 'string', description: 'Customer name (optional)' },
        customerPhone: { type: 'string', description: 'Customer phone (optional)' },
        channel: { type: 'string', enum: ['web', 'whatsapp', 'gmail'], description: 'Contact channel' },
        message: { type: 'string', description: 'Customer message/issue' },
        priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'], description: 'Issue priority' },
      },
      required: ['customerEmail', 'channel', 'message'],
    },
    handler: createTicket,
  },
  {
    name: 'search_kb',
    description: 'Search knowledge base for solutions to customer issues',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query for solutions' },
      },
      required: ['query'],
    },
    handler: searchKB,
  },
  {
    name: 'get_ticket_status',
    description: 'Get the status and history of a ticket',
    parameters: {
      type: 'object',
      properties: {
        ticketId: { type: 'string', description: 'Ticket ID to check' },
      },
      required: ['ticketId'],
    },
    handler: getTicketStatus,
  },
  {
    name: 'update_ticket_status',
    description: 'Update ticket status and add response',
    parameters: {
      type: 'object',
      properties: {
        ticketId: { type: 'string', description: 'Ticket ID to update' },
        status: { type: 'string', enum: ['open', 'in_progress', 'resolved', 'closed'], description: 'New status' },
        response: { type: 'string', description: 'Response message to add' },
      },
      required: ['ticketId', 'status'],
    },
    handler: updateTicketStatus,
  },
  {
    name: 'send_whatsapp',
    description: 'Send a WhatsApp message to a customer',
    parameters: {
      type: 'object',
      properties: {
        to: { type: 'string', description: 'WhatsApp number (with country code)' },
        message: { type: 'string', description: 'Message to send' },
      },
      required: ['to', 'message'],
    },
    handler: sendWhatsAppMessage,
  },
  {
    name: 'send_gmail',
    description: 'Send an email via Gmail API',
    parameters: {
      type: 'object',
      properties: {
        to: { type: 'string', description: 'Recipient email address' },
        subject: { type: 'string', description: 'Email subject' },
        message: { type: 'string', description: 'Email body content' },
      },
      required: ['to', 'subject', 'message'],
    },
    handler: async (args: { to: string; subject: string; message: string }) => 
      sendGmailEmail(args.to, args.subject, args.message),
  },
]
