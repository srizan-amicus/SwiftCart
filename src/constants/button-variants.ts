export const ButtonVariant = {
  Primary: "primary",
  Secondary: "secondary",
  Outline: "outline",
  Danger: "danger",
  Order: "order",
  Quantity: "quantity",
  QuantityAction: "quantityAction",
  Compact: "compact",
} as const;

export type ButtonVariant = (typeof ButtonVariant)[keyof typeof ButtonVariant];
