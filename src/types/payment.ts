
export type DisplayPaymentMethod =
  | "Card"
  | "UPI"
  | "Cash on Delivery";

export interface PaymentSelection {
  shippingMethod: "Standard" | "Express" | "Same Day";
  displayPaymentMethod: DisplayPaymentMethod;
}
