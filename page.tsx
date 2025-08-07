'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AIChat } from '@/components/AIChat';
import { XMTPChat } from '@/components/XMTPChat';
import { XMTPProvider } from '@/providers/XMTPProvider';
import { 
  Zap, 
  Shield, 
  MessageSquare, 
  Globe, 
  Lock, 
  Sparkles,
  Brain,
  Users,
  ArrowRight,
  Star,
  ChevronLeft
} from 'lucide-react';

export default function Page() {
  const [selectedMode, setSelectedMode] = useState<string>('welcome');

  if (selectedMode === 'welcome') {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white flex flex-col justify-center items-center py-16 px-4">
        {/* Hero Section */}
        <div className="container mx-auto max-w-7xl text-center mb-16">
          <div className="flex items-center justify-center mb-8 relative">
            <Sparkles className="h-20 w-20 text-yellow-400 animate-pulse-slow z-10" />
            <Shield className="h-10 w-10 text-green-400 absolute top-0 right-1/2 translate-x-1/2 -mt-4 mr-16 z-20" /> {/* Adjusted position */}
          </div>
          
          <h1 className="text-7xl md:text-8xl font-extrabold mb-8 leading-tight bg-gradient-to-r from-white via-blue-200 to-blue-300 bg-clip-text text-transparent drop-shadow-lg">
            Truly Uninhibited
            <br />
            <span className="text-yellow-400">Free Speech AI</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed font-light">
            Experience unrestricted dialogue with AI that believes in open expression. 
            Plus, communicate through censorship-resistant decentralized messaging. 
            <span className="font-semibold text-white">No limits. No restrictions.</span> Just pure, authentic conversation.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-16">
            <Badge className="bg-yellow-500 text-gray-900 hover:bg-yellow-400 px-5 py-2.5 text-base font-semibold rounded-full shadow-lg">
              <Star className="h-5 w-5 mr-2" />
              Uncensored AI
            </Badge>
            <Badge className="bg-green-500 text-gray-900 hover:bg-green-400 px-5 py-2.5 text-base font-semibold rounded-full shadow-lg">
              <Shield className="h-5 w-5 mr-2" />
              Decentralized
            </Badge>
            <Badge className="bg-blue-500 text-white hover:bg-blue-400 px-5 py-2.5 text-base font-semibold rounded-full shadow-lg">
              <Globe className="h-5 w-5 mr-2" />
              Censorship Resistant
            </Badge>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="container mx-auto max-w-7xl grid md:grid-cols-2 gap-10 mb-20">
          <Card className="bg-gray-800/60 border-gray-700 hover:bg-gray-800/80 transition-all duration-300 group cursor-pointer transform hover:-translate-y-2 shadow-xl hover:shadow-2xl rounded-2xl"
              onClick={() => setSelectedMode('ai-chat')}>
            <CardHeader className="text-center pt-8 pb-4">
              <div className="flex justify-center mb-5">
                <div className="p-5 bg-yellow-500/20 rounded-full group-hover:bg-yellow-500/30 transition-colors">
                  <Brain className="h-14 w-14 text-yellow-400" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-white mb-3 flex items-center justify-center gap-3">
                AI Free Speech Chat
                <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-200" />
              </CardTitle>
              <CardDescription className="text-gray-300 text-base max-w-md mx-auto leading-relaxed">
                Chat with an AI that believes in unrestricted dialogue and authentic responses.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 px-6 pb-8">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-300 text-base">
                  <Zap className="h-6 w-6 text-yellow-400" />
                  <span>No content restrictions or excessive warnings</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300 text-base">
                  <MessageSquare className="h-6 w-6 text-blue-400" />
                  <span>Honest, direct responses to any question</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300 text-base">
                  <Star className="h-6 w-6 text-green-400" />
                  <span>Powered by Perplexity AI with citations</span>
                </div>
              </div>
              <div className="pt-6 text-center">
                <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 px-4 py-1.5 text-sm font-semibold rounded-full">
                  Uncensored & Authentic
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/60 border-gray-700 hover:bg-gray-800/80 transition-all duration-300 group cursor-pointer transform hover:-translate-y-2 shadow-xl hover:shadow-2xl rounded-2xl"
              onClick={() => setSelectedMode('xmtp-chat')}>
            <CardHeader className="text-center pt-8 pb-4">
              <div className="flex justify-center mb-5">
                <div className="p-5 bg-green-500/20 rounded-full group-hover:bg-green-500/30 transition-colors">
                  <Shield className="h-14 w-14 text-green-400" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-white mb-3 flex items-center justify-center gap-3">
                Decentralized Messaging
                <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-200" />
              </CardTitle>
              <CardDescription className="text-gray-300 text-base max-w-md mx-auto leading-relaxed">
                Truly censorship-resistant messaging powered by XMTP protocol.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 px-6 pb-8">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-300 text-base">
                  <Lock className="h-6 w-6 text-green-400" />
                  <span>End-to-end encrypted conversations</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300 text-base">
                  <Globe className="h-6 w-6 text-blue-400" />
                  <span>Decentralized network storage</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300 text-base">
                  <Users className="h-6 w-6 text-purple-400" />
                  <span>Wallet-to-wallet communication</span>
                </div>
              </div>
              <div className="pt-6 text-center">
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-4 py-1.5 text-sm font-semibold rounded-full">
                  Censorship Resistant & Private
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Philosophy Section */}
        <Card className="container mx-auto max-w-5xl bg-gray-800/40 border-gray-700 shadow-xl rounded-2xl p-8">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-4xl font-bold text-white mb-4">Our Philosophy</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">
              We believe in the fundamental right to <span className="text-white font-semibold">free expression</span> and open dialogue. 
              In a world of increasing censorship and content restrictions, we provide 
              platforms for truly uninhibited conversation—whether with AI that doesn't 
              judge or censor, or through decentralized networks that can't be controlled 
              by any single authority.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Badge variant="outline" className="text-white border-gray-600 px-5 py-2 text-base font-medium rounded-full">
                🗣️ Free Speech
              </Badge>
              <Badge variant="outline" className="text-white border-gray-600 px-5 py-2 text-base font-medium rounded-full">
                🌐 Decentralization
              </Badge>
              <Badge variant="outline" className="text-white border-gray-600 px-5 py-2 text-base font-medium rounded-full">
                🔐 Privacy
              </Badge>
              <Badge variant="outline" className="text-white border-gray-600 px-5 py-2 text-base font-medium rounded-full">
                ⚡ Uncensored
              </Badge>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <XMTPProvider>
      <main className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedMode('welcome')}
              className="mb-6 text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors flex items-center gap-1.5"
            >
              <ChevronLeft className="h-5 w-5" /> Back to Home
            </Button>
            
            <Tabs value={selectedMode} onValueChange={setSelectedMode} className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-gray-200 rounded-lg p-1.5 shadow-inner">
                <TabsTrigger 
                  value="ai-chat" 
                  className="flex items-center gap-2 py-2.5 text-base font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm data-[state=active]:rounded-md transition-all duration-200"
                >
                  <Brain className="h-5 w-5" />
                  AI Chat
                </TabsTrigger>
                <TabsTrigger 
                  value="xmtp-chat" 
                  className="flex items-center gap-2 py-2.5 text-base font-medium data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-sm data-[state=active]:rounded-md transition-all duration-200"
                >
                  <Shield className="h-5 w-5" />
                  XMTP Chat
                </TabsTrigger>
              </TabsList>
              
              <div className="mt-10">
                <TabsContent value="ai-chat" className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-4xl font-extrabold text-gray-800 mb-3">Free Speech AI Chat</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                      Engage in unrestricted dialogue with an AI that believes in open expression.
                    </p>
                  </div>
                  <AIChat />
                </TabsContent>
                
                <TabsContent value="xmtp-chat" className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-4xl font-extrabold text-gray-800 mb-3">Decentralized Messaging</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                      Connect your wallet for censorship-resistant, encrypted messaging.
                    </p>
                  </div>
                  <XMTPChat />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </main>
    </XMTPProvider>
  );
}
