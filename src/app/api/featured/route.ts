export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

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
    const rows = collections.map((c: any, i: number) => {
      const payload: any = {
        name: c.name || '',
        desc: c.desc || '',
        image: c.image || '',
        count: String(c.count ?? '0'),
        href: c.href || '/collections',
        sort_order: i,
      };
      // Don't include id — let Supabase generate UUID
      return payload;
    });

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
