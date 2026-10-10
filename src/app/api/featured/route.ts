export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

// Simple UUID v4 generator (no external dependency)
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('featured_collections')
    .select('*')
    .not('id', 'like', 'craft_%')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[featured GET]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const collections = await req.json();

  // Delete all featured (excluding craftsmanship rows)
  const { error: delError } = await supabaseAdmin
    .from('featured_collections')
    .delete()
    .not('id', 'like', 'craft_%');

  if (delError) {
    console.error('[featured DELETE]', delError);
    return NextResponse.json({ error: delError.message }, { status: 500 });
  }

  if (collections.length > 0) {
    const rows = collections.map((c: any, i: number) => ({
      id: uuidv4(),           // Always generate a fresh UUID
      name: c.name || '',
      desc: c.desc || '',
      image: c.image || '',
      count: String(c.count ?? '0'),
      href: c.href || '/collections',
      sort_order: i,
    }));

    const { error: insertError } = await supabaseAdmin
      .from('featured_collections')
      .insert(rows);

    if (insertError) {
      console.error('[featured INSERT]', insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
