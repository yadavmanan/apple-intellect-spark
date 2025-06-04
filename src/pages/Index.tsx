
import React, { useState, useEffect } from 'react';
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
  messages: Message[];
}

const STORAGE_KEY = 'chat_sessions';

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string>('');
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);

  // Load chat sessions from localStorage on component mount
  useEffect(() => {
    const savedSessions = localStorage.getItem(STORAGE_KEY);
    if (savedSessions) {
      try {
        const parsed = JSON.parse(savedSessions);
        // Convert timestamp strings back to Date objects
        const sessionsWithDates = parsed.map((session: any) => ({
          ...session,
          timestamp: new Date(session.timestamp),
          messages: session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        setChatSessions(sessionsWithDates);
      } catch (error) {
        console.error('Error loading chat sessions:', error);
        setChatSessions([]);
      }
    }
  }, []);

  // Save chat sessions to localStorage whenever they change
  useEffect(() => {
    if (chatSessions.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chatSessions));
    }
  }, [chatSessions]);

  // Save current chat messages when they change
  useEffect(() => {
    if (currentChatId && messages.length > 0) {
      setChatSessions(prev => prev.map(session => 
        session.id === currentChatId 
          ? { 
              ...session, 
              messages: [...messages],
              lastMessage: messages[messages.length - 1]?.content || '',
              timestamp: new Date()
            }
          : session
      ));
    }
  }, [messages, currentChatId]);

  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId('');
    setInputValue('');
  };

  const handleSelectChat = (chatId: string) => {
    const selectedSession = chatSessions.find(session => session.id === chatId);
    if (selectedSession) {
      setCurrentChatId(chatId);
      setMessages(selectedSession.messages || []);
    }
  };

  const handleDeleteChat = (chatId: string) => {
    setChatSessions(prev => {
      const updated = prev.filter(session => session.id !== chatId);
      // Update localStorage immediately
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    
    if (currentChatId === chatId) {
      setCurrentChatId('');
      setMessages([]);
    }
  };

  const createNewChatSession = (firstMessage: string) => {
    const newChatId = Date.now().toString();
    const title = firstMessage.length > 50 ? firstMessage.substring(0, 50) + '...' : firstMessage;
    
    const newChatSession: ChatSession = {
      id: newChatId,
      title,
      lastMessage: firstMessage,
      timestamp: new Date(),
      messages: []
    };
    
    setChatSessions(prev => [newChatSession, ...prev]);
    setCurrentChatId(newChatId);
    return newChatId;
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
          createNewChatSession={createNewChatSession}
        />
      </div>
    </SidebarProvider>
  );
};

export default Index;
