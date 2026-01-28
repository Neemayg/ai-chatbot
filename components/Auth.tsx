"use client";
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import styles from './Auth.module.css';

export default function Auth() {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
      alert("Login failed. Check console for details. Ensure Google Auth is enabled in Firebase Console.");
    }
  };

  return (
    <div className={`${styles.container} animate-fade-in`}>
      <div className="glass-card" style={{ maxWidth: '420px', width: '90%', textAlign: 'center' }}>
        <h1 className={styles.title}>AI Chatbot</h1>
        <p className={styles.subtitle}>
          Unlock the power of Gemini 1.5 Flash. <br />
          Sign in to begin your conversation.
        </p>
        <button onClick={handleLogin} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
