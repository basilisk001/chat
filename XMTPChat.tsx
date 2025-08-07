'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Send, MessageSquare, Users, Shield, Wallet, Loader2 } from 'lucide-react';
import { useXMTPClient } from '@/providers/XMTPProvider'; // Assuming this provides client, conversations, messages, etc.
import { useWalletConnect } from '@/hooks/useWalletConnect'; // Assuming this hook provides connection logic

// Dummy types for demonstration if actual XMTP types are not available
interface Conversation {
  id: string;
  name?: string;
  messages: ChatMessage[];
  send: (content: string) => Promise<void>;
  streamMessages: (callback: (message: ChatMessage) => void) => () => void;
}

interface ChatMessage {
  id: string;
  senderInboxId: string;
  content: string;
  timestamp: Date;
}

// Mock Dm type for demonstration
class Dm {
  id: string;
  constructor(id: string) {
    this.id = id;
  }
}

// Utility function to truncate addresses (assuming it exists or define here)
const truncateAddress = (address: string, length = 6) => {
  if (!address) return '';
  return `${address.substring(0, length)}...${address.substring(address.length - 4)}`;
};

export function XMTPChat() {
  const { client, conversations, isLoading: isLoadingConversations, disconnect, selectedConversation, setSelectedConversation, messages, isLoadingMessages, sendMessage, newMessage, setNewMessage, isSending } = useXMTPClient(); // Destructure all necessary state and functions
  const { connectWallet, isConnecting, error: walletError, success: walletSuccess } = useWalletConnect(); // Wallet connection hook

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const [peerAddress, setPeerAddress] = useState('');
  const [dmCreationError, setDmCreationError] = useState<string | null>(null);

  const createDm = async () => {
    if (!peerAddress.trim() || !client) return;
    setDmCreationError(null);
    try {
      // This part would typically interact with your XMTP client to create a new DM
      // For demonstration, we'll just log and select a mock conversation
      console.log(`Attempting to create DM with: ${peerAddress}`);
      const mockDm: Conversation = {
        id: peerAddress,
        messages: [],
        send: async (content: string) => console.log(`Mock DM send: ${content}`),
        streamMessages: (cb) => { console.log('Mock streaming messages'); return () => {}; }
      };
      setSelectedConversation(mockDm);
      setPeerAddress('');
      // In a real app, you'd add the new conversation to your `conversations` state
    } catch (error) {
      setDmCreationError("Failed to create DM. Make sure the address is valid and has XMTP enabled.");
      console.error("DM creation error:", error);
    }
  };


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Render connect wallet view if not connected
  if (!client) {
    return (
      <Card className="flex flex-col h-[600px] w-full max-w-md mx-auto items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-white shadow-xl rounded-xl">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <Wallet className="h-8 w-8 text-blue-600" />
            Connect Your Wallet
          </CardTitle>
          <CardDescription className="text-gray-600 text-base">
            To use decentralized messaging, connect your Ethereum wallet.
            Messages are encrypted and censorship-resistant.
          </CardDescription>
        </CardHeader>
        <CardContent className="w-full text-center">
          <Button
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full py-3 text-lg bg-blue-600 hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center gap-2"
          >
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="mr-2 h-5 w-5" />
                Connect Wallet
              </>
            )}
          </Button>
          
          {walletError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
              <span className="font-medium">Error:</span> {walletError}
            </div>
          )}
          
          {walletSuccess && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center gap-2">
              <span className="font-medium">Success:</span> {walletSuccess}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-[600px] w-full max-w-6xl mx-auto shadow-lg rounded-xl overflow-hidden bg-white">
      <CardHeader className="pb-4 border-b border-gray-200 bg-gray-50">
        <CardTitle className="flex items-center gap-3 text-2xl font-semibold text-gray-800">
          <Shield className="h-7 w-7 text-green-600" />
          Decentralized Chat
          <Badge variant="outline" className="ml-auto bg-green-100 text-green-800 border-green-300 px-3 py-1 text-sm font-medium">
            On-Chain
          </Badge>
          <Button
            onClick={disconnect}
            variant="outline"
            size="sm"
            className="ml-2 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
          >
            Disconnect
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex p-0">
        {/* Sidebar */}
        <div className="w-80 border-r border-gray-200 p-4 bg-gray-50 flex flex-col">
          <div className="space-y-5 flex-1">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Start New Conversation:</label>
              <div className="flex gap-2">
                <Input
                  value={peerAddress}
                  onChange={(e) => setPeerAddress(e.target.value)}
                  placeholder="0x... wallet address"
                  className="flex-1 text-sm p-2 border-gray-300 focus-visible:ring-blue-500"
                />
                <Button
                  onClick={createDm}
                  disabled={!peerAddress.trim()}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Start
                </Button>
              </div>
              {dmCreationError && (
                <p className="text-xs text-red-600 mt-1">{dmCreationError}</p>
              )}
            </div>
            
            <Button
              onClick={() => { /* Placeholder for syncConversations logic */ console.log("Syncing conversations..."); }}
              disabled={isLoadingConversations}
              variant="outline"
              className="w-full flex items-center gap-2 text-blue-600 border-blue-300 hover:bg-blue-50 transition-colors"
            >
              {isLoadingConversations ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <Users className="h-4 w-4" />
                  Refresh Conversations
                </>
              )}
            </Button>
            
            <div className="space-y-3 flex-1 overflow-hidden">
              <h3 className="text-sm font-medium text-gray-700">Conversations</h3>
              <ScrollArea className="h-full flex-1 min-h-0">
                {conversations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="h-9 w-9 mx-auto mb-3" />
                    <p className="text-sm">No conversations yet</p>
                  </div>
                ) : (
                  conversations.map((convo, index) => (
                    <Button
                      key={index}
                      variant={selectedConversation?.id === convo.id ? 'default' : 'ghost'}
                      className={`w-full justify-start text-left p-3 h-auto mb-2 rounded-lg transition-all ${
                        selectedConversation?.id === convo.id ? 'bg-blue-600 text-white hover:bg-blue-700' : 'hover:bg-gray-100 text-gray-800'
                      }`}
                      onClick={() => setSelectedConversation(convo)}
                    >
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5" />
                        <span className="truncate font-medium">
                          {convo instanceof Dm
                            ? `DM ${truncateAddress(convo.id)}`
                            : `Group ${convo.name || truncateAddress(convo.id)}`}
                        </span>
                      </div>
                    </Button>
                  ))
                )}
              </ScrollArea>
            </div>
          </div>
        </div>
        
        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedConversation ? (
            <>
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-semibold text-lg text-gray-800">
                  {selectedConversation instanceof Dm
                    ? `DM with ${truncateAddress(selectedConversation.id)}`
                    : `Group: ${selectedConversation.name || truncateAddress(selectedConversation.id)}`}
                </h3>
              </div>
              
              <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
                {isLoadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4" />
                    <p className="text-lg">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex mb-4 ${
                        message.senderInboxId === client.inboxId ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl p-3 shadow-sm text-base ${
                          message.senderInboxId === client.inboxId
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-gray-100 text-gray-900 rounded-bl-none'
                        }`}
                      >
                        <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                        <div className={`text-xs mt-1 ${message.senderInboxId === client.inboxId ? 'text-blue-200' : 'text-gray-500'}`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </ScrollArea>
              
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex gap-3">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message... decentralized and uncensorable"
                    disabled={isSending}
                    className="flex-1 text-base p-2.5 border-gray-300 focus-visible:ring-blue-500"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || isSending}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Messages are encrypted and stored on XMTP's decentralized network
                </p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center p-8">
                <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                <p className="text-xl font-medium">Select a conversation to start chatting</p>
                <p className="text-base mt-2">Or start a new DM using the wallet address of a friend.</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
