"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, Paperclip, Mic, Smile, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [content]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!content.trim() || isLoading) return;
    onSendMessage(content);
    setContent("");
    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-6 pt-2 z-10">
      <div className="relative flex items-end gap-2 bg-[#1e2330]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl ring-offset-background focus-within:ring-2 focus-within:ring-primary/50 transition-all duration-300">

        {/* Left Actions */}
        <div className="flex pb-2 pl-2 gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white rounded-lg">
            <Paperclip className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white rounded-lg">
            <Smile className="w-4 h-4" />
          </Button>
        </div>

        {/* Input Area */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message AI Chatbot..."
          className="flex-1 max-h-[150px] min-h-[24px] bg-transparent border-0 resize-none p-3 focus:outline-none text-sm placeholder:text-muted-foreground/60 scrollbar-hide text-foreground"
          rows={1}
        />

        {/* Right Actions */}
        <div className="pb-2 pr-2">
          {content || isLoading ? (
            <Button
              size="icon"
              className={cn(
                "h-8 w-8 rounded-lg transition-all duration-300",
                content ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}
              onClick={handleSend}
              disabled={!content.trim() || isLoading}
            >
              <Send className="w-4 h-4" />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white rounded-lg">
              <Mic className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Character Counter (optional, requested in prompt) */}
        {content.length > 500 && (
          <div className="absolute -top-6 right-2 text-xs text-muted-foreground">
            {content.length} / 2000
          </div>
        )}
      </div>
      <div className="text-center mt-2">
        <p className="text-[10px] text-muted-foreground/40">
          AI can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
}
