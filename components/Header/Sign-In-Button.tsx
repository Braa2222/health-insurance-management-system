import Link from "next/link";

import { auth } from "@/auth";
import { AuthenticatedUserMenu } from "@/components/Header/AuthenticatedUserMenu";
import { Button } from "@/components/ui/button";

export async function SignInButton() {
  const session = await auth();

  if (!session?.user) {
    return (
      <Button
        nativeButton={false}
        render={<Link href="/sign-in" />}
        className="h-10 rounded-lg bg-teal-600 px-5 font-medium text-white shadow-sm transition-all hover:bg-teal-700 hover:shadow-md active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
      >
        Sign In
      </Button>
    );
  }

  return (
    <AuthenticatedUserMenu
      user={{
        name: session.user.name?.trim() || "User",
        email: session.user.email?.trim() || "Email unavailable",
        role: session.user.role,
      }}
    />
  );
}
