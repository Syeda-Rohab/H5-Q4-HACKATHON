import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - List knowledge base articles
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    let query = supabase
      .from('knowledge_base')
      .select('*')
      .order('created_at', { ascending: false })

    if (category) {
      query = query.eq('category', category)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%,tags.cs.{${search}}`)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ articles: data || [] })
  } catch (error) {
    console.error('Knowledge Base API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}

// POST - Create a new knowledge base article
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, category, tags } = body

    const article = await supabase
      .from('knowledge_base')
      .insert({
        title,
        content,
        category: category || 'general',
        tags: tags || [],
      })
      .select()
      .single()

    if (!article.data) {
      return NextResponse.json({ error: 'Failed to create article' }, { status: 500 })
    }

    return NextResponse.json({ success: true, article: article.data })
  } catch (error) {
    console.error('Create Article API Error:', error)
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    )
  }
}

// PUT - Update an article
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, content, category, tags } = body

    const article = await supabase
      .from('knowledge_base')
      .update({
        title,
        content,
        category,
        tags,
      })
      .eq('id', id)
      .select()
      .single()

    if (!article.data) {
      return NextResponse.json({ error: 'Failed to update article' }, { status: 500 })
    }

    return NextResponse.json({ success: true, article: article.data })
  } catch (error) {
    console.error('Update Article API Error:', error)
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    )
  }
}

// DELETE - Delete an article
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Article ID required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('knowledge_base')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete Article API Error:', error)
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    )
  }
}
