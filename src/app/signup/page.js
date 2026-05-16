"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { FileText, Mail, Lock, User, ArrowRight, AlertCircle } from "lucide-react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup, user } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  if (user) {
    router.replace("/dashboard");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }

    setLoading(true);
    const result = await signup(name.trim(), email, password);
    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 no-underline">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "var(--color-primary)" }}
            >
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span
              className="text-2xl font-bold"
              style={{ color: "var(--color-text)" }}
            >
              Peblo
            </span>
          </Link>
          <h1
            className="text-2xl font-bold mt-6 mb-2"
            style={{ color: "var(--color-text)" }}
          >
            Create your account
          </h1>
          <p style={{ color: "var(--color-text-muted)" }}>
            Start organising your notes with AI
          </p>
        </div>

        {/* Form */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div
                className="flex items-center gap-2 p-3 rounded-lg text-sm"
                style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  color: "var(--color-danger)",
                }}
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--color-text)" }}
              >
                Full Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: "var(--color-text-light)" }}
                />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input pl-11"
                  placeholder="John Doe"
                  required
                  autoComplete="name"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--color-text)" }}
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: "var(--color-text-light)" }}
                />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-11"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--color-text)" }}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: "var(--color-text-light)" }}
                />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-11"
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full justify-center"
              disabled={loading}
            >
              {loading ? (
                <span className="animate-pulse">Creating account...</span>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p
            className="text-center text-sm mt-6"
            style={{ color: "var(--color-text-muted)" }}
          >
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold no-underline"
              style={{ color: "var(--color-primary)" }}
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
