# 3ரமழான் 2026 (ஹிஜிரி  1447)  - குர்ஆன் கேள்வி பதில் (Ramadan 2026 Hijiri 1447 Quran Quiz)

A React-based web application with Tamil language interface for the "30 Days of Quran" Ramadan program. Features Firebase Authentication with Google Sign-In and date-locked daily challenges.

## ✨ Features

- 🌙 **30 Days of Learning**: One lesson for each day of Ramadan
- 🔒 **Date-Based Locking**: Days unlock automatically based on Ramadan calendar
- 🌐 **Tamil Interface**: Complete Tamil language support
- 🔐 **Google Sign-In**: Secure authentication via Firebase
- 📱 **Responsive Design**: Works on all devices
- 🎨 **Modern UI**: Beautiful gradients and smooth animations

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Google Authentication**:
   - Navigate to: Authentication > Sign-in method
   - Enable "Google" provider
4. Get your Firebase configuration:
   - Go to: Project Settings > General > Your apps
   - Copy the configuration values

### Installation

1. Clone or download this repository

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Edit `.env` and add your Firebase credentials:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

5. Start the development server:
```bash
npm run dev
```

6. Open your browser and navigate to `http://localhost:5173`

## 📦 Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## 🗓️ Ramadan Date Configuration

The Ramadan start date is configured in `src/utils/ramadanDates.ts`:

```typescript
const RAMADAN_START_DATE = new Date('2026-02-17');
```

Update this date for different years as needed.

## 📁 Project Structure

```
RamadanQuiz/
├── src/
│   ├── config/
│   │   └── firebase.ts          # Firebase configuration
│   ├── contexts/
│   │   └── AuthContext.tsx      # Authentication context
│   ├── pages/
│   │   ├── Landing.tsx          # Landing page (Tamil)
│   │   └── Dashboard.tsx        # 30-day dashboard
│   ├── utils/
│   │   └── ramadanDates.ts      # Date calculation logic
│   ├── App.tsx                  # Main app component
│   ├── main.tsx                 # App entry point
│   └── index.css                # Global styles
├── .env.example                 # Environment template
└── index.html                   # HTML template
```

## 🎨 Technologies Used

- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Firebase** - Authentication
- **React Router** - Client-side routing
- **Lucide React** - Icon library

## 🔐 Security

- Firebase credentials should be kept in `.env` file (already in `.gitignore`)
- Never commit `.env` to version control
- Use Firebase Security Rules to protect user data

## 📝 License

This project is open source and available for personal and educational use.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---
npm run build && firebase deploy --only hosting --project tamilquranquiz

firebase deploy --only firestore:rules

Made with ❤️ for the Ramadan community
