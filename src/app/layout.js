import { Plus_Jakarta_Sans } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Peblo Notes — AI-Powered Collaborative Notes Workspace",
  description:
    "Create, organise, and supercharge your notes with AI-powered summaries, smart search, and seamless sharing. Built for modern productivity.",
  keywords: ["notes", "AI", "productivity", "workspace", "collaboration"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={plusJakarta.variable}>
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
