import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  Sparkles,
  Search,
  Share2,
  Tags,
  BarChart3,
  Shield,
  ArrowRight,
  CheckCircle,
  Zap,
  FileText,
} from "lucide-react";

export default function HomePage() {
  const features = [
    {
      icon: FileText,
      title: "Smart Notes",
      desc: "Create, edit, and auto-save notes with rich markdown support and seamless organisation.",
    },
    {
      icon: Tags,
      title: "Tags & Categories",
      desc: "Organise your thoughts with flexible tags and categories. Find anything in seconds.",
    },
    {
      icon: Sparkles,
      title: "AI Summaries",
      desc: "Generate intelligent summaries, extract action items, and get title suggestions powered by AI.",
    },
    {
      icon: Search,
      title: "Search & Filter",
      desc: "Instant keyword search with tag filtering and smart sorting to find notes quickly.",
    },
    {
      icon: Share2,
      title: "Public Sharing",
      desc: "Share notes with anyone via public links. Control visibility with a single click.",
    },
    {
      icon: BarChart3,
      title: "Productivity Insights",
      desc: "Track your writing habits with activity charts, tag analytics, and AI usage stats.",
    },
  ];

  const stats = [
    { value: "AI-Powered", label: "Smart Summaries" },
    { value: "Real-time", label: "Auto-Save" },
    { value: "Instant", label: "Search" },
    { value: "One-Click", label: "Sharing" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-20"
            style={{ background: "var(--color-primary-light)" }}
          />
          <div
            className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full opacity-10"
            style={{ background: "var(--color-cta)" }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-20 md:pt-24 md:pb-28 relative">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in"
              style={{
                background: "rgba(13, 148, 136, 0.1)",
                color: "var(--color-primary)",
              }}
            >
              <Zap className="w-4 h-4" />
              AI-Powered Notes Workspace
            </div>

            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6 animate-slide-up"
              style={{ color: "var(--color-text)" }}
            >
              Your Notes,{" "}
              <span style={{ color: "var(--color-primary)" }}>
                Supercharged
              </span>{" "}
              with AI
            </h1>

            <p
              className="text-lg md:text-xl mb-8 max-w-2xl mx-auto animate-slide-up"
              style={{
                color: "var(--color-text-muted)",
                animationDelay: "100ms",
              }}
            >
              Create, organise, and unlock insights from your notes with
              AI-powered summaries, smart search, and seamless sharing. The
              modern workspace you&apos;ve been waiting for.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up"
              style={{ animationDelay: "200ms" }}
            >
              <Link href="/signup" className="btn-primary text-base no-underline">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/login" className="btn-secondary no-underline">
                Log In to Dashboard
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
            {stats.map((stat, i) => (
              <div key={i} className="text-center animate-slide-up" style={{ animationDelay: `${300 + i * 80}ms` }}>
                <div
                  className="text-xl font-bold"
                  style={{ color: "var(--color-primary)" }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-sm mt-1"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="py-20 md:py-28"
        style={{ background: "var(--color-surface)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: "var(--color-text)" }}
            >
              Everything You Need
            </h2>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: "var(--color-text-muted)" }}
            >
              A complete notes workspace with powerful AI capabilities built right in.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="card p-6 cursor-pointer"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(13, 148, 136, 0.1)" }}
                >
                  <f.icon
                    className="w-6 h-6"
                    style={{ color: "var(--color-primary)" }}
                  />
                </div>
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: "var(--color-text)" }}
                >
                  {f.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div
            className="rounded-3xl p-10 md:p-14"
            style={{
              background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))",
            }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Notes?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
              Join Peblo and experience the future of note-taking with AI at your fingertips.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-white px-8 py-3.5 rounded-xl font-semibold text-base no-underline transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
              style={{ color: "var(--color-primary-dark)" }}
            >
              <CheckCircle className="w-5 h-5" />
              Start Taking Smarter Notes
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="border-t py-8"
        style={{
          borderColor: "var(--color-border)",
          background: "var(--color-surface)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "var(--color-primary)" }}
            >
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold" style={{ color: "var(--color-text)" }}>
              Peblo Notes
            </span>
          </div>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            &copy; {new Date().getFullYear()} Peblo. Built for the Peblo Full Stack Developer Challenge.
          </p>
        </div>
      </footer>
    </div>
  );
}
