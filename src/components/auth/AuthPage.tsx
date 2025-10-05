
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from './LoginForm';
import { UserRole } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Stethoscope, User, BookOpen } from 'lucide-react';

const AuthPage: React.FC = () => {
  const { t } = useLanguage();
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  
  return (
    <div className="w-full max-w-md">
      <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-0 shadow-2xl rounded-3xl overflow-hidden transition-colors">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 text-center py-8">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t('welcome')}
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-300 text-base">
            {t('chooseRole')}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <Tabs defaultValue="patient" onValueChange={(value) => setSelectedRole(value as UserRole)}>
            <TabsList className="grid grid-cols-3 mb-8 bg-slate-100 dark:bg-slate-700 p-1 rounded-2xl">
              <TabsTrigger 
                value="patient" 
                className="flex flex-col items-center gap-2 py-4 px-6 rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:shadow-lg transition-all duration-300"
              >
                <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                  <User size={18} />
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-300">{t('patient')}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="doctor" 
                className="flex flex-col items-center gap-2 py-4 px-6 rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:shadow-lg transition-all duration-300"
              >
                <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                  <Stethoscope size={18} />
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-300">{t('doctor')}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="intern" 
                className="flex flex-col items-center gap-2 py-4 px-6 rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:shadow-lg transition-all duration-300"
              >
                <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <BookOpen size={18} />
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-300">{t('intern')}</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="patient" className="space-y-4">
              <LoginForm role="patient" />
            </TabsContent>
            
            <TabsContent value="doctor" className="space-y-4">
              <LoginForm role="doctor" />
            </TabsContent>
            
            <TabsContent value="intern" className="space-y-4">
              <LoginForm role="intern" />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center pb-8">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t('noAccount')} <a href="#" className="text-primary font-semibold hover:underline transition-colors">{t('signUp')}</a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthPage;
