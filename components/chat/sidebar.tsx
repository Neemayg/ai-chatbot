"use client";

import { cn } from "@/lib/utils";
import { useChatStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Plus,
  MessageSquare,
  Settings,
  LogOut,
  Moon,
  Sun,
  Search,
  MoreHorizontal,
  Pin,
  Trash2,
  Pencil
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

export function Sidebar() {
  const {
    chats,
    currentChatId,
    setCurrentChat,
    createChat,
    deleteChat,
    togglePinChat,
    setSidebarOpen,
    sidebarOpen
  } = useChatStore();

  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedChats = filteredChats.filter(c => c.pinned);
  const recentChats = filteredChats.filter(c => !c.pinned);

  return (
    <div className={cn(
      "flex flex-col h-full bg-[#0f1419]/95 backdrop-blur-xl border-r border-white/10 transition-all duration-300 ease-in-out z-20",
      sidebarOpen ? "w-[280px]" : "w-0 -ml-[280px] opacity-0"
    )}>
      {/* Header */}
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between px-2">
          <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            AI Chatbot
          </span>
          {/* Mobile close or other actions could go here */}
        </div>

        <Button
          className="w-full justify-start gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
          size="lg"
          onClick={() => createChat()}
        >
          <Plus className="w-5 h-5" />
          New Chat
        </Button>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            className="w-full bg-[#1e2330] rounded-lg pl-9 pr-4 py-2 text-sm text-foreground border border-white/5 focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted-foreground/50 transition-all"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-6 scrollbar-hide py-2">
        {pinnedChats.length > 0 && (
          <div className="space-y-1">
            <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Pinned
            </h3>
            {pinnedChats.map(chat => (
              <ChatItem
                key={chat.id}
                chat={chat}
                isActive={chat.id === currentChatId}
                onClick={() => setCurrentChat(chat.id)}
                onPin={() => togglePinChat(chat.id)}
                onDelete={() => deleteChat(chat.id)}
              />
            ))}
          </div>
        )}

        <div className="space-y-1">
          <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Recent
          </h3>
          {recentChats.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground/50 italic">
              No conversations yet.
            </div>
          ) : (
            recentChats.map(chat => (
              <ChatItem
                key={chat.id}
                chat={chat}
                isActive={chat.id === currentChatId}
                onClick={() => setCurrentChat(chat.id)}
                onPin={() => togglePinChat(chat.id)}
                onDelete={() => deleteChat(chat.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 bg-black/20">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
            N
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">Neemay</p>
            <p className="text-xs text-muted-foreground truncate">Free Plan</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function ChatItem({ chat, isActive, onClick, onPin, onDelete }: any) {
  return (
    <div
      className={cn(
        "group relative flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-all duration-200 border border-transparent",
        isActive
          ? "bg-primary/10 border-primary/20 text-primary"
          : "hover:bg-white/5 text-muted-foreground hover:text-foreground"
      )}
      onClick={onClick}
    >
      <MessageSquare className={cn("w-4 h-4 shrink-0", isActive && "fill-primary/20")} />
      <div className="flex-1 overflow-hidden">
        <p className="text-sm font-medium truncate leading-none mb-1">{chat.title}</p>
        <p className="text-[10px] opacity-60 truncate">
          {formatDistanceToNow(new Date(chat.updatedAt), { addSuffix: true })}
        </p>
      </div>

      {/* Hover Actions */}
      <div className={cn(
        "absolute right-2 flex items-center bg-[#0f1419] shadow-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200",
        isActive && "bg-background"
      )}>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 hover:text-primary"
          onClick={(e) => { e.stopPropagation(); onPin(); }}
        >
          <Pin className={cn("w-3 h-3", chat.pinned && "fill-current")} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 hover:text-destructive"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  )
}
