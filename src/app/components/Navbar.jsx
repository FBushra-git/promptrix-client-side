"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { Bars, Xmark } from "@gravity-ui/icons";
import { signOut, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const { data: session } = useSession();
  const user = session?.user;

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth/signin");
          router.refresh();
        },
      },
    });
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "All Prompts", href: "/prompts" },
  ];

  if (user) {
    navLinks.push({
      label: "Dashboard",
      href: "/dashboard/creator",
    });
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#1a1a2e]/80 backdrop-blur-xl">
      <div className="navbar-gradient-line h-px w-full bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Promptrix Logo"
            className="h-11 w-11 object-contain"
          />

          <h1 className="hidden text-lg font-bold text-white sm:block">
            Promptrix
          </h1>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <ul className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-2">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="rounded-full px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="h-6 w-px bg-white/20" />

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-gray-300">
                  Hi, {user?.name}!
                </span>

                <Button onClick={handleSignOut} variant="flat" size="sm">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="text-sm font-medium text-gray-300 transition hover:text-white"
                >
                  Login
                </Link>

                <Link href="/auth/signup">
                  <Button
                    as="span"
                    radius="lg"
                    className="cursor-pointer bg-white px-6 text-sm font-semibold text-black"
                  >
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="rounded-lg p-2 text-white transition hover:bg-white/10 md:hidden"
        >
          {isMenuOpen ? <Xmark size={24} /> : <Bars size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-white/10 bg-[#1a1a2e] md:hidden">
          <div className="flex flex-col gap-4 px-4 py-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-base font-medium text-gray-300"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="flex flex-col gap-3 border-t border-white/10 pt-4">
              {user ? (
                <>
                  <p className="text-sm text-gray-400">Hi, {user?.name}!</p>

                  <Button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleSignOut();
                    }}
                    variant="flat"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="text-center font-medium text-gray-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>

                  <Button
                    as={Link}
                    href="/auth/signup"
                    className="bg-white text-black"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="navbar-gradient-line absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
    </nav>
  );
}