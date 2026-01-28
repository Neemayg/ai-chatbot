# AI Chatbot

A premium AI chatbot built with Next.js, Firebase Auth, and Gemini API.

## 🚀 Getting Started

### 1. Prerequisites
- Node.js installed.
- A Firebase project.
- A Google Cloud/Gemini API key.

### 2. Environment Setup
Rename `.env.local` (or create it) and fill in your keys:

```bash
# Firebase Configuration (Get these from Project Settings > General > Your Apps in Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Gemini API Key (Get this from Google AI Studio)
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Create a new project.
3. Enable **Authentication**:
   - Go to Build > Authentication > Sign-in method.
   - Enable **Google**.
4. Enable **Firestore Database**:
   - Go to Build > Firestore Database.
   - Create database (Start in production mode or test mode).
   - *Note: If in production mode, make sure to update rules to allow read/write for authenticated users.*

### 4. Run Locally
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### 5. Deploy to Vercel
1. Push this code to GitHub.
2. Go to [Vercel](https://vercel.com).
3. Import the project.
4. Add the **Environment Variables** (from step 2) in the Vercel dashboard.
5. Deploy!
