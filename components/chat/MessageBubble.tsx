import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';
import { Bot, User, Copy, Check } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function MessageBubble({ role, content, timestamp }: MessageBubbleProps) {
  const isUser = role === 'user';
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn(
      "flex w-full gap-4 p-4 animate-slide-up bg-transparent",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      {/* Avatar */}
      <div className={cn(
        "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full border shadow",
        isUser
          ? "bg-primary text-primary-foreground border-primary/20"
          : "bg-muted text-muted-foreground border-white/10"
      )}>
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      {/* Message Content */}
      <div className={cn(
        "flex max-w-[80%] flex-col gap-2 group",
        isUser ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "relative px-5 py-3 shadow-md",
          "text-sm leading-relaxed",
          isUser
            ? "bg-gradient-to-br from-primary to-blue-600 text-white rounded-[20px] rounded-tr-sm"
            : "glass text-foreground rounded-[20px] rounded-tl-sm border border-white/5"
        )}>
          {isUser ? (
            <p className="whitespace-pre-wrap">{content}</p>
          ) : (
            <div className="markdown-content">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          )}

          {/* Action buttons for Bot messages (Copy) */}
          {!isUser && (
            <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-white"
                onClick={copyToClipboard}
              >
                {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
              </Button>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <span className="text-[10px] text-muted-foreground opacity-70 px-1">
          {format(timestamp, 'h:mm a')}
        </span>
      </div>
    </div>
  );
}
