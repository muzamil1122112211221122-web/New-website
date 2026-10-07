export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

export async function GET() {
  const { data, error } = await supabaseAdmin.from('featured_collections').select('*').order('sort_order', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const collections = await req.json();
  // Delete all and reinsert (full replace)
  await supabaseAdmin.from('featured_collections').delete().neq('id', '');
  if (collections.length > 0) {
    const { error } = await supabaseAdmin.from('featured_collections').insert(
      collections.map((c: any, i: number) => ({ ...c, sort_order: i }))
    );
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}

