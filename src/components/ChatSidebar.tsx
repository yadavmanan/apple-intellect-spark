
import React from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter
} from "@/components/ui/sidebar";
import { Plus, MessageSquare, Trash2 } from 'lucide-react';

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: any[];
}

interface ChatSidebarProps {
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  currentChatId: string;
  chatSessions: ChatSession[];
  onDeleteChat: (chatId: string) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  onNewChat,
  onSelectChat,
  currentChatId,
  chatSessions,
  onDeleteChat
}) => {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="p-4 border-b border-gray-200">
        <Button 
          onClick={onNewChat}
          className="w-full bg-black hover:bg-gray-800 text-white"
        >
          <Plus size={16} className="mr-2" />
          New Chat
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="flex-1">
          <div className="p-2">
            <SidebarMenu>
              {chatSessions.map((session) => (
                <SidebarMenuItem key={session.id}>
                  <SidebarMenuButton
                    onClick={() => onSelectChat(session.id)}
                    className={`w-full justify-start p-3 mb-1 rounded-lg transition-colors ${
                      currentChatId === session.id 
                        ? 'bg-gray-100 border border-gray-300' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between w-full">
                      <div className="flex items-start space-x-3 flex-1 min-w-0">
                        <MessageSquare size={16} className="text-gray-500 mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {session.title}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {session.lastMessage}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDate(session.timestamp)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteChat(session.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </div>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Chat Assistant v1.0
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
