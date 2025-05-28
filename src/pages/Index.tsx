import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, ChevronDown, ExternalLink, Search, Lightbulb, Target, Database, Brain } from 'lucide-react';
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ChatSidebar } from "@/components/ChatSidebar";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  timestamp: Date;
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
  const [conversationStyle, setConversationStyle] = useState<'creative' | 'balanced' | 'precise'>('balanced');
  const [searchType, setSearchType] = useState<'deep' | 'external'>('deep');
  const [expandedSources, setExpandedSources] = useState<Set<string>>(new Set());
  const [currentChatId, setCurrentChatId] = useState<string>('1');
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
    
    // If this is the first message in a new chat, create a new chat session
    if (messages.length === 0) {
      const newChatId = Date.now().toString();
      const newChatSession: ChatSession = {
        id: newChatId,
        title: inputValue.length > 30 ? inputValue.substring(0, 30) + '...' : inputValue,
        lastMessage: inputValue,
        timestamp: new Date()
      };
      setChatSessions(prev => [newChatSession, ...prev]);
      setCurrentChatId(newChatId);
    }
    
    setInputValue('');
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `Section 2 refers to the fundamental architecture patterns in Apple's development framework. It covers key concepts including MVC (Model-View-Controller) patterns, delegation protocols, and data flow management in iOS applications. This section is essential for understanding how to structure scalable and maintainable iOS apps that follow Apple's recommended practices.`,
        sources: mockSources,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const toggleSourceExpansion = (sourceId: string) => {
    setExpandedSources(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sourceId)) {
        newSet.delete(sourceId);
      } else {
        newSet.add(sourceId);
      }
      return newSet;
    });
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId('');
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    // In a real app, you'd load the messages for this chat
    setMessages([]);
  };

  const handleDeleteChat = (chatId: string) => {
    setChatSessions(prev => prev.filter(session => session.id !== chatId));
    if (currentChatId === chatId) {
      setCurrentChatId('');
      setMessages([]);
    }
  };

  const conversationStyles = [
    { id: 'creative', label: 'Creative', icon: Lightbulb, description: 'Imaginative responses' },
    { id: 'balanced', label: 'Balanced', icon: Target, description: 'Balanced approach' },
    { id: 'precise', label: 'Precise', icon: Search, description: 'Fact-focused answers' }
  ];

  const searchTypes = [
    { id: 'deep', label: 'Deep Research', icon: Brain, description: 'In-depth analysis' },
    { id: 'external', label: 'External Database', icon: Database, description: 'Curated sources' }
  ];

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
        
        <SidebarInset className="flex-1">
          {/* Header */}
          <header className="border-b border-gray-200 bg-white/95 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-4xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <SidebarTrigger className="hover:bg-gray-100 md:hidden" />
                  <img 
                    src="/lovable-uploads/logonew.png" 
                    alt="Logo" 
                    className="h-8 w-auto"
                  />
                </div>
                
                {/* Controls */}
                <div className="flex items-center space-x-4">
                  {/* Conversation Style */}
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    {conversationStyles.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setConversationStyle(style.id as any)}
                        className={cn(
                          "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300",
                          conversationStyle === style.id
                            ? "bg-black text-white shadow-sm"
                            : "text-gray-600 hover:text-black"
                        )}
                      >
                        <style.icon size={16} />
                        <span>{style.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Search Type */}
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    {searchTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setSearchType(type.id as any)}
                        className={cn(
                          "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300",
                          searchType === type.id
                            ? "bg-black text-white shadow-sm"
                            : "text-gray-600 hover:text-black"
                        )}
                      >
                        <type.icon size={16} />
                        <span>{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col h-[calc(100vh-100px)]">
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
                    <div
                      key={message.id}
                      className={cn(
                        "flex animate-fade-in",
                        message.type === 'user' ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-3xl rounded-2xl px-6 py-4 shadow-sm",
                          message.type === 'user'
                            ? "bg-black text-white"
                            : "bg-gray-50 border border-gray-200"
                        )}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        
                        {message.sources && (
                          <div className="mt-4 space-y-3">
                            <div className="flex items-center space-x-2 text-gray-600">
                              <ExternalLink size={16} />
                              <span className="text-sm font-medium">Sources ({message.sources.length})</span>
                            </div>
                            
                            {message.sources.map((source) => (
                              <Card 
                                key={source.id}
                                className="border border-gray-200 hover:border-gray-400 transition-all duration-300"
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2 mb-2">
                                        <h4 className="font-medium text-black text-sm">{source.title}</h4>
                                        <Badge variant="secondary" className="text-xs bg-gray-200 text-gray-700">
                                          {Math.round(source.relevance * 100)}% match
                                        </Badge>
                                      </div>
                                      
                                      <p className="text-sm text-gray-600 mb-3">{source.snippet}</p>
                                      
                                      {expandedSources.has(source.id) && (
                                        <div className="animate-fade-in border-t pt-3 mt-3">
                                          <p className="text-sm text-gray-700 mb-3">
                                            This source provides comprehensive documentation about the architectural patterns 
                                            and implementation guidelines. It includes code examples, best practices, and 
                                            detailed explanations of the concepts mentioned in your query.
                                          </p>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-black border-gray-300 hover:bg-gray-100"
                                            onClick={() => window.open(source.url, '_blank')}
                                          >
                                            <ExternalLink size={14} className="mr-2" />
                                            View Full Document
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                    
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => toggleSourceExpansion(source.id)}
                                      className="ml-2 text-gray-400 hover:text-gray-600"
                                    >
                                      <ChevronDown 
                                        size={16} 
                                        className={cn(
                                          "transition-transform duration-300",
                                          expandedSources.has(source.id) && "rotate-180"
                                        )}
                                      />
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
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

            {/* Fixed Input Form */}
            <div className="border-t border-gray-200 bg-white">
              <div className="max-w-4xl mx-auto px-6 py-6">
                <form onSubmit={handleSubmit} className="relative">
                  <div className="bg-white border border-gray-300 rounded-2xl shadow-lg overflow-hidden backdrop-blur-sm">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask me anything about documentation..."
                      className="border-0 text-base py-6 px-6 focus-visible:ring-0 focus-visible:ring-offset-0"
                      disabled={isLoading}
                    />
                    <Button
                      type="submit"
                      disabled={!inputValue.trim() || isLoading}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black hover:bg-gray-800 text-white rounded-xl shadow-sm transition-all duration-300 hover:scale-105"
                      size="sm"
                    >
                      <Send size={16} />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-center mt-3 space-x-4 text-xs text-gray-500">
                    <span>Mode: {conversationStyle}</span>
                    <span>•</span>
                    <span>Search: {searchType === 'deep' ? 'Deep Research' : 'External Database'}</span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
