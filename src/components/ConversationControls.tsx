
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Brain, Zap, Target, Globe, Database } from 'lucide-react';

interface ConversationControlsProps {
  conversationStyle: 'creative' | 'balanced' | 'precise';
  setConversationStyle: (style: 'creative' | 'balanced' | 'precise') => void;
  searchType: 'deep' | 'external' | null;
  setSearchType: (type: 'deep' | 'external' | null) => void;
}

export const ConversationControls: React.FC<ConversationControlsProps> = ({
  conversationStyle,
  setConversationStyle,
  searchType,
  setSearchType
}) => {
  const styleOptions = [
    { 
      value: 'creative' as const, 
      label: 'Creative', 
      icon: Brain,
      description: 'More imaginative responses'
    },
    { 
      value: 'balanced' as const, 
      label: 'Balanced', 
      icon: Zap,
      description: 'Balanced approach'
    },
    { 
      value: 'precise' as const, 
      label: 'Precise', 
      icon: Target,
      description: 'Focused and accurate'
    }
  ];

  const searchOptions = [
    { 
      value: 'deep' as const, 
      label: 'Deep Search', 
      icon: Database,
      description: 'Search internal knowledge base'
    },
    { 
      value: 'external' as const, 
      label: 'External Search', 
      icon: Globe,
      description: 'Include external sources'
    }
  ];

  return (
    <div className="border-b border-gray-200 bg-white sticky top-0 z-30">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          {/* Conversation Style */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Style:</span>
            <div className="flex space-x-2">
              {styleOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Button
                    key={option.value}
                    variant={conversationStyle === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setConversationStyle(option.value)}
                    className={`transition-all duration-200 ${
                      conversationStyle === option.value 
                        ? 'bg-black text-white hover:bg-gray-800' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={14} className="mr-1" />
                    {option.label}
                  </Button>
                );
              })}
            </div>
          </div>

          <Separator orientation="vertical" className="hidden sm:block h-6" />

          {/* Search Type */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Search:</span>
            <div className="flex space-x-2">
              {searchOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Button
                    key={option.value}
                    variant={searchType === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSearchType(searchType === option.value ? null : option.value)}
                    className={`transition-all duration-200 ${
                      searchType === option.value 
                        ? 'bg-black text-white hover:bg-gray-800' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={14} className="mr-1" />
                    {option.label}
                  </Button>
                );
              })}
            </div>
            {searchType && (
              <Badge variant="secondary" className="ml-2">
                {searchOptions.find(opt => opt.value === searchType)?.description}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
