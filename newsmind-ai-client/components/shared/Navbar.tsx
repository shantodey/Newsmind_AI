"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaMagnifyingGlass,
  FaBell,
  FaBars,
  FaXmark,
  FaRegLightbulb,
  FaUser,
  FaArrowRightFromBracket,
  FaFolderOpen,
} from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Explore", href: "/explore" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "About", href: "/about" },
  ];

  const handleSignOut = async () => {
    await signOut();
    router.refresh();
  };

  const user = session?.user;
  const isAdmin = (user as { role?: string } | undefined)?.role === "admin";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-100 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-950 shadow-sm">
              <FaRegLightbulb className="size-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              NewsMind<span className="text-teal-600 dark:text-teal-400">.AI</span>
            </span>
          </Link>

          {/* Desktop Nav links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors hover:text-zinc-900 dark:hover:text-zinc-50 ${isActive
                    ? "text-zinc-900 dark:text-zinc-50 border-b-2 border-teal-500 py-1"
                    : "text-zinc-500 dark:text-zinc-400"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-4">
          <div className="relative">
            <FaMagnifyingGlass className="absolute top-2.5 left-2.5 size-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  router.push(`/explore?q=${encodeURIComponent(searchQuery)}`);
                }
              }}
              className="h-9 w-52 rounded-md border border-zinc-200 bg-zinc-50/50 pl-9 pr-4 text-sm font-medium focus:border-zinc-300 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900"
            />
          </div>

          <button
            className="relative flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 text-zinc-500 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 transition-colors"
            aria-label="Notifications"
          >
            <FaBell className="size-4" />
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-teal-500"></span>
          </button>

          {!isPending && user ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all focus:outline-none"
              >
                <Avatar className="size-8 ring-2 ring-teal-500/20">
                  <AvatarImage src={user.image || ""} alt={user.name} />
                  <AvatarFallback className="text-xs font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                    {user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-2 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-900 mb-1">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Signed in as</p>
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50 truncate">{user.name}</p>
                    <p className="text-[10px] text-zinc-500 truncate">{user.email}</p>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                  >
                    <FaUser className="size-3.5" />
                    My Profile
                  </Link>

                  {isAdmin && (
                    <Link
                      href="/articles/manage"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-teal-600 dark:text-teal-400 hover:bg-teal-50/50 dark:hover:bg-teal-950/20 transition-colors"
                    >
                      <FaFolderOpen className="size-3.5" />
                      Manage Articles
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      handleSignOut();
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors mt-1 border-t border-zinc-100 dark:border-zinc-900 pt-2"
                  >
                    <FaArrowRightFromBracket className="size-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button variant="default" size="sm" render={<Link href="/login" />} className="rounded-md cursor-pointer">
              Sign In
            </Button>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-2">
          <button onClick={() => setSearchOpen(!searchOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 text-zinc-500 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 transition-colors"
            aria-label="Toggle search"
          >
            <FaMagnifyingGlass className="size-4" />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 text-zinc-500 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FaXmark className="size-4" /> : <FaBars className="size-4" />}
          </button>
        </div>
      </div>

      {/* Mobile search bar dropdown */}
      {searchOpen && (
        <div className="border-t border-zinc-100 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950 md:hidden">
          <div className="relative">
            <FaMagnifyingGlass className="absolute top-2.5 left-2.5 size-4 text-zinc-400" />
            <input type="text" placeholder="Search news..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  router.push(`/explore?q=${encodeURIComponent(searchQuery)}`);
                  setSearchOpen(false);
                }
              }}
              className="h-9 w-full rounded-md border border-zinc-200 bg-zinc-50/50 pl-9 pr-4 text-sm font-medium focus:border-zinc-300 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900"
            />
          </div>
        </div>
      )}

      {/* Mobile nav menu dropdown */}
      {mobileMenuOpen && (
        <div className="border-t border-zinc-100 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-950 md:hidden space-y-3">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900 ${isActive
                    ? "text-teal-600 dark:text-teal-400 bg-teal-50/30 dark:bg-teal-950/15"
                    : "text-zinc-500 dark:text-zinc-400"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {!isPending && user && (
              <>
                <div className="border-t border-zinc-100 pt-2 mt-2 dark:border-zinc-900" />
                <Link href="/profile" onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900">
                  <FaUser className="size-3.5" />
                  Profile
                </Link>
                {isAdmin && (
                  <Link href="/articles/manage" onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-teal-600 dark:text-teal-400 hover:bg-teal-50/30">
                    <FaFolderOpen className="size-3.5" />
                    Manage Articles
                  </Link>
                )}
              </>
            )}
          </nav>

          <div className="border-t border-zinc-100 pt-3 dark:border-zinc-800 flex flex-col gap-2">
            {!isPending && user ? (
              <Button variant="outline" size="sm" onClick={() => { setMobileMenuOpen(false); handleSignOut(); }} className="w-full rounded-md cursor-pointer text-rose-600
               dark:text-rose-400"
              >
                Sign Out
              </Button>
            ) : (
              <Button variant="default" size="sm" render={<Link href="/login" />} className="w-full rounded-md cursor-pointer" onClick={() => setMobileMenuOpen(false)}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
