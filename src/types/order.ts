
export interface OrderItem {
  orderItemId: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  itemSubtotal: number;
}

export interface OrderShipping {
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingMethod: string;
  shippingCharge: number;
}

export interface OrderPayment {
  paymentId: number;
  orderId: number;
  paymentStatus: string;
  paymentMethod: string;
  amount: number;
  transactionReference: string;
  createdAt: string;
}

export interface OrderDetails {
  orderId: number;
  customerId: number;
  subtotal: number;
  shippingCharge: number;
  tax: number;
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
  items: OrderItem[];
  shipping: OrderShipping;
  payment: OrderPayment | null;
}
