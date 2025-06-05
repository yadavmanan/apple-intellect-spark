
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ExternalLink, FileText, Calendar, Hash, Database } from 'lucide-react';
import { cn } from "@/lib/utils";

interface Source {
  id: string;
  title: string;
  url: string;
  snippet: string;
  relevance: number;
}

interface DocumentMetadata {
  _data_point_file_path?: string;
  _data_point_fqn?: string;
  _data_point_hash?: string;
  _data_source_fqn?: string;
  document_name?: string;
  document_title?: string;
  _id?: string;
  _collection_name?: string;
  chunk_index?: number;
  file_name?: string;
  heading?: string;
}

interface Document {
  id: string | null;
  metadata: DocumentMetadata;
  page_content: string;
  type: string;
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

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [expandedSources, setExpandedSources] = useState<Set<string>>(new Set());
  const [expandedDocuments, setExpandedDocuments] = useState<Set<string>>(new Set());

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

  const toggleDocumentExpansion = (docId: string) => {
    setExpandedDocuments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(docId)) {
        newSet.delete(docId);
      } else {
        newSet.add(docId);
      }
      return newSet;
    });
  };

  const formatDate = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleDateString();
    } catch {
      return timestamp;
    }
  };

  const truncateContent = (content: string, maxLength: number = 200) => {
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
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
          "max-w-4xl rounded-2xl px-6 py-4 shadow-sm",
          message.type === 'user'
            ? "bg-black text-white"
            : "bg-gray-50 border border-gray-200"
        )}
      >
        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
          {message.isStreaming && (
            <span className="inline-block w-2 h-4 bg-gray-400 ml-1 animate-pulse" />
          )}
        </div>
        
        {/* Legacy Sources Display */}
        {message.sources && !message.isStreaming && (
          <div className="mt-6 space-y-3">
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

        {/* Enhanced Documents Display */}
        {message.documents && !message.isStreaming && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <Database size={16} />
              <span className="text-sm font-medium">Supporting Documents ({message.documents.length})</span>
            </div>
            
            {message.documents.map((doc) => {
              const docId = doc.metadata._id || doc.id || `doc-${Math.random()}`;
              const isExpanded = expandedDocuments.has(docId);
              
              return (
                <Card 
                  key={docId}
                  className="border border-gray-200 hover:border-gray-300 transition-all duration-300"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <FileText size={16} className="text-blue-600" />
                          <h4 className="font-semibold text-black text-sm">
                            {doc.metadata.document_title || doc.metadata.document_name || doc.metadata.file_name || 'Unknown Document'}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {doc.type}
                          </Badge>
                        </div>
                        
                        {doc.metadata.heading && (
                          <div className="flex items-center space-x-1 mb-2">
                            <Hash size={12} className="text-gray-500" />
                            <span className="text-xs text-gray-600 font-medium">{doc.metadata.heading}</span>
                          </div>
                        )}
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {doc.metadata.document_name && (
                            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                              {doc.metadata.document_name}
                            </Badge>
                          )}
                          {doc.metadata._collection_name && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                              {doc.metadata._collection_name}
                            </Badge>
                          )}
                          {doc.metadata.chunk_index !== undefined && (
                            <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                              Chunk {doc.metadata.chunk_index}
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {truncateContent(doc.page_content, isExpanded ? 1000 : 200)}
                        </p>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleDocumentExpansion(docId)}
                        className="ml-2 text-gray-400 hover:text-gray-600"
                      >
                        <ChevronDown 
                          size={16} 
                          className={cn(
                            "transition-transform duration-300",
                            isExpanded && "rotate-180"
                          )}
                        />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  {isExpanded && (
                    <CardContent className="pt-0 animate-fade-in">
                      <div className="border-t pt-4 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          {doc.metadata._data_point_hash && (
                            <div className="flex items-center space-x-2">
                              <Calendar size={12} className="text-gray-500" />
                              <span className="text-gray-600">
                                Last Modified: {formatDate(doc.metadata._data_point_hash.split(':')[1])}
                              </span>
                            </div>
                          )}
                          {doc.metadata._data_source_fqn && (
                            <div className="flex items-center space-x-2">
                              <Database size={12} className="text-gray-500" />
                              <span className="text-gray-600 truncate">
                                Source: {doc.metadata._data_source_fqn.split('::').pop()}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {doc.page_content.length > 200 && (
                          <div className="bg-gray-50 p-3 rounded-lg mt-3">
                            <h5 className="text-xs font-medium text-gray-700 mb-2">Full Content:</h5>
                            <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">
                              {doc.page_content}
                            </p>
                          </div>
                        )}
                        
                        {doc.metadata._data_point_file_path && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-xs text-gray-500">
                              File Path: {doc.metadata._data_point_file_path.split('\\').pop()}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
