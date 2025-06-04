
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ExternalLink } from 'lucide-react';
import { cn } from "@/lib/utils";

interface Source {
  id: string;
  title: string;
  url: string;
  snippet: string;
  relevance: number;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  timestamp: Date;
  isStreaming?: boolean;
}

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [expandedSources, setExpandedSources] = useState<Set<string>>(new Set());

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

  return (
    <div
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
        <p className="text-sm leading-relaxed">
          {message.content}
          {message.isStreaming && (
            <span className="inline-block w-2 h-4 bg-gray-400 ml-1 animate-pulse" />
          )}
        </p>
        
        {message.sources && !message.isStreaming && (
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
  );
};
