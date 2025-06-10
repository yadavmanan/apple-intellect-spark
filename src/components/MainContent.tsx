import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Search } from 'lucide-react';
import { SidebarInset } from "@/components/ui/sidebar";
import { ConversationControls } from './ConversationControls';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

interface Document {
  id: string | null;
  metadata: {
    _data_point_file_path: string;
    _data_point_fqn: string;
    _data_point_hash: string;
    _data_source_fqn: string;
    document_name: string;
    document_title: string;
    _id: string;
    _collection_name: string;
  };
  page_content: string;
  type: string;
}

interface ApiResponse {
  answer: string;
  docs: Document[];
}

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
  documents?: Document[];
  timestamp: Date;
  isStreaming?: boolean;
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

  const convertDocsToSources = (docs: Document[]): Source[] => {
    return docs.map((doc, index) => ({
      id: doc.metadata._id || `doc-${index}`,
      title: doc.metadata.document_title || doc.metadata.document_name,
      url: `#${doc.metadata.document_name}`,
      snippet: doc.page_content.substring(0, 200) + (doc.page_content.length > 200 ? '...' : ''),
      relevance: 0.9 - (index * 0.1)
    }));
  };

  const buildChatHistory = (messages: Message[]): string[] => {
    const history: string[] = ["Assistant: Hey There! How can I help you?"];
    
    messages.forEach((message) => {
      if (message.type === 'user') {
        history.push(`User: ${message.content}`);
      } else if (message.type === 'assistant') {
        history.push(`Assistant: ${message.content}`);
      }
    });
    
    return history;
  };

  const streamText = async (text: string, messageId: string, sources?: Source[], documents?: Document[]) => {
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
          ? { ...msg, sources: sources, documents: documents, isStreaming: false }
          : msg
      ));
    }, 300);
  };

  const callApi = async (query: string, chatHistory: string[]): Promise<ApiResponse> => {
    const requestBody = {
      collection_name: "cybers-collection",
      chat_history: chatHistory,
      query: query,
      model_configuration: {
        name: "truefoundry/siemens-azureopenai/gpt-4o",
        parameters: {
          temperature: 0.1,
          max_tokens: 1024
        }
      },
      prompt_template: "\nYou are a helpful AI assistant. Utilize the provided context to generate an accurate and detailed answer to the user's question.\n\n- **If the user's question explicitly requests a summary**, directly generate a concise and informative summary based on the context.\n- **If the context contains relevant information**, extract and synthesize this information to construct a comprehensive response to the user's question.\n- **If the context lacks pertinent information**, respond with: \"No information is available in the given context for the query.\"\n- **Do not fabricate answers**. Rely solely on the information present in the provided context.\n\n**Response Structure**:\n1. **Answer**: Provide a direct and clear answer to the user's question.\n2. **Supporting Information**: Include relevant details from the context that support the answer.\n\nContext:\n{context}\nQuestion: {question}\n",
      retriever_name: "contextual-compression",
      retriever_config: {
        compressor_model_name: "local-infinity/mixedbread-ai/mxbai-rerank-xsmall-v1",
        top_k: 3,
        search_type: "similarity",
        search_kwargs: {
          k: 6
        }
      },
      stream: true
    };

    console.log('Sending API request:', JSON.stringify(requestBody, null, 2));

    const response = await fetch('http://127.0.0.1:8000/retrievers/oma-rag/answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Failed to fetch response from API: ${response.status} ${response.statusText}`);
    }

    return response.json();
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
    
    if (messages.length === 0) {
      createNewChatSession(inputValue);
    }
    
    const currentQuery = inputValue;
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

    try {
      const chatHistory = buildChatHistory([...messages, userMessage]);
      const apiResponse = await callApi(currentQuery, chatHistory);
      const sources = convertDocsToSources(apiResponse.docs);
      
      setIsLoading(false);
      await streamText(apiResponse.answer, assistantMessageId, sources, apiResponse.docs);
    } catch (error) {
      console.error('Error calling API:', error);
      setIsLoading(false);
      
      const errorMessage = "I'm sorry, I encountered an error while processing your request. Please try again.";
      await streamText(errorMessage, assistantMessageId);
    }
  };

  return (
    <SidebarInset className="flex-1">
      <ConversationControls
        conversationStyle={conversationStyle}
        setConversationStyle={setConversationStyle}
        searchType={searchType}
        setSearchType={setSearchType}
      />

      <div className="flex-1 flex flex-col h-[calc(100vh-180px)]">
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
