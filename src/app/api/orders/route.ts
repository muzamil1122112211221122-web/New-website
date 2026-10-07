import { NextRequest, NextResponse } from 'next/server';
import { ordersStore } from '@/lib/store';

export async function GET() {
  const orders = ordersStore.getAll();
  return NextResponse.json({ success: true, orders });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, customerPhone, customerEmail, address, city, items, total, notes } = body;

    if (!customerName || !customerPhone || !address || !city || !items?.length) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const orderNumber = ordersStore.getNextOrderNumber();
    const order = {
      id: `order-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      orderNumber,
      customerName,
      customerPhone,
      customerEmail: customerEmail || '',
      address,
      city,
      items,
      total,
      notes: notes || '',
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    };

    ordersStore.add(order);

    return NextResponse.json({ success: true, orderNumber, orderId: order.id });
  } catch (err) {
    console.error('Order creation error:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
