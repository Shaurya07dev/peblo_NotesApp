# 🪨 Peblo Notes — AI-Powered Notes Workspace

A full-stack collaborative notes application with AI-powered summaries, smart search, and seamless public sharing. Built with **Next.js 16**, **Firebase**, and **Google Gemini AI**.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | Secure email/password signup & login via Firebase Auth |
| 📝 **Notes Workspace** | Create, edit, tag, and auto-save markdown notes |
| 🤖 **AI Summaries** | Generate summaries, action items, and title suggestions with Gemini AI |
| 🔍 **Search & Filter** | Instant keyword search with tag-based filtering |
| 🌐 **Public Sharing** | Share notes via unique public links with one click |
| 📊 **Productivity Insights** | Weekly activity charts, tag analytics, and AI usage stats |
| 🌙 **Dark Mode** | System-aware theme with manual toggle |
| ⌨️ **Keyboard Shortcuts** | Ctrl+S to save |

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4 + Custom Design System
- **Auth**: Firebase Authentication
- **Database**: Cloud Firestore
- **AI**: Google Gemini 2.0 Flash
- **Icons**: Lucide React
- **Font**: Plus Jakarta Sans

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Firebase project with Firestore & Auth enabled
- Google Gemini API key

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shaurya07dev/peblo_NotesApp.git
   cd peblo_NotesApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Firebase and Gemini API keys in `.env.local`.

4. **Deploy Firestore rules** (optional, for security)
   ```bash
   npx firebase deploy --only firestore:rules,firestore:indexes
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/notes/[id]/generate-summary/  # AI endpoint (server-side)
│   ├── dashboard/                        # Protected dashboard
│   │   ├── page.js                       # Notes grid
│   │   ├── notes/[id]/page.js            # Note editor
│   │   └── insights/page.js              # Productivity insights
│   ├── login/page.js                     # Login page
│   ├── signup/page.js                    # Signup page
│   ├── shared/[shareId]/page.js          # Public shared note
│   ├── layout.js                         # Root layout
│   ├── globals.css                       # Design system
│   └── page.js                           # Landing page
├── components/
│   ├── Navbar.js                         # Navigation
│   ├── NoteCard.js                       # Note preview card
│   ├── SearchBar.js                      # Search + tag filter
│   ├── Modal.js                          # Reusable modal
│   ├── ProtectedRoute.js                 # Auth guard
│   └── ThemeProvider.js                  # Dark mode
└── lib/
    ├── firebase.js                       # Firebase config
    ├── auth-context.js                   # Auth provider
    ├── notes-service.js                  # Firestore CRUD
    └── gemini.js                         # AI integration
```

---

## 🔒 Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Web API Key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase App ID |
| `GEMINI_API_KEY` | Google Gemini API Key (server-side only) |

---

## 📄 License

Built for the **Peblo Full Stack Developer Challenge**.
