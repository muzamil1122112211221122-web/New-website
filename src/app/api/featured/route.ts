export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

export async function GET() {
  const { data, error } = await supabaseAdmin.from('featured_collections').select('*').not('id', 'like', 'craft_%').order('sort_order', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const collections = await req.json();
  // Delete all featured (excluding craftsmanship) and reinsert
  await supabaseAdmin.from('featured_collections').delete().not('id', 'like', 'craft_%');
  if (collections.length > 0) {
    const { error } = await supabaseAdmin.from('featured_collections').insert(
      collections.map((c: any, i: number) => {
        // Ensure we don't pass an empty id, let supabase generate it if it's empty
        const payload = { ...c, sort_order: i };
        if (!payload.id || payload.id === '') delete payload.id;
        return payload;
      })
    );
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}

