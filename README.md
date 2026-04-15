# ⚡ Nexora App - Smart Internal Dashboard for Modern Teams

<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="50" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="50" />
  <img src="https://raw.githubusercontent.com/radenmasabdul/logo/refs/heads/main/vite.svg" width="50" />
  <img src="https://raw.githubusercontent.com/radenmasabdul/logo/refs/heads/main/tailwindcss.svg" width="50" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg" width="50" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/axios/axios-plain.svg" width="50" />
</p>

Nexora App is a modern, responsive, and intuitive frontend dashboard built to deliver a seamless user experience for internal teams. It focuses on clean design, real-time interaction, and efficient workflows to help organizations manage operations with speed and clarity.

## 🚀 Key Features

- 📊 Modern and responsive dashboard interface
- 🔐 Secure authentication and protected routes
- 👥 Team and employee management system
- 📁 Project and task organization tools
- 📈 Interactive charts and analytics reports
- 🎨 Clean UI with reusable component architecture
- ⚡ Fast performance with Vite and React 19
- 📱 Fully responsive across desktop, tablet, and mobile
- 🔄 Real-time friendly workflow experience

## 🛠️ Tech Stack

- **Library**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI
- **State Management**: Redux Toolkit + React Redux
- **Routing**: React Router DOM
- **Forms**: React Hook Form
- **Validation**: Zod
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Data Table**: TanStack React Table
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Code Quality**: ESLint

## 📋 Prerequisites

Before running Nexora App locally, make sure you have installed:

- **Node.js** v18 or higher
- **npm** or **yarn**
- **Git**
- **Modern Browser** (Chrome, Edge, Firefox)
- **Nexora API** running for full backend integration

## ⚡ Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/radenmasabdul/nexora.git
cd nexora
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=YOUR_API_BASE_URL
```

### 4. Start Development Server
```bash
npm run dev
```

The application will run at http://localhost:5173

## 📁 Project Structure

```bash
nexora/
├── public/                      # Public static assets
├── src/
│   ├── app/                     # Core app configuration
│   │   ├── App.tsx              # Main application component
│   │   ├── layouts/             # Global layouts
│   │   ├── providers.tsx        # App providers
│   │   ├── state/               # App-level state config
│   │   └── theme/               # Theme settings
│   ├── assets/                  # Images and branding assets
│   ├── components/              # Reusable UI components
│   │   ├── layout/              # Layout components
│   │   └── ui/                  # Shared UI elements
│   ├── features/                # Feature-based modules
│   │   ├── activity-logs/       # Activity logs module
│   │   ├── auth/                # Authentication module
│   │   ├── comments/            # Comments module
│   │   ├── dashboard/           # Dashboard module
│   │   ├── notifications/       # Notifications module
│   │   ├── projects/            # Projects module
│   │   ├── tasks/               # Tasks module
│   │   ├── teams/               # Teams module
│   │   └── users/               # Users module
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utilities and helpers
│   │   ├── axios.ts             # Axios instance config
│   │   ├── error.messages.ts    # Global error messages
│   │   ├── formatDate.ts        # Date formatter
│   │   ├── requestCache.ts      # Request cache handler
│   │   └── utils.ts             # Shared utility functions
│   ├── pages/                   # Application pages
│   ├── routes/                  # Route definitions
│   │   ├── AppRouter.tsx        # Main router
│   │   └── ProtectedRoute.tsx   # Protected routes
│   ├── store/                   # Redux store setup
│   ├── styles/                  # Global styles
│   └── main.tsx                 # Application entry point
├── .env                         # Local environment variables
├── .env.example                 # Environment example file
├── .gitignore                   # Ignored files for Git
├── components.json              # UI components config
├── eslint.config.js             # ESLint configuration
├── index.html                   # Main HTML template
├── package.json                 # Dependencies & scripts
├── package-lock.json            # Dependency lock file
├── tsconfig.json                # Base TypeScript config
├── tsconfig.app.json            # App TypeScript config
├── tsconfig.node.json           # Node TypeScript config
├── vite.config.ts               # Vite configuration
├── vercel.json                  # Vercel deployment config
└── README.md                    # Project documentation
```

## 🌍 Live Demo

[Nexora Live Demo](https://nexora-theta-lemon.vercel.app)

## 👨‍💻 Author

**radenmasabdul**
- GitHub: [@radenmasabdul](https://github.com/radenmasabdul)
# 
⭐ Don't forget to give a star if this project helps!
