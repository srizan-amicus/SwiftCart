import RegisterForm from "./RegisterForm";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Create Account",
  description:
    "Create your SwiftCart account to explore products, shop your favorites, and manage your orders.",
});

export default function RegisterPage() {
  return <RegisterForm />;
}
