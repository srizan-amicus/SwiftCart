import PaymentSelectionForm from "@/components/payment/PaymentSelectionForm";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Shipping & Payment",
  description:
    "Choose your shipping method and payment option to complete your SwiftCart purchase.",
});

export default function PaymentPage() {
  return <PaymentSelectionForm />;
}
