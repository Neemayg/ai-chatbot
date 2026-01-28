"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bot, ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0f1419] text-white overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Bot className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">AI Chatbot</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/auth/signin">
            <Button variant="ghost" className="text-muted-foreground hover:text-white">Sign In</Button>
          </Link>
          <Link href="/auth/signup">
            <Button className="rounded-full shadow-lg shadow-primary/25">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 md:px-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium mb-8 animate-fade-in backdrop-blur-sm">
          <Sparkles className="w-4 h-4 text-yellow-500" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Experience the future of conversation
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
          Intelligent conversations, <br /> reimagined.
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
          A premium chat experience designed for seamless interaction.
          Featuring advanced AI models, intuitive history management, and a stunning interface.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link href="/chat" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full font-semibold bg-white text-black hover:bg-gray-200">
              Start Chatting
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link href="https://github.com" target="_blank" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full border-white/10 bg-white/5 hover:bg-white/10">
              View Details
            </Button>
          </Link>
        </div>

        {/* Floating Chat Interface Preview */}
        <div className="mt-20 relative w-full max-w-5xl mx-auto perspective-1000">
          <div className="relative rounded-xl border border-white/10 shadow-2xl bg-[#0f1419]/80 backdrop-blur-xl p-2 transform rotate-x-12 translate-y-10 opacity-50 scale-90 mask-image-gradient">
            <div className="h-[400px] w-full bg-black/50 rounded-lg flex items-center justify-center">
              {/* Placeholder for visual interest */}
              <div className="text-muted-foreground">App Preview</div>
            </div>
          </div>

          {/* Gradient Overlay for bottom fade */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0f1419] to-transparent z-20" />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-sm text-muted-foreground border-t border-white/5">
        <p>© 2025 AI Chatbot. Created with premium design principles.</p>
      </footer>
    </div>
  );
}
