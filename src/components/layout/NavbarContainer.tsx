
import Navbar from "@/components/layout/Navbar";
import { getAuthSession } from "@/lib/auth";

// Hardcoded display name
const USER_NAME = "Shivam";

export default async function NavbarContainer() {
  const session = await getAuthSession();

  return (
    <Navbar
      isLoggedIn={session.isLoggedIn}
      userName={session.isLoggedIn ? USER_NAME : null}
    />
  );
}
