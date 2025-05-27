
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, ChevronDown, ExternalLink, Search, Lightbulb, Target, Database, Brain } from 'lucide-react';
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

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

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationStyle, setConversationStyle] = useState<'creative' | 'balanced' | 'precise'>('balanced');
  const [searchType, setSearchType] = useState<'deep' | 'external'>('deep');
  const [expandedSources, setExpandedSources] = useState<Set<string>>(new Set());
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-200/50 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/8960b70e-ca17-4aae-85a4-23f5e6751b1c.png" 
                alt="Apple" 
                className="h-8 w-auto"
              />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">RAG Assistant</h1>
                <p className="text-sm text-gray-500">Intelligent Knowledge Retrieval</p>
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex items-center space-x-4">
              {/* Conversation Style */}
              <div className="flex bg-gray-100 rounded-xl p-1">
                {conversationStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setConversationStyle(style.id as any)}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                      conversationStyle === style.id
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    )}
                  >
                    <style.icon size={16} />
                    <span>{style.label}</span>
                  </button>
                ))}
              </div>

              {/* Search Type */}
              <div className="flex bg-gray-100 rounded-xl p-1">
                {searchTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSearchType(type.id as any)}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                      searchType === type.id
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
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

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mx-auto mb-6 flex items-center justify-center transform rotate-3">
                <Search className="text-white" size={32} />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome to RAG Assistant</h2>
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
                    className="cursor-pointer hover:shadow-md transition-all duration-300 hover:-translate-y-1"
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
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-200"
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
                        className="border border-gray-200 hover:border-blue-300 transition-all duration-300"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="font-medium text-gray-900 text-sm">{source.title}</h4>
                                <Badge variant="secondary" className="text-xs">
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
                                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
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
              <div className="bg-white border border-gray-200 rounded-2xl px-6 py-4 shadow-sm">
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

        {/* Input Form */}
        <div className="sticky bottom-6 mt-8">
          <form onSubmit={handleSubmit} className="relative">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden backdrop-blur-sm">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything about Apple documentation..."
                className="border-0 text-base py-6 px-6 focus-visible:ring-0 focus-visible:ring-offset-0"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-all duration-300 hover:scale-105"
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
  );
};

export default Index;
