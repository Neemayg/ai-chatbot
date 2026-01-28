"use client";

import { useEffect, useRef } from "react";
import { useChatStore, Message } from "@/lib/store";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { ChatInput } from "@/components/chat/ChatInput";
import { Button } from "@/components/ui/button";
import { MoreVertical, Share, Download, Menu } from "lucide-react";

export default function ChatPage() {
  const {
    currentChatId,
    chats,
    addMessage,
    setLoading,
    isLoading,
    createChat,
    setSidebarOpen,
    sidebarOpen
  } = useChatStore();

  const bottomRef = useRef<HTMLDivElement>(null);

  // Get current chat
  const currentChat = chats.find(c => c.id === currentChatId);

  useEffect(() => {
    // If no chat selected, create one
    if (!currentChatId && chats.length === 0) {
      createChat();
    }
  }, [currentChatId, chats, createChat]);

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat?.messages]);

  const handleSendMessage = async (content: string) => {
    if (!currentChatId) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    addMessage(currentChatId, userMsg);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content }),
      });

      const data = await response.json();

      if (response.ok) {
        const botMsg: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.reply,
          timestamp: new Date()
        };
        addMessage(currentChatId, botMsg);
      } else {
        // Handle error cleanly
        const errorMsg: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: "I'm sorry, I encountered an issue while processing your request.",
          timestamp: new Date()
        };
        addMessage(currentChatId, errorMsg);
      }
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "I'm having trouble connecting to the server right now.",
        timestamp: new Date()
      };
      addMessage(currentChatId, errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!currentChat) return (
    <div className="flex items-center justify-center h-full text-muted-foreground">
      Loading...
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full bg-background relative z-0">

      {/* Top Header Bar */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#0f1419]/50 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-2">
          {!sidebarOpen && (
            <div className="w-8" /> /* Spacer for toggle button */
          )}
          <div className="flex flex-col">
            <span className="font-semibold text-sm">{currentChat.title}</span>
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Online
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <Share className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
        {currentChat.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center shadow-2xl shadow-primary/20 mb-4">
              <BotIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold">How can I help you today?</h2>
            <p className="text-muted-foreground max-w-md">
              I'm a premium AI assistant capable of sophisticated conversation, writing code, and answering complex queries.
            </p>
            <div className="grid grid-cols-2 gap-2 max-w-lg w-full mt-8">
              {["Summarize this article", "Write a python script", "Plan a trip to Japan", "Explain quantum physics"].map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  className="h-auto py-3 px-4 text-xs justify-start border-white/5 bg-white/5 hover:bg-white/10 hover:border-primary/50 transition-all text-left"
                  onClick={() => handleSendMessage(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          currentChat.messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              role={msg.role}
              content={msg.content}
              timestamp={msg.timestamp}
            />
          ))
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 p-4 animate-slide-up">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center border border-white/10">
              <BotIcon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex gap-1 items-center bg-white/5 px-4 py-3 rounded-2xl rounded-tl-sm">
              <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce"></span>
            </div>
          </div>
        )}

        <div ref={bottomRef} className="h-4" />
      </div>

      {/* Input Area */}
      <div className="w-full bg-gradient-to-t from-[#0f1419] via-[#0f1419] to-transparent pt-10 pb-4 px-4 sticky bottom-0 z-10">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}

function BotIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  )
}
