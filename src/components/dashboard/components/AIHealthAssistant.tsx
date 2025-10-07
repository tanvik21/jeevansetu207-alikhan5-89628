import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AIHealthAssistant = () => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserAndMessages = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUserId(user.id);
        
        // Fetch user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setUserName(profile.full_name);
        }
        
        // Fetch chat history
        const { data: chatHistory } = await supabase
          .from('ai_chat_messages')
          .select('role, content')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true })
          .limit(20);
        
        if (chatHistory) {
          setMessages(chatHistory as Message[]);
        }
      }
    };
    
    fetchUserAndMessages();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || !userId || isLoading) return;
    
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { message: userMessage, userId }
      });
      
      if (error) throw error;
      
      if (data?.message) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
        
        // Create AI report case file for medical queries
        if (data.createReport && data.prediction) {
          await supabase.from('ai_reports').insert({
            patient_id: userId,
            symptoms: userMessage,
            ai_prediction: data.prediction,
            confidence_score: data.confidence || 0.75,
            documents: [],
            status: 'generated'
          });
          toast.success('AI Case File created for verification');
        }
      }
    } catch (error: any) {
      console.error('AI chat error:', error);
      toast.error(error.message || 'Failed to get response from AI assistant');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-[500px] overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          {t('aiHealthAssistant')}
        </CardTitle>
        <CardDescription>
          {t('welcome')} {userName}! {t('askHealthQuestion')}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 flex flex-col gap-4 p-4">
        <ScrollArea className="flex-1 h-full pr-4">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <p>{t('startConversation')}</p>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                {message.role === 'user' && (
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="rounded-lg px-4 py-2 bg-muted">
                  <p className="text-sm">{t('thinking')}</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="flex gap-2 flex-shrink-0">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('askHealthQuestion')}
            disabled={isLoading || !userId}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading || !userId}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIHealthAssistant;
