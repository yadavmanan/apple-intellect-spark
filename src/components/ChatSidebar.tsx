
import React, { useState } from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { MessageSquare, History, Plus, MoreHorizontal, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

interface ChatSidebarProps {
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  currentChatId?: string;
  chatSessions: ChatSession[];
  onDeleteChat: (chatId: string) => void;
}

export const ChatSidebar = ({ onNewChat, onSelectChat, currentChatId, chatSessions, onDeleteChat }: ChatSidebarProps) => {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <Sidebar className="border-r border-gray-200 bg-white">
      <SidebarHeader className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <Button 
            onClick={onNewChat}
            className="flex-1 bg-black hover:bg-gray-800 text-white rounded-xl transition-all duration-300 hover:scale-105 mr-2"
          >
            <Plus size={16} className="mr-2" />
            New Chat
          </Button>
          <SidebarTrigger className="hover:bg-gray-100 p-2 rounded-md">
            <X size={16} />
          </SidebarTrigger>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-600 text-xs font-medium mb-4 px-2 flex items-center">
            <History size={14} className="mr-2" />
            Recent Chats
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {chatSessions.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <div
                    className={`relative p-3 pr-10 rounded-lg border transition-all duration-300 hover:shadow-md cursor-pointer group ${
                      currentChatId === chat.id 
                        ? 'bg-gray-50 border-gray-300' 
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => onSelectChat(chat.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <MessageSquare size={16} className="text-gray-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-black truncate">
                          {chat.title}
                        </h4>
                      </div>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {formatTime(chat.timestamp)}
                      </span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-2 h-auto hover:bg-gray-200 rounded-md"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <MoreHorizontal size={14} className="text-gray-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteChat(chat.id);
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Delete chat
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
