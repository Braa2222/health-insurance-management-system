import { SignInButton } from "@/components/Header/Sign-In-Button";
import { MainHeaderClient } from "@/components/Header/MainHeaderClient";

export default function Header() {
  return (
    <MainHeaderClient
      desktopAuthAction={<SignInButton />}
      mobileAuthAction={<SignInButton />}
    />
  );
}
