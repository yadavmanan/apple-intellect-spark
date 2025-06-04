
import React, { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { ChatSidebar } from "@/components/ChatSidebar";
import { MainContent } from "@/components/MainContent";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  timestamp: Date;
  isStreaming?: boolean;
}

interface Source {
  id: string;
  title: string;
  url: string;
  snippet: string;
  relevance: number;
}

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string>('');
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: '1',
      title: 'What is Section 2?',
      lastMessage: 'Section 2 refers to the fundamental architecture patterns...',
      timestamp: new Date(Date.now() - 1000 * 60 * 30)
    },
    {
      id: '2', 
      title: 'iOS Development Guidelines',
      lastMessage: 'The iOS Human Interface Guidelines provide...',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2)
    },
    {
      id: '3',
      title: 'SwiftUI Best Practices',
      lastMessage: 'SwiftUI provides a declarative Swift syntax...',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24)
    },
    {
      id: '4',
      title: 'Security Standards',
      lastMessage: 'Apple\'s security framework ensures...',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48)
    }
  ]);

  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId('');
    setInputValue('');
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    setMessages([]);
  };

  const handleDeleteChat = (chatId: string) => {
    setChatSessions(prev => prev.filter(session => session.id !== chatId));
    if (currentChatId === chatId) {
      setCurrentChatId('');
      setMessages([]);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white">
        <ChatSidebar 
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          currentChatId={currentChatId}
          chatSessions={chatSessions}
          onDeleteChat={handleDeleteChat}
        />
        
        <MainContent 
          messages={messages}
          setMessages={setMessages}
          inputValue={inputValue}
          setInputValue={setInputValue}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          currentChatId={currentChatId}
          chatSessions={chatSessions}
          setChatSessions={setChatSessions}
          setCurrentChatId={setCurrentChatId}
        />
      </div>
    </SidebarProvider>
  );
};

export default Index;
