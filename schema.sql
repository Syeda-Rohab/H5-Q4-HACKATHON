-- CRM FTE Hackathon - Supabase Schema
-- FREE 500MB Postgres Database
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE,
  phone text,
  name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  channel text NOT NULL DEFAULT 'web',
  priority text NOT NULL DEFAULT 'medium',
  status text NOT NULL DEFAULT 'open',
  subject text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  resolved_at timestamptz,
  CONSTRAINT tickets_priority_check CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  CONSTRAINT tickets_status_check CHECK (status IN ('open', 'in_progress', 'resolved', 'closed'))
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id uuid REFERENCES tickets(id) ON DELETE CASCADE,
  role text NOT NULL,
  content text NOT NULL,
  channel text NOT NULL DEFAULT 'web',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT messages_role_check CHECK (role IN ('user', 'assistant', 'system'))
);

-- Knowledge Base table (for future use)
CREATE TABLE IF NOT EXISTS knowledge_base (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  content text NOT NULL,
  category text,
  tags text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_tickets_customer ON tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_channel ON tickets(channel);
CREATE INDEX IF NOT EXISTS idx_messages_ticket ON messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_category ON knowledge_base(category);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  IF NEW.status = 'resolved' AND OLD.status != 'resolved' THEN
    NEW.resolved_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at
  BEFORE UPDATE ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_knowledge_base_updated_at
  BEFORE UPDATE ON knowledge_base
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) - Optional for public access
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;

-- Public read policies (adjust for production)
CREATE POLICY "Public read access for customers" ON customers FOR SELECT USING (true);
CREATE POLICY "Public insert access for customers" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read access for tickets" ON tickets FOR SELECT USING (true);
CREATE POLICY "Public insert access for tickets" ON tickets FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read access for messages" ON messages FOR SELECT USING (true);
CREATE POLICY "Public insert access for messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read access for knowledge base" ON knowledge_base FOR SELECT USING (true);

-- Sample data (optional - for testing)
INSERT INTO knowledge_base (title, content, category, tags) VALUES
  ('How to reset password', 'Go to settings > account > reset password. You will receive an email with instructions.', 'account', ARRAY['password', 'reset', 'login']),
  ('Billing inquiry', 'For billing questions, check your invoice in the dashboard under Settings > Billing.', 'billing', ARRAY['billing', 'invoice', 'payment']),
  ('Account deletion', 'To delete your account, contact support with your account email. Deletion is permanent.', 'account', ARRAY['delete', 'account', 'close'])
ON CONFLICT DO NOTHING;
