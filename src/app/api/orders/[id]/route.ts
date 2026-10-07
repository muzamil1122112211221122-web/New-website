import { NextRequest, NextResponse } from 'next/server';
import { ordersStore } from '@/lib/store';

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { status } = await req.json();
    const { id } = await context.params;
    const updated = ordersStore.updateStatus(id, status);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
