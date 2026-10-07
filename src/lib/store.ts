// Simple in-memory store for orders (no DB needed for local use)
export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  city: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  notes?: string;
}

// Global store (persisted in memory for the server lifetime)
declare global {
  // eslint-disable-next-line no-var
  var __ijcOrders: Order[] | undefined;
}

if (!global.__ijcOrders) {
  global.__ijcOrders = [
    {
      id: 'demo-1',
      orderNumber: 'IJC-0001',
      customerName: 'Ahmed Ali',
      customerPhone: '0300-1234567',
      customerEmail: 'ahmed@example.com',
      address: 'House #12, Street 4, Gulberg III',
      city: 'Lahore',
      items: [{ id: 'r1', name: 'Royal Gold Ring', price: 45000, quantity: 1, image: '/p1.jpg' }],
      total: 45000,
      status: 'pending',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      notes: 'Please gift wrap',
    },
    {
      id: 'demo-2',
      orderNumber: 'IJC-0002',
      customerName: 'Fatima Zahra',
      customerPhone: '0321-9876543',
      customerEmail: 'fatima@example.com',
      address: 'Flat 5B, Clifton Block 4',
      city: 'Karachi',
      items: [
        { id: 'n1', name: 'Diamond Necklace Set', price: 125000, quantity: 1, image: '/p2.jpg' },
        { id: 'e1', name: 'Pearl Earrings', price: 18000, quantity: 1, image: '/p3.jpg' },
      ],
      total: 143000,
      status: 'processing',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
  ];
}

export const ordersStore = {
  getAll: (): Order[] => global.__ijcOrders ?? [],
  add: (order: Order): void => {
    if (!global.__ijcOrders) global.__ijcOrders = [];
    global.__ijcOrders.unshift(order);
  },
  updateStatus: (id: string, status: Order['status']): boolean => {
    const idx = (global.__ijcOrders ?? []).findIndex((o) => o.id === id);
    if (idx === -1) return false;
    global.__ijcOrders![idx].status = status;
    return true;
  },
  getNextOrderNumber: (): string => {
    const orders = global.__ijcOrders ?? [];
    const num = orders.length + 1;
    return `IJC-${String(num).padStart(4, '0')}`;
  },
};
