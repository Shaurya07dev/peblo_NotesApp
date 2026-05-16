<div align="center">

# 🪨 Peblo Notes

### AI-Powered Notes Workspace

A full-stack collaborative notes application with AI-powered summaries, smart search, and seamless public sharing.

[![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-DD2C00?style=for-the-badge&logo=firebase&logoColor=white)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![OpenAI](https://img.shields.io/badge/GPT--5_Nano-412991?style=for-the-badge&logo=openai&logoColor=white)](https://github.com/marketplace/models)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)
![Node](https://img.shields.io/badge/node-18%2B-brightgreen?style=flat-square&logo=nodedotjs&logoColor=white)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)

[Live Demo →](#) · [Report Bug →](https://github.com/Shaurya07dev/peblo_NotesApp/issues) · [Request Feature →](https://github.com/Shaurya07dev/peblo_NotesApp/issues)

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🤖 AI-Powered Intelligence
- **Smart Summaries** — Generate concise note summaries with GPT-5 Nano
- **Action Item Extraction** — Automatically pull out todos from your notes
- **Title Suggestions** — Get AI-generated title recommendations

</td>
<td width="50%">

### 📝 Rich Notes Workspace
- **Markdown Support** — Write with full markdown rendering
- **Auto-Save** — Never lose your work with real-time persistence
- **Tags & Categories** — Organize notes with flexible tagging

</td>
</tr>
<tr>
<td width="50%">

### 🔍 Powerful Search
- **Instant Keyword Search** — Find any note in milliseconds
- **Tag-Based Filtering** — Filter by categories and tags
- **Smart Sorting** — Sort by date, title, or relevance

</td>
<td width="50%">

### 🌐 Share & Collaborate
- **Public Sharing** — Generate public links with one click
- **Access Control** — Toggle note visibility instantly
- **Clean Public View** — Beautiful read-only shared pages

</td>
</tr>
<tr>
<td width="50%">

### 📊 Productivity Insights
- **Activity Charts** — Visualize your weekly writing habits
- **Tag Analytics** — See your most-used categories
- **AI Usage Stats** — Track how AI enhances your workflow

</td>
<td width="50%">

### 🛡️ Secure & Polished
- **Firebase Auth** — Secure email/password authentication
- **Firestore Rules** — Row-level security for all data
- **Dark Mode** — System-aware theme with manual toggle

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

<table>
<tr>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=nextjs" width="48" height="48" alt="Next.js" />
<br><strong>Next.js 16</strong>
<br><sub>App Router</sub>
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=react" width="48" height="48" alt="React" />
<br><strong>React 19</strong>
<br><sub>UI Library</sub>
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=firebase" width="48" height="48" alt="Firebase" />
<br><strong>Firebase</strong>
<br><sub>Auth + Firestore</sub>
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=tailwind" width="48" height="48" alt="Tailwind" />
<br><strong>Tailwind 4</strong>
<br><sub>Styling</sub>
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=vercel" width="48" height="48" alt="Vercel" />
<br><strong>Vercel</strong>
<br><sub>Deployment</sub>
</td>
</tr>
</table>

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | ![Next.js](https://img.shields.io/badge/Next.js_16-000?style=flat-square&logo=nextdotjs) | Server-side rendering, API routes, App Router |
| **Frontend** | ![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=000) | Component-based UI with React Compiler |
| **Styling** | ![Tailwind](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=fff) | Utility-first CSS + custom design tokens |
| **Auth** | ![Firebase](https://img.shields.io/badge/Firebase_Auth-DD2C00?style=flat-square&logo=firebase&logoColor=fff) | Email/password authentication |
| **Database** | ![Firestore](https://img.shields.io/badge/Cloud_Firestore-DD2C00?style=flat-square&logo=firebase&logoColor=fff) | NoSQL document database |
| **AI** | ![OpenAI](https://img.shields.io/badge/GPT--5_Nano-412991?style=flat-square&logo=openai&logoColor=fff) | Note summarization via GitHub Models |
| **Icons** | ![Lucide](https://img.shields.io/badge/Lucide_React-F56040?style=flat-square) | Beautiful, consistent icon set |
| **Markdown** | ![Markdown](https://img.shields.io/badge/react--markdown-000?style=flat-square&logo=markdown) | Rich text note rendering |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          CLIENT (Browser)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │  Landing  │  │  Auth    │  │ Dashboard │  │  Note Editor  │  │
│  │  Page     │  │  Pages   │  │  + Grid   │  │  + Markdown   │  │
│  └──────────┘  └──────────┘  └──────────┘  └───────────────┘  │
│                         │                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  React Context: Auth Provider · Theme Provider           │   │
│  └─────────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
     ┌──────────────┐ ┌──────────┐ ┌──────────────┐
     │  Firebase     │ │  Next.js │ │  Firebase    │
     │  Auth         │ │  API     │ │  Firestore   │
     │  (Client SDK) │ │  Routes  │ │  (Client SDK)│
     └──────────────┘ └────┬─────┘ └──────────────┘
                           │
                           ▼
                   ┌──────────────┐
                   │  GitHub      │
                   │  Models API  │
                   │  (GPT-5     │
                   │   Nano)      │
                   └──────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- A **Firebase** project with Authentication & Firestore enabled
- A **GitHub Personal Access Token** with Models API access

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Shaurya07dev/peblo_NotesApp.git
cd peblo_NotesApp

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file with the following:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# GitHub Models - GPT-5 Nano
GITHUB_TOKEN=your_github_personal_access_token
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 📁 Project Structure

```
peblo/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── notes/[id]/generate-summary/  → AI summary endpoint
│   │   ├── dashboard/
│   │   │   ├── page.js                       → Notes grid & management
│   │   │   ├── notes/[id]/page.js            → Rich note editor
│   │   │   └── insights/page.js              → Productivity analytics
│   │   ├── login/page.js                     → Glassmorphism login
│   │   ├── signup/page.js                    → Premium signup flow
│   │   ├── shared/[shareId]/page.js          → Public shared notes
│   │   ├── layout.js                         → Root layout + providers
│   │   ├── globals.css                       → Complete design system
│   │   └── page.js                           → Landing page
│   ├── components/
│   │   ├── Navbar.js                         → Responsive navigation
│   │   ├── NoteCard.js                       → Note preview cards
│   │   ├── SearchBar.js                      → Search + tag filtering
│   │   ├── Modal.js                          → Reusable modal dialog
│   │   ├── ProtectedRoute.js                 → Auth route guard
│   │   └── ThemeProvider.js                  → Dark mode provider
│   └── lib/
│       ├── firebase.js                       → Firebase client config
│       ├── auth-context.js                   → Authentication context
│       ├── notes-service.js                  → Firestore CRUD service
│       └── ai.js                             → GPT-5 Nano integration
├── firestore.rules                           → Security rules
├── firestore.indexes.json                    → Composite indexes
├── firebase.json                             → Firebase config
├── next.config.mjs                           → Next.js configuration
├── tailwind.config.js                        → Tailwind customization
└── package.json
```

---

## 🔐 Security

- **Authentication**: Firebase Auth with email/password
- **Authorization**: Firestore security rules enforce row-level access
- **API Protection**: Server-side AI routes keep tokens secure
- **Environment Variables**: All secrets are server-side only (`GITHUB_TOKEN`)

```javascript
// Firestore Security Rules
match /notes/{noteId} {
  allow read, update, delete: if request.auth.uid == resource.data.userId;
  allow create: if request.auth.uid == request.resource.data.userId;
  allow read: if resource.data.isPublic == true; // Public sharing
}
```

---

## 🚢 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Shaurya07dev/peblo_NotesApp)

1. Push your code to GitHub
2. Import the repository on [Vercel](https://vercel.com)
3. Add all environment variables in Vercel's dashboard
4. Deploy 🚀

### Deploy Firestore Rules

```bash
npx firebase deploy --only firestore:rules,firestore:indexes
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + S` | Save current note |

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ by [Shaurya](https://github.com/Shaurya07dev)**

[![GitHub](https://img.shields.io/badge/GitHub-Shaurya07dev-181717?style=for-the-badge&logo=github)](https://github.com/Shaurya07dev)

</div>
