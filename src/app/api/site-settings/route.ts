export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

export async function GET(req: NextRequest) {
  const { data, error } = await supabaseAdmin.from('featured_collections').select('*').in('id', ['craft_1', 'craft_2', 'craft_3']);
  
  const defaultImages = ['/p5.jpg', '/p6.jpg', '/p7.jpg'];
  const images = [...defaultImages];

  if (data && !error) {
    data.forEach(item => {
      if (item.id === 'craft_1' && item.image) images[0] = item.image;
      if (item.id === 'craft_2' && item.image) images[1] = item.image;
      if (item.id === 'craft_3' && item.image) images[2] = item.image;
    });
  }

  return NextResponse.json({ value: images });
}

export async function POST(req: NextRequest) {
  const { value } = await req.json(); // value should be an array of 3 images

  if (!Array.isArray(value) || value.length !== 3) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const rows = value.map((img, idx) => ({
    id: `craft_${idx + 1}`,
    name: 'Craftsmanship Image',
    count: '0',
    desc: 'Internal',
    image: img,
    href: '#'
  }));

  const { error } = await supabaseAdmin.from('featured_collections').upsert(rows);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
