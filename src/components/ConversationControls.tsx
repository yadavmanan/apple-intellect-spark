
import React from 'react';
import { Lightbulb, Target, Search, Brain, Database } from 'lucide-react';
import { cn } from "@/lib/utils";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

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
  const { state } = useSidebar();

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
    <header className="border-b border-gray-200 bg-white/95 backdrop-blur-md sticky top-0 z-50">
      <div className="w-full px-4 py-4">
        <div className="flex items-center justify-between w-full">
          {/* Left side - Logo (with slight padding) */}
          <div className="flex items-center space-x-2 flex-shrink-0 pl-2">
            {state === "collapsed" && (
              <SidebarTrigger className="hover:bg-gray-100" />
            )}
            <img 
              src="/lovable-uploads/logonew.png" 
              alt="Logo" 
              className="h-6 w-auto"
            />
          </div>
          
          {/* Right side - Controls (extreme right) */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            {/* Conversation Style */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {conversationStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setConversationStyle(style.id as any)}
                  className={cn(
                    "flex items-center space-x-1.5 px-2.5 py-2 rounded-md text-sm font-medium transition-all duration-300",
                    conversationStyle === style.id
                      ? "bg-black text-white shadow-sm"
                      : "text-gray-600 hover:text-black"
                  )}
                >
                  <style.icon size={14} />
                  <span className="hidden sm:inline">{style.label}</span>
                </button>
              ))}
            </div>

            {/* Search Type - Optional */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {searchTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSearchType(searchType === type.id ? null : type.id as any)}
                  className={cn(
                    "flex items-center space-x-1.5 px-2.5 py-2 rounded-md text-sm font-medium transition-all duration-300",
                    searchType === type.id
                      ? "bg-black text-white shadow-sm"
                      : "text-gray-600 hover:text-black"
                  )}
                >
                  <type.icon size={14} />
                  <span className="hidden sm:inline">{type.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
