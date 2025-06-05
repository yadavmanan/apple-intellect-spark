
import React, { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from 'lucide-react';

interface ChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  inputValue,
  setInputValue,
  onSubmit,
  isLoading
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus the input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="border-t border-gray-200 bg-white sticky bottom-0 z-40">
      <div className="max-w-4xl mx-auto px-6 py-6">
        <form onSubmit={onSubmit} className="relative">
          <div className="bg-white border border-gray-300 rounded-2xl shadow-lg overflow-hidden backdrop-blur-sm">
            <Input
              ref={inputRef}
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
        </form>
      </div>
    </div>
  );
};
