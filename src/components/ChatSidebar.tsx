
import React from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from "@/components/ui/sidebar";
import { MessageSquare, History, Plus, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

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
}

export const ChatSidebar = ({ onNewChat, onSelectChat, currentChatId }: ChatSidebarProps) => {
  // Mock chat history data
  const chatSessions: ChatSession[] = [
    {
      id: '1',
      title: 'What is Section 2?',
      lastMessage: 'Section 2 refers to the fundamental architecture patterns...',
      timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
    },
    {
      id: '2', 
      title: 'iOS Development Guidelines',
      lastMessage: 'The iOS Human Interface Guidelines provide...',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
    },
    {
      id: '3',
      title: 'SwiftUI Best Practices',
      lastMessage: 'SwiftUI provides a declarative Swift syntax...',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
    },
    {
      id: '4',
      title: 'Security Standards',
      lastMessage: 'Apple\'s security framework ensures...',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48) // 2 days ago
    }
  ];

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
        <Button 
          onClick={onNewChat}
          className="w-full bg-black hover:bg-gray-800 text-white rounded-xl transition-all duration-300 hover:scale-105"
        >
          <Plus size={16} className="mr-2" />
          New Chat
        </Button>
      </SidebarHeader>
      
      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-600 text-xs font-medium mb-2 px-2">
            <History size={14} className="mr-2" />
            Recent Chats
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chatSessions.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton
                    onClick={() => onSelectChat(chat.id)}
                    className={`w-full p-3 rounded-lg transition-all duration-300 hover:bg-gray-100 group ${
                      currentChatId === chat.id ? 'bg-gray-100' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3 w-full">
                      <MessageSquare size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-medium text-black truncate">
                            {chat.title}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {formatTime(chat.timestamp)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 truncate">
                          {chat.lastMessage}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto hover:bg-gray-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle delete
                        }}
                      >
                        <Trash2 size={12} className="text-gray-500" />
                      </Button>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
