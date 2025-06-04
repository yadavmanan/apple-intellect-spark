
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Search } from 'lucide-react';
import { SidebarInset } from "@/components/ui/sidebar";
import { ConversationControls } from './ConversationControls';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

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

interface MainContentProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  currentChatId: string;
  chatSessions: ChatSession[];
  setChatSessions: React.Dispatch<React.SetStateAction<ChatSession[]>>;
  setCurrentChatId: React.Dispatch<React.SetStateAction<string>>;
  createNewChatSession: (firstMessage: string) => string;
}

export const MainContent: React.FC<MainContentProps> = ({
  messages,
  setMessages,
  inputValue,
  setInputValue,
  isLoading,
  setIsLoading,
  currentChatId,
  createNewChatSession
}) => {
  const [conversationStyle, setConversationStyle] = useState<'creative' | 'balanced' | 'precise'>('balanced');
  const [searchType, setSearchType] = useState<'deep' | 'external' | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const mockSources: Source[] = [
    {
      id: '1',
      title: 'Apple Developer Documentation - Section 2',
      url: 'https://developer.apple.com/documentation/section2',
      snippet: 'Section 2 covers the fundamental architecture patterns and design principles for building robust iOS applications...',
      relevance: 0.95
    },
    {
      id: '2',
      title: 'iOS Human Interface Guidelines',
      url: 'https://developer.apple.com/design/human-interface-guidelines/',
      snippet: 'This section outlines the core design principles that make iOS apps intuitive and user-friendly...',
      relevance: 0.87
    },
    {
      id: '3',
      title: 'SwiftUI Framework Overview',
      url: 'https://developer.apple.com/xcode/swiftui/',
      snippet: 'SwiftUI provides a declarative Swift syntax for building user interfaces across all Apple platforms...',
      relevance: 0.82
    }
  ];

  const streamText = async (text: string, messageId: string) => {
    const words = text.split(' ');
    let currentText = '';
    
    for (let i = 0; i < words.length; i++) {
      currentText += (i > 0 ? ' ' : '') + words[i];
      
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, content: currentText, isStreaming: i < words.length - 1 }
          : msg
      ));
      
      const delay = Math.random() * 50 + 30;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, sources: mockSources, isStreaming: false }
          : msg
      ));
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Create new chat session if this is the first message
    if (messages.length === 0) {
      createNewChatSession(inputValue);
    }
    
    setInputValue('');
    setIsLoading(true);

    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantMessageId,
      type: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);

    const fullResponse = `Section 2 refers to the fundamental architecture patterns in Apple's development framework. It covers key concepts including MVC (Model-View-Controller) patterns, delegation protocols, and data flow management in iOS applications. This section is essential for understanding how to structure scalable and maintainable iOS apps that follow Apple's recommended practices.`;
    
    await streamText(fullResponse, assistantMessageId);
  };

  return (
    <SidebarInset className="flex-1">
      <ConversationControls
        conversationStyle={conversationStyle}
        setConversationStyle={setConversationStyle}
        searchType={searchType}
        setSearchType={setSearchType}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-[calc(100vh-180px)]">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="space-y-6">
              {messages.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-black rounded-3xl mx-auto mb-6 flex items-center justify-center transform rotate-3">
                    <Search className="text-white" size={32} />
                  </div>
                  <h2 className="text-2xl font-medium text-black mb-2">Welcome to Assistant</h2>
                  <p className="text-gray-600 mb-8">Ask me anything about our documentation, guidelines, and technical resources.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    {[
                      "What is Section 2 about?",
                      "Show me implementation guidelines",
                      "Security standards overview", 
                      "Latest technical updates"
                    ].map((suggestion, index) => (
                      <Card 
                        key={index}
                        className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-gray-200"
                        onClick={() => setInputValue(suggestion)}
                      >
                        <CardContent className="p-4">
                          <p className="text-gray-700 text-sm">{suggestion}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}

              {isLoading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span className="text-sm text-gray-600">Searching knowledge base...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        <ChatInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </SidebarInset>
  );
};
