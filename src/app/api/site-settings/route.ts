export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key') || 'craftsmanship_images';
  const { data, error } = await supabaseAdmin.from('site_settings').select('value').eq('key', key).single();
  if (error || !data) return NextResponse.json({ value: ['/p5.jpg', '/p6.jpg', '/p7.jpg'] });
  return NextResponse.json({ value: data.value });
}

export async function POST(req: NextRequest) {
  const { key, value } = await req.json();
  const { data, error } = await supabaseAdmin.from('site_settings').upsert({ key, value }, { onConflict: 'key' }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
