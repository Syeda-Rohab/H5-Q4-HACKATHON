import { NextRequest, NextResponse } from 'next/server'

// Mock ticket storage (in production, use Supabase)
const tickets: any[] = []

// Comprehensive knowledge base for common questions
const knowledgeBase = {
  greetings: {
    patterns: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings', 'namaste', 'welcome'],
    responses: [
      "👋 Hello! Welcome to NexSupport AI. How can I assist you today?",
      "🌟 Hi there! I'm your AI support assistant. What can I help you with?",
      "💬 Hey! Great to see you. What brings you here today?",
      "🎉 Hello! Ready to help you with anything you need!",
    ]
  },
  pricing: {
    patterns: ['price', 'pricing', 'cost', 'how much', 'plan', 'subscription', 'free', 'premium', 'upgrade', 'downgrade', 'pay', 'payment'],
    responses: [
      `🎉 **Everything is 100% FREE!**\n\n✨ **NexSupport AI - Completely Free Forever!**\n\n✅ Unlimited Support Tickets\n✅ AI-Powered Chat 24/7\n✅ Email Integration\n✅ WhatsApp Support\n✅ Analytics Dashboard\n✅ API Access\n✅ All Features Included\n\n💡 No credit card required\n💡 No hidden charges\n💡 No premium plans\n\nEverything is absolutely free! We believe in providing quality support tools to everyone at no cost.\n\nIs there anything specific you'd like to use?`,
      `🆓 **Free Forever - No Costs!**\n\nGreat news! NexSupport AI is completely free to use:\n\n✅ **All Features Free:**\n• Unlimited tickets\n• AI chat support\n• Multi-channel support\n• Analytics & reports\n• API integrations\n\n✅ **No Payment Needed:**\n• No credit card required\n• No subscription fees\n• No hidden costs\n\nEnjoy all features without spending a single penny! 🎉`,
    ]
  },
  features: {
    patterns: ['feature', 'what can', 'do you', 'capabilities', 'offer', 'provide', 'what is', 'what are'],
    responses: [
      `✨ **NexSupport AI Features - All FREE!**\n\n🤖 AI-Powered Chat - Free 24/7\n📧 Email Integration - Free (Gmail & Outlook)\n📱 WhatsApp Support - Free (Connect via WhatsApp)\n🎫 Ticket Management - Free (Unlimited tickets)\n📊 Analytics Dashboard - Free (Real-time insights)\n🔌 API Access - Free (Easy integrations)\n\n💡 **Everything is 100% Free!**\n• No credit card required\n• No premium features\n• No hidden charges\n\nWhich feature would you like to know more about?`,
    ]
  },
  contact: {
    patterns: ['contact', 'email', 'phone', 'reach', 'support team', 'human', 'agent', 'talk to someone'],
    responses: [
      `📞 **Contact Information:**\n\n📧 Email: support@nexsupport.com\n📱 Phone: +1 (555) 123-4567\n💬 Live Chat: Available 24/7\n🕐 Hours: Monday-Friday, 9AM-6PM EST\n\nYou can also create a ticket and our team will get back to you shortly!`,
    ]
  },
  technical: {
    patterns: ['bug', 'error', 'not working', 'issue', 'problem', 'broken', 'fix', 'technical', 'crash', 'freeze', 'slow'],
    responses: [
      `🔧 **Technical Support**\n\nI understand you're experiencing technical issues. Let me help!\n\n**Quick Troubleshooting:**\n1. Refresh the page (Ctrl+F5)\n2. Clear browser cache\n3. Try incognito mode\n4. Check your internet connection\n\nIf the issue persists, I'll create a priority ticket for our technical team.\n\nCan you describe the specific error you're seeing?`,
    ]
  },
  account: {
    patterns: ['account', 'login', 'signup', 'register', 'password', 'reset', 'delete', 'settings', 'profile', 'username'],
    responses: [
      `👤 **Account Help**\n\n**Login Issues:**\n• Use "Forgot Password" to reset\n• Check spam for verification email\n• Clear cookies and try again\n\n**Account Settings:**\n• Go to Settings → Profile\n• Update email, password, preferences\n• Download your data anytime\n\n**Delete Account:**\n• Settings → Danger Zone\n• Confirm deletion (permanent)\n\nNeed help with something specific?`,
    ]
  },
  billing: {
    patterns: ['billing', 'payment', 'invoice', 'refund', 'charge', 'card', 'subscription', 'cancel', 'renew', 'pay', 'cost', 'money'],
    responses: [
      `💳 **Billing - Everything is FREE!**\n\n✨ **No Payment Required - Ever!**\n\nNexSupport AI is completely free:\n\n✅ No credit card needed\n✅ No subscription fees\n✅ No hidden charges\n✅ No premium plans\n✅ All features free forever\n\n**About Invoices:**\n• Since everything is free, no invoices are generated\n• You can use all features without any cost\n\n**Refund Policy:**\n• Nothing to refund - it's all free!\n\nEnjoy our services without spending a single penny! Is there anything else I can help you with?`,
      `🆓 **Free Service - No Billing!**\n\nGreat news! There's no billing or payment needed:\n\n✅ **100% Free Features:**\n• Unlimited support tickets\n• AI-powered chat\n• Email & WhatsApp integration\n• Analytics dashboard\n• API access\n\n💡 No payment methods accepted (because we don't charge anything!)\n\nEverything is absolutely free forever! What would you like to use today?`,
    ]
  },
  integration: {
    patterns: ['integration', 'api', 'connect', 'webhook', 'slack', 'zapier', 'embed', 'sync', 'import', 'export'],
    responses: [
      `🔌 **Integrations - All Free!**\n\n**Free Integrations Available:**\n• Slack - Get notifications (Free)\n• Zapier - 5000+ apps (Free tier)\n• Gmail - Email sync (Free)\n• WhatsApp - Messaging (Free trial)\n\n**API Access - 100% Free:**\n• RESTful API\n• Webhooks support\n• SDKs for popular languages\n• Comprehensive docs\n\n**Embed Options - Free:**\n• Chat widget for website\n• Customizable colors\n• White-label available\n\nAll integrations are completely free to use! Which one interests you?`,
    ]
  },
  thanks: {
    patterns: ['thank', 'thanks', 'appreciate', 'helpful', 'great', 'awesome', 'wonderful', 'amazing'],
    responses: [
      "😊 You're welcome! Happy to help. Anything else you need?",
      "🌟 My pleasure! Don't hesitate to ask if you need anything else!",
      "💫 Glad I could help! Feel free to reach out anytime!",
      "🎉 Anytime! That's what I'm here for!",
    ]
  },
  bye: {
    patterns: ['bye', 'goodbye', 'see you', 'later', 'exit', 'quit', 'leave', 'go'],
    responses: [
      "👋 Goodbye! Have a great day! Feel free to come back anytime!",
      "✨ See you later! Don't hesitate to reach out if you need help!",
      "💫 Take care! We're always here when you need us!",
      "🌟 Bye! Wishing you a wonderful day ahead!",
    ]
  },
  // General knowledge categories
  weather: {
    patterns: ['weather', 'rain', 'sunny', 'cold', 'hot', 'temperature', 'forecast'],
    responses: [
      "🌤️ I don't have access to real-time weather data, but you can check weather.com or your local weather app for accurate forecasts!",
    ]
  },
  time: {
    patterns: ['time', 'clock', 'hour', 'minute', 'second', 'what time'],
    responses: [
      `🕐 The current time is ${new Date().toLocaleTimeString()}. Is there anything else I can help you with?`,
    ]
  },
  date: {
    patterns: ['date', 'day', 'today', 'tomorrow', 'yesterday', 'calendar'],
    responses: [
      `📅 Today is ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}. How can I assist you further?`,
    ]
  },
  about: {
    patterns: ['who are you', 'what are you', 'about you', 'your name', 'introduce yourself'],
    responses: [
      "🤖 I'm the NexSupport AI Assistant! I'm here to help you with any questions about our products, services, or general inquiries. I can create support tickets, answer questions, and provide information 24/7!",
    ]
  },
  help: {
    patterns: ['help', 'assist', 'support', 'what can i do', 'guide'],
    responses: [
      `📚 **How I Can Help:**\n\n✅ Answer questions about our services\n✅ Create support tickets\n✅ Provide product information\n✅ Help with technical issues\n✅ Billing and account support\n✅ General knowledge questions\n\nJust ask me anything! I'm here to help 24/7.`,
    ]
  },
  // Project related questions
  project: {
    patterns: ['project', 'crm', 'nexsupport', 'company', 'business', 'about nexsupport', 'what does', 'your product'],
    responses: [
      `🏢 **About NexSupport AI CRM - 100% FREE!**\n\nNexSupport AI is a modern customer support platform featuring:\n\n✨ AI-powered chat responses - Free\n📧 Multi-channel support (Email, WhatsApp) - Free\n🎫 Ticket management system - Free\n📊 Real-time analytics dashboard - Free\n🔌 Easy API integrations - Free\n\n**Tech Stack:**\n• Next.js 13 (Frontend) - Free\n• Supabase (Database) - Free tier\n• OpenRouter AI (LLM) - Free models\n• Twilio (WhatsApp) - Free trial\n\n**💡 Everything is FREE!**\nNo payments, no premium plans, no hidden costs!\n\nWould you like to know more about any specific feature?`,
    ]
  },
  admin: {
    patterns: ['admin', 'dashboard', 'analytics', 'stats', 'manage', 'tickets', 'view tickets'],
    responses: [
      `📊 **Admin Dashboard - Free Access!**\n\nThe admin panel allows you to:\n\n✅ View all support tickets - Free\n✅ Filter by status (Open, Pending, Closed) - Free\n✅ Manage ticket priorities - Free\n✅ Track response times - Free\n✅ View analytics and metrics - Free\n\nYou can access it by clicking the Admin button in the navigation or going to /admin\n\n💡 **All admin features are completely free!**\n\nNeed help with anything specific in the admin panel?`,
    ]
  },
  chat: {
    patterns: ['chat', 'live chat', 'conversation', 'message', 'talk'],
    responses: [
      `💬 **Live Chat - Free AI Support!**\n\nYou're currently in our AI-powered live chat! I can help you with:\n\n✅ General questions - Free\n✅ Creating support tickets - Free\n✅ Product information - Free\n✅ Technical support - Free\n✅ Billing inquiries - Free (Everything's free!)\n\nJust type your question and I'll respond instantly!\n\n🎉 **100% Free Service - No costs ever!**`,
    ]
  },
  support: {
    patterns: ['support', 'ticket', 'create ticket', 'submit ticket', 'help request'],
    responses: [
      `🎫 **Support Tickets - Completely Free!**\n\nYou can get support in two ways:\n\n1️⃣ **Live Chat** (Current) - Instant AI responses (Free)\n2️⃣ **Support Page** - Submit a detailed ticket (Free)\n\nTo submit a ticket:\n• Go to /support\n• Fill in your details\n• Describe your issue\n• Get email responses (Free)\n\nTickets are tracked and you can check status in the admin panel!\n\n💡 **All support is 100% free!** No charges, ever.`,
    ]
  },
}

// General knowledge and conversation patterns
const generalResponses = {
  questions: [
    {
      patterns: ['how', 'why', 'when', 'where', 'which', 'what'],
      handler: (message: string) => {
        // Check if it matches any specific category
        for (const [category, data] of Object.entries(knowledgeBase)) {
          if (data.patterns.some(pattern => message.toLowerCase().includes(pattern))) {
            const randomIndex = Math.floor(Math.random() * data.responses.length)
            return data.responses[randomIndex]
          }
        }
        // Default thoughtful response for questions
        return `🤔 That's an interesting question! Let me help you with that.\n\nBased on your query about "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}", I'd recommend:\n\n1. Check our documentation for detailed information\n2. Create a support ticket for personalized assistance\n3. Contact our team directly for urgent matters\n\nWould you like me to create a ticket for you, or is there something specific I can help you with right now?`
      }
    }
  ],
  statements: [
    {
      patterns: ['i want', 'i need', 'i would like', 'looking for', 'interested in'],
      handler: (message: string) => {
        return `👍 I understand you're looking for something. Let me help!\n\nYou mentioned: "${message.substring(0, 60)}${message.length > 60 ? '...' : ''}"\n\nI can assist you with:\n✅ Product information\n✅ Creating a support ticket\n✅ Answering questions\n✅ Technical support\n✅ Billing help\n\nCould you provide more details about what you need?`
      }
    },
    {
      patterns: ['i think', 'i believe', 'in my opinion', 'maybe', 'perhaps'],
      handler: (message: string) => {
        return `💭 I appreciate your thoughts! \n\nYou shared: "${message.substring(0, 60)}${message.length > 60 ? '...' : ''}"\n\nIs there something specific you'd like help with? I'm here to assist with any questions or concerns you might have.`
      }
    },
    {
      patterns: ['love', 'like', 'enjoy', 'prefer', 'favorite'],
      handler: (message: string) => {
        return `😊 That's wonderful to hear!\n\nI'm glad you ${message.toLowerCase().includes('love') ? 'love' : 'like'} it! We're always working to improve our services.\n\nIs there anything else you'd like to share or any way I can help you today?`
      }
    },
    {
      patterns: ['hate', 'dislike', 'frustrated', 'angry', 'upset', 'unhappy'],
      handler: (message: string) => {
        return `😟 I'm sorry to hear that you're feeling this way.\n\nI understand your frustration with: "${message.substring(0, 60)}${message.length > 60 ? '...' : ''}"\n\nLet me make this right for you:\n1. I can create a priority ticket immediately\n2. Escalate this to our support team\n3. Provide you with direct contact information\n\nHow would you like to proceed? Your satisfaction is our priority.`
      }
    }
  ]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      message,
      customerEmail,
      customerName,
      customerPhone,
      channel = 'web',
      priority = 'medium',
      conversationHistory = [],
      action,
      ticketId,
      status,
    } = body

    console.log('Agent API received:', { message, customerEmail, action })

    // Handle direct ticket update action from admin
    if (action === 'update_ticket' && ticketId && status) {
      return NextResponse.json({
        response: `Ticket ${ticketId} status updated to ${status}`,
        ticket: { id: ticketId, status },
        success: true,
      })
    }

    // Create a ticket for new requests
    const ticket = {
      id: `TKT-${Date.now()}`,
      customerEmail,
      customerName,
      customerPhone,
      channel,
      priority,
      message,
      status: 'open',
      createdAt: new Date().toISOString(),
    }
    tickets.push(ticket)

    // Generate helpful response based on message
    const aiResponse = generateIntelligentResponse(message, ticket.id, conversationHistory)

    return NextResponse.json({
      response: aiResponse,
      ticket: ticket,
      toolUsed: 'create_ticket',
    })
  } catch (error) {
    console.error('Agent API Error:', error)
    return NextResponse.json(
      {
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error',
        response: getFallbackResponse()
      },
      { status: 500 }
    )
  }
}

function generateIntelligentResponse(message: string, ticketId: string, conversationHistory: any[]): string {
  const lowerMessage = message.toLowerCase()

  // Check conversation history for context
  const hasTicketContext = conversationHistory.some(h =>
    h.content?.includes('Ticket Created') || h.content?.includes(ticketId)
  )

  // First check general response patterns (questions and statements)
  for (const category of generalResponses.questions) {
    if (category.patterns.some(pattern => lowerMessage.includes(pattern))) {
      return category.handler(message)
    }
  }

  for (const category of generalResponses.statements) {
    if (category.patterns.some(pattern => lowerMessage.includes(pattern))) {
      return category.handler(message)
    }
  }

  // Search knowledge base for matching patterns
  for (const [category, data] of Object.entries(knowledgeBase)) {
    if (data.patterns.some(pattern => lowerMessage.includes(pattern))) {
      const randomIndex = Math.floor(Math.random() * data.responses.length)
      return data.responses[randomIndex]
    }
  }

  // Handle specific cases with ticket creation
  if (lowerMessage.includes('urgent') || lowerMessage.includes('emergency')) {
    return `🎫 **Ticket Created: ${ticketId}**\n\nThank you for contacting us! I understand this is urgent.\n\n✅ Your ticket has been created with **HIGH PRIORITY**\n\n📧 We'll respond to ${ticketId} within 1 hour.\n\nIs there anything else I can help you with?`
  }

  if (lowerMessage.includes('password') || lowerMessage.includes('login') || lowerMessage.includes('account')) {
    return `🎫 **Ticket Created: ${ticketId}**\n\nThank you for contacting us about your account issue!\n\n✅ Your support ticket has been created\n\n📧 Our team will send password reset instructions shortly.\n\nIn the meantime, try:\n• Clearing browser cache\n• Using "Forgot Password" link\n• Checking spam folder\n\nAnything else I can help with?`
  }

  if (lowerMessage.includes('billing') || lowerMessage.includes('payment') || lowerMessage.includes('refund')) {
    return `🎫 **Ticket Created: ${ticketId}**\n\nThank you for your billing inquiry!\n\n✅ Your ticket has been created\n\n💳 Our billing team will review your case and respond within 24 hours.\n\nReference: ${ticketId}\n\nCan I help you with anything else?`
  }

  if (lowerMessage.includes('ticket') || lowerMessage.includes('create') || lowerMessage.includes('support') || lowerMessage.includes('help')) {
    return `🎫 **Ticket Created: ${ticketId}**\n\n👋 **Thank you for contacting us!**\n\n✅ We've received your request and our team will respond shortly.\n\n📧 Expected response time: 2-4 hours\n\nYour ticket details have been sent to your email.\n\nIs there anything else I can assist you with today?`
  }

  // Default intelligent response for unmatched queries
  return `👋 **Thank you for your message!**\n\n🎫 **Ticket Created: ${ticketId}**\n\nI've received your inquiry about: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"\n\n✅ **Your ticket has been created**\n📧 Our specialist team will review and respond within 2-4 hours\n⏰ Expected resolution: Same business day\n\n**What happens next?**\n1. You'll receive a confirmation email\n2. Our team analyzes your request\n3. You'll get a detailed response\n4. We follow up until resolved\n\nReference ID: **${ticketId}**\n\nAnything else I can help you with right now?`
}

function getFallbackResponse(): string {
  return `🎫 **Thank you for your message!**\n\nYour support ticket has been created. Our team will respond to you shortly.\n\nReference ID will be provided once processed.\n\nThank you for your patience!`
}
