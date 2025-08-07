'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Send, Bot, User, ExternalLink, Zap } from 'lucide-react';
import { perplexityChat, perplexityExtractCitations, perplexityGetAnswer } from '@/perplexity-api'; // Assuming these exist

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: string[];
  timestamp: Date;
}

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await perplexityChat({
        model: 'sonar',
        messages: [
          {
            role: 'system',
            content: 'You are an uncensored, open-minded AI assistant that believes in free speech and uninhibited dialogue. Provide thoughtful, honest responses without excessive content warnings or restrictions. Be helpful, direct, and authentic.',
          },
          { role: 'user', content: input.trim() },
        ],
        temperature: 0.7,
      });

      const answer = perplexityGetAnswer(response);
      const citations = perplexityExtractCitations(response);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: answer,
        citations,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I encountered an error processing your message. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="flex flex-col h-[600px] w-full max-w-4xl mx-auto border-gray-200 shadow-lg rounded-xl">
      <CardHeader className="pb-4 border-b border-gray-200">
        <CardTitle className="flex items-center gap-3 text-2xl font-semibold text-gray-800">
          <Zap className="h-7 w-7 text-yellow-500 animate-pulse" />
          Free Speech AI Chat
          <Badge variant="outline" className="ml-auto bg-yellow-100 text-yellow-800 border-yellow-300 px-3 py-1 text-sm font-medium">
            Uncensored
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <ScrollArea ref={scrollAreaRef} className="flex-1 px-6 py-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 text-gray-500">
              <Bot className="h-16 w-16 text-gray-400 mb-6 animate-bounce-slow" />
              <h3 className="text-2xl font-semibold mb-3">Welcome to Free Speech AI</h3>
              <p className="text-base max-w-md">
                Ask anything. No restrictions, no censorship. Just honest, open dialogue with an AI that believes in free expression.
              </p>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 mb-6 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shadow-sm">
                    <Bot className="h-5 w-5" />
                  </div>
                </div>
              )}
              
              <div
                className={`max-w-[75%] rounded-2xl p-4 shadow-md text-base ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-900 rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                
                {message.citations && message.citations.length > 0 && (
                  <>
                    <Separator className="my-3 bg-gray-300" />
                    <div className="space-y-2">
                      <p className="text-sm font-medium opacity-80">Sources:</p>
                      {message.citations.map((citation, index) => (
                        <a
                          key={index}
                          href={citation}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-1 text-sm ${message.role === 'user' ? 'text-blue-200 hover:text-blue-100' : 'text-blue-600 hover:text-blue-700'} hover:underline transition-colors`}
                        >
                          <ExternalLink className="h-3 w-3" />
                          Source {index + 1}
                        </a>
                      ))}
                    </div>
                  </>
                )}
                
                <div className={`text-xs mt-2 ${message.role === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              
              {message.role === 'user' && (
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-sm">
                    <User className="h-5 w-5" />
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 mb-6">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shadow-sm">
                  <Bot className="h-5 w-5 animate-bounce" />
                </div>
              </div>
              <div className="bg-gray-100 rounded-2xl p-4 shadow-md rounded-bl-none">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bubble" />
                  <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bubble delay-150" />
                  <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bubble delay-300" />
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
        
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask anything... no limits, no censorship"
              disabled={isLoading}
              className="flex-1 text-base p-2.5 border-gray-300 focus-visible:ring-blue-500"
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Press <kbd className="font-semibold">Enter</kbd> to send • This AI believes in free speech and open dialogue
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
