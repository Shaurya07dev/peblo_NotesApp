"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/components/ThemeProvider";
import { Sun, Moon, LogOut, LayoutDashboard, FileText } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  const isLanding = pathname === "/";
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <nav
      className="sticky top-0 z-40 border-b"
      style={{
        background: "var(--color-surface)",
        borderColor: "var(--color-border)",
        height: "var(--nav-height)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link
          href={user ? "/dashboard" : "/"}
          className="flex items-center gap-2 no-underline"
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "var(--color-primary)" }}
          >
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span
            className="text-xl font-bold tracking-tight"
            style={{ color: "var(--color-text)" }}
          >
            Peblo
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="btn-icon"
            aria-label="Toggle theme"
            title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>

          {user ? (
            <>
              {!isDashboard && (
                <Link href="/dashboard" className="btn-ghost no-underline">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
              )}
              <button
                onClick={logout}
                className="btn-ghost"
                style={{ color: "var(--color-danger)" }}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-white ml-1"
                style={{ background: "var(--color-primary)" }}
                title={user.displayName || user.email}
              >
                {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="btn-ghost no-underline"
                style={{ color: "var(--color-text)" }}
              >
                Log In
              </Link>
              <Link href="/signup" className="btn-primary no-underline text-sm">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
