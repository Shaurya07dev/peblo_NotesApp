"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

/**
 * Wrapper component that redirects unauthenticated users to /login.
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--color-bg)" }}
      >
        <div className="text-center animate-fade-in">
          <Loader2
            className="w-10 h-10 mx-auto mb-3 animate-spin"
            style={{ color: "var(--color-primary)" }}
          />
          <p style={{ color: "var(--color-text-muted)" }}>Loading…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return children;
}
