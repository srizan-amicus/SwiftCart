export interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  streetAddress: string;
  apartment: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}
export type ShippingMethod = "Standard" | "Express" | "Same Day";

export interface Address {
  addressId: number;
  customerId: number;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface CreateAddressRequest {
  addressId: number;
  customerId: number;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}