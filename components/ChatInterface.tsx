"use client";
import { useState, useRef, useEffect } from "react";
import { signOut, User } from "firebase/auth";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import styles from "./ChatInterface.module.css";

interface Message {
  role: "user" | "model";
  text: string;
  createdAt?: any;
}

interface ChatInterfaceProps {
  user: User;
}

export default function ChatInterface({ user }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Subscribe to Firestore updates
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "users", user.uid, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = snapshot.docs.map((doc) => ({
        role: doc.data().role as "user" | "model",
        text: doc.data().text,
        createdAt: doc.data().createdAt
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [user]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const text = input;
    setInput("");
    setIsLoading(true);

    try {
      // 1. Save User Message to Firestore
      await addDoc(collection(db, "users", user.uid, "messages"), {
        role: "user",
        text: text,
        createdAt: serverTimestamp(),
      });

      // 2. Call Gemini API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();

      if (data.error) {
        // Handle API error in UI (could save error message to chat)
        console.error(data.error);
        throw new Error(data.error);
      }

      // 3. Save Bot Message to Firestore
      if (data.reply) {
        await addDoc(collection(db, "users", user.uid, "messages"), {
          role: "model",
          text: data.reply,
          createdAt: serverTimestamp(),
        });
      }

    } catch (error) {
      console.error("Error sending message:", error);
      // Optional: Add a local error message or toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.logo}>AI Chatbot</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span className={styles.userEmail}>
            {user.email || 'User'}
          </span>
          <button onClick={() => signOut(auth)} className="btn btn-ghost">
            Sign Out
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className={styles.chatArea} ref={scrollRef}>
        {messages.length === 0 && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            opacity: 0.6,
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: 700 }}>Hello!</h2>
            <p style={{ fontSize: '1.2rem' }}>I'm your AI assistant. Ask me anything.</p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={index} className={`${styles.message} ${msg.role === 'user' ? styles.messageUser : styles.messageBot}`}>
            <span className={styles.senderName}>{msg.role === 'user' ? 'You' : 'Gemini'}</span>
            <div className={`${styles.bubble} ${msg.role === 'user' ? styles.bubbleUser : styles.bubbleBot}`}>
              {msg.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className={`${styles.message} ${styles.messageBot}`}>
            <span className={styles.senderName}>Gemini</span>
            <div className={`${styles.bubble} ${styles.bubbleBot}`}>
              <span style={{ display: 'inline-block', animation: 'pulse 1.5s infinite' }}>Thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className={styles.inputArea}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="input-premium"
            disabled={isLoading}
            style={{ flex: 1 }}
          />
          <button
            onClick={handleSend}
            className="btn btn-primary"
            disabled={isLoading}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
