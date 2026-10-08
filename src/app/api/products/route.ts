export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

export async function GET() {
  const { data, error } = await supabaseAdmin.from('products').select('*').order('created_at', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const product = await req.json();
  
  // Map camelCase to snake_case for Supabase
  if (product.isBestSeller !== undefined) {
    product.is_best_seller = product.isBestSeller;
    delete product.isBestSeller;
  }
  if (product.originalPrice !== undefined) {
    product.original_price = product.originalPrice;
    delete product.originalPrice;
  }
  // Also clean up any other camelCase fields that might cause issues if they don't exist in DB
  delete product.isNew;
  delete product.weight;

  const { data, error } = await supabaseAdmin.from('products').upsert(product).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const { error } = await supabaseAdmin.from('products').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

