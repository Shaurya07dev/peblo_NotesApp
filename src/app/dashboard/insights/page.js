"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { fetchInsights } from "@/lib/notes-service";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import {
  FileText,
  Clock,
  Sparkles,
  Tag,
  ArrowLeft,
  Loader2,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function InsightsPage() {
  return (
    <ProtectedRoute>
      <InsightsContent />
    </ProtectedRoute>
  );
}

function InsightsContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user?.uid) return;
      try {
        const data = await fetchInsights(user.uid);
        setInsights(data);
      } catch (error) {
        console.error("Error loading insights:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user?.uid]);

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <Loader2
            className="w-8 h-8 animate-spin"
            style={{ color: "var(--color-primary)" }}
          />
        </div>
      </div>
    );
  }

  if (!insights) return null;

  const days = Object.entries(insights.dailyActivity);
  const maxActivity = Math.max(
    ...days.map(([, v]) => v.created + v.updated),
    1
  );

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => router.push("/dashboard")} className="btn-ghost">
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </button>
          <div>
            <h1
              className="text-2xl font-bold"
              style={{ color: "var(--color-text)" }}
            >
              Productivity Insights
            </h1>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              Your writing activity over the last 7 days
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={FileText}
            label="Total Notes"
            value={insights.totalNotes}
            color="var(--color-primary)"
          />
          <StatCard
            icon={Clock}
            label="Recent (7d)"
            value={insights.recentNotes}
            color="var(--color-cta)"
          />
          <StatCard
            icon={Sparkles}
            label="AI Summaries"
            value={insights.aiUsedCount}
            color="var(--color-warning)"
          />
          <StatCard
            icon={Tag}
            label="Unique Tags"
            value={insights.topTags.length}
            color="var(--color-success)"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Chart */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="w-5 h-5" style={{ color: "var(--color-primary)" }} />
              <h3 className="text-base font-semibold" style={{ color: "var(--color-text)" }}>
                Weekly Activity
              </h3>
            </div>
            <div className="space-y-3">
              {days.map(([date, activity]) => {
                const total = activity.created + activity.updated;
                const pct = (total / maxActivity) * 100;
                const dayName = new Date(date + "T12:00:00").toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                });

                return (
                  <div key={date} className="flex items-center gap-3">
                    <span
                      className="text-xs w-20 text-right flex-shrink-0"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {dayName}
                    </span>
                    <div
                      className="flex-1 h-7 rounded-lg overflow-hidden relative"
                      style={{ background: "var(--color-border-light)" }}
                    >
                      <div
                        className="h-full rounded-lg transition-all duration-500"
                        style={{
                          width: `${Math.max(pct, total > 0 ? 8 : 0)}%`,
                          background: total > 0
                            ? "linear-gradient(90deg, var(--color-primary), var(--color-primary-light))"
                            : "transparent",
                        }}
                      />
                      {total > 0 && (
                        <span
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium"
                          style={{ color: pct > 50 ? "white" : "var(--color-text-muted)" }}
                        >
                          {total}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Tags */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 className="w-5 h-5" style={{ color: "var(--color-cta)" }} />
              <h3 className="text-base font-semibold" style={{ color: "var(--color-text)" }}>
                Most Used Tags
              </h3>
            </div>
            {insights.topTags.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--color-text-light)" }}>
                No tags used yet. Add tags to your notes to see analytics.
              </p>
            ) : (
              <div className="space-y-3">
                {insights.topTags.map(([tag, count]) => {
                  const maxCount = insights.topTags[0][1];
                  const pct = (count / maxCount) * 100;
                  return (
                    <div key={tag} className="flex items-center gap-3">
                      <span
                        className="text-sm w-24 truncate text-right flex-shrink-0 font-medium"
                        style={{ color: "var(--color-text)" }}
                      >
                        #{tag}
                      </span>
                      <div
                        className="flex-1 h-7 rounded-lg overflow-hidden relative"
                        style={{ background: "var(--color-border-light)" }}
                      >
                        <div
                          className="h-full rounded-lg transition-all duration-500"
                          style={{
                            width: `${Math.max(pct, 8)}%`,
                            background: "linear-gradient(90deg, var(--color-cta), var(--color-cta-hover))",
                          }}
                        />
                        <span
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium"
                          style={{ color: pct > 50 ? "white" : "var(--color-text-muted)" }}
                        >
                          {count}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="card p-5 text-center">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
        style={{ background: `${color}15` }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div className="text-2xl font-bold mb-1" style={{ color: "var(--color-text)" }}>
        {value}
      </div>
      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>
        {label}
      </div>
    </div>
  );
}
