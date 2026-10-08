export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  // Map snake_case to camelCase for admin panel compatibility
  const orders = (data ?? []).map(o => ({
    id: o.id,
    orderNumber: o.order_number,
    customerName: o.customer_name,
    customerPhone: o.customer_phone,
    customerEmail: o.customer_email,
    address: o.address,
    city: o.city,
    items: o.items,
    total: o.total,
    notes: o.notes,
    status: o.status,
    createdAt: o.created_at,
  }));
  return NextResponse.json({ success: true, orders });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, customerPhone, customerEmail, address, city, items, total, notes } = body;

    if (!customerName || !customerPhone || !address || !city || !items?.length) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    // Generate order number
    const { count } = await supabaseAdmin.from('orders').select('*', { count: 'exact', head: true });
    const orderNumber = `IC-${String((count ?? 0) + 1001).padStart(4, '0')}`;
    const id = `order-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    const { error } = await supabaseAdmin.from('orders').insert({
      id,
      order_number: orderNumber,
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: customerEmail || '',
      address,
      city,
      items,
      total,
      notes: notes || '',
      status: 'pending',
    });

    if (error) return NextResponse.json({ success: false, message: error.message }, { status: 500 });

    return NextResponse.json({ success: true, orderNumber, orderId: id });
  } catch (err) {
    console.error('Order creation error:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

