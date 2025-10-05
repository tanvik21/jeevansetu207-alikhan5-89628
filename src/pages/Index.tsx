import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AuthPage from '@/components/auth/AuthPage';
import JeevanSetuLogo from '@/components/ui/JeevanSetuLogo';
import LanguageSelector from '@/components/ui/LanguageSelector';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Activity, 
  Brain, 
  FileText, 
  Users, 
  Heart, 
  Shield, 
  Clock, 
  Award, 
  ChevronRight, 
  Play, 
  Star, 
  CheckCircle,
  MapPin,
  Mail,
  Github,
  Home as HomeIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  
  if (isLoggedIn) {
    window.location.href = '/dashboard';
    return null;
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "We'll get back to you soon.",
    });
    setContactForm({ name: '', email: '', message: '' });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 transition-colors">
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md py-4 border-b border-white/20 dark:border-slate-700/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <JeevanSetuLogo size="md" />
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => scrollToSection('home')} 
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
              >
                {t('home')}
              </button>
              <button 
                onClick={() => scrollToSection('about')} 
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
              >
                {t('about')}
              </button>
              <button 
                onClick={() => scrollToSection('features')} 
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
              >
                {t('features')}
              </button>
              <button 
                onClick={() => scrollToSection('hospice')} 
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
              >
                Hospice
              </button>
              <button 
                onClick={() => scrollToSection('contact')} 
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
              >
                {t('contact')}
              </button>
            </nav>
            <div className="flex items-center gap-3">
              <LanguageSelector />
              <ThemeToggle />
              <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    {t('login')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{t('welcome')}</DialogTitle>
                    <DialogDescription>{t('chooseRole')}</DialogDescription>
                  </DialogHeader>
                  <AuthPage />
                </DialogContent>
              </Dialog>
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                onClick={() => setIsAuthOpen(true)}
              >
                {t('getStarted')}
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main>
        {/* Hero Section */}
        <section id="home" className="py-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 dark:from-primary/10 dark:via-secondary/10 dark:to-primary/10"></div>
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl animate-pulse-subtle"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/10 dark:bg-secondary/20 rounded-full blur-3xl animate-pulse-subtle"></div>
          
          <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm px-4 py-2 rounded-full border border-primary/20">
                  <Award className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">India's Leading Healthcare Platform</span>
                </div>
                
                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-100 dark:via-slate-200 dark:to-slate-100 bg-clip-text text-transparent">
                    {t('heroHeadline')}
                  </span>
                </h1>
                
                <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                  {t('heroSubheadline')}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-8 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                  onClick={() => setIsAuthOpen(true)}
                >
                  {t('startJourney')}
                  <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="px-8 py-6 rounded-2xl border-2 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg transition-all duration-300 group"
                  onClick={() => setIsAuthOpen(true)}
                >
                  <Users className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                  {t('joinAsProvider')}
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-6 pt-8">
                <div className="flex items-center gap-3 p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-white/40 dark:border-slate-700/40">
                  <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-xl">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">1000+</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{t('expertDoctors')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-white/40 dark:border-slate-700/40">
                  <div className="bg-gradient-to-r from-secondary to-primary p-2 rounded-xl">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">24/7</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{t('healthcare247')}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center lg:justify-end">
              <div className="max-w-md w-full p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 dark:border-slate-700/40">
                <h3 className="text-2xl font-bold mb-6 text-center">Quick Access</h3>
                <div className="space-y-4">
                  <Button 
                    className="w-full justify-start h-14 text-lg"
                    onClick={() => setIsAuthOpen(true)}
                  >
                    <Users className="h-5 w-5 mr-3" />
                    {t('patient')} Portal
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full justify-start h-14 text-lg"
                    onClick={() => setIsAuthOpen(true)}
                  >
                    <Activity className="h-5 w-5 mr-3" />
                    {t('doctor')} Portal
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full justify-start h-14 text-lg"
                    onClick={() => setIsAuthOpen(true)}
                  >
                    <Brain className="h-5 w-5 mr-3" />
                    {t('intern')} Portal
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 px-4 bg-white dark:bg-slate-900 transition-colors">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-100 dark:to-slate-200 bg-clip-text text-transparent">
                {t('aboutTitle')}
              </h2>
              
              <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                {t('aboutMission')}
              </p>

              <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-8 rounded-2xl border border-red-100 dark:border-red-900/40">
                <h3 className="text-2xl font-bold mb-4 text-red-900 dark:text-red-100">Cancer Care Integration</h3>
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  {t('aboutCancer')}
                </p>
              </div>

              <blockquote className="text-2xl italic font-light text-slate-700 dark:text-slate-300 border-l-4 border-primary pl-6 my-8">
                "{t('aboutVision')}"
              </blockquote>
            </div>
          </div>
        </section>
        
        {/* For Roles Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
          <div className="container mx-auto text-center">
            <div className="max-w-3xl mx-auto space-y-6 mb-16">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-100 dark:to-slate-200 bg-clip-text text-transparent">
                For Patients, Doctors & Medical Interns
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                Our platform caters to the entire healthcare ecosystem, providing specialized tools for each role.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="card-hover group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <CardContent className="pt-8 pb-8">
                  <div className="flex flex-col items-center text-center space-y-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Users className="h-10 w-10 text-white" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{t('forPatients')}</h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        Access virtual consultations, AI symptom checking, and maintain your complete health records in one secure place.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-primary">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Trusted by 50K+ patients</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="card-hover group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
                <CardContent className="pt-8 pb-8">
                  <div className="flex flex-col items-center text-center space-y-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Activity className="h-10 w-10 text-white" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{t('forDoctors')}</h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        Build your professional profile, validate AI diagnoses, and serve your community to increase visibility and impact.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-600">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-medium">4.9/5 doctor rating</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="card-hover group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                <CardContent className="pt-8 pb-8">
                  <div className="flex flex-col items-center text-center space-y-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Brain className="h-10 w-10 text-white" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{t('forInterns')}</h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        Learn from experienced doctors, understand AI diagnostics, and track your medical training progress.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-purple-600">
                      <Brain className="h-4 w-4" />
                      <span className="text-sm font-medium">AI-powered learning</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4 bg-white dark:bg-slate-900">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-100 dark:to-slate-200 bg-clip-text text-transparent">
                {t('featuresTitle')}
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                Comprehensive healthcare solutions powered by AI and verified by experts
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 text-left group card-hover">
                <div className="bg-gradient-to-r from-primary to-secondary p-4 rounded-2xl inline-block group-hover:scale-110 transition-transform duration-300 mb-4">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">{t('featureSymptomChecker')}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t('featureSymptomCheckerDesc')}
                </p>
              </div>
              
              <div className="p-8 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 text-left group card-hover">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4 rounded-2xl inline-block group-hover:scale-110 transition-transform duration-300 mb-4">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">{t('featureVerification')}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t('featureVerificationDesc')}
                </p>
              </div>
              
              <div className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 text-left group card-hover">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-2xl inline-block group-hover:scale-110 transition-transform duration-300 mb-4">
                  <Activity className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">{t('featureOncologyTracker')}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t('featureOncologyTrackerDesc')}
                </p>
              </div>
              
              <div className="p-8 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 text-left group card-hover">
                <div className="bg-gradient-to-r from-red-500 to-pink-500 p-4 rounded-2xl inline-block group-hover:scale-110 transition-transform duration-300 mb-4">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">{t('featureHospiceBridge')}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t('featureHospiceBridgeDesc')}
                </p>
              </div>
              
              <div className="p-8 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 text-left group card-hover">
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4 rounded-2xl inline-block group-hover:scale-110 transition-transform duration-300 mb-4">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">{t('featureInternHub')}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t('featureInternHubDesc')}
                </p>
              </div>
              
              <div className="p-8 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 text-left group card-hover">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-4 rounded-2xl inline-block group-hover:scale-110 transition-transform duration-300 mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">{t('featureMultilingual')}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t('featureMultilingualDesc')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Hospice & Cancer Awareness Section */}
        <section id="hospice" className="py-20 px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-rose-900/20">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-900 to-pink-900 dark:from-purple-100 dark:to-pink-100 bg-clip-text text-transparent">
                {t('hospiceTitle')}
              </h2>
              
              <p className="text-xl text-slate-700 dark:text-slate-300 leading-relaxed">
                {t('hospiceDescription')}
              </p>

              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <MapPin className="h-5 w-5 mr-2" />
                {t('findHospice')}
              </Button>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
                  <Heart className="h-12 w-12 text-pink-600 mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">Comfort Care</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Symptom management and pain relief</p>
                </div>
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
                  <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">Family Support</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Emotional and practical guidance</p>
                </div>
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
                  <Shield className="h-12 w-12 text-rose-600 mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">Dignity & Respect</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Compassionate end-of-life care</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 px-4 bg-white dark:bg-slate-900">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center space-y-6 mb-12">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-100 dark:to-slate-200 bg-clip-text text-transparent">
                {t('contactTitle')}
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300">
                Get in touch with us for any queries or support
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-6">
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">{t('contactName')}</Label>
                    <Input 
                      id="name" 
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">{t('contactEmail')}</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">{t('contactMessage')}</Label>
                    <Textarea 
                      id="message" 
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    {t('contactSend')}
                  </Button>
                </form>
              </Card>

              <div className="space-y-6">
                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">Email Us</h3>
                      <p className="text-sm text-muted-foreground">support@jeevansetu.com</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <Github className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">Collaborate</h3>
                      <p className="text-sm text-muted-foreground">github.com/jeevansetu</p>
                    </div>
                  </div>
                </Card>

                <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-6 rounded-lg text-center">
                  <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                  <p className="font-medium">{t('contactFooter')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20">
          <div className="container mx-auto text-center">
            <div className="max-w-3xl mx-auto space-y-6 mb-12">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-100 dark:to-slate-200 bg-clip-text text-transparent">
                Ready to Transform Your Healthcare Experience?
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                Join our growing community of patients and healthcare professionals revolutionizing medical care.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-10 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                onClick={() => setIsAuthOpen(true)}
              >
                <Users className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                Create Account
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-slate-900 dark:bg-slate-950 text-white py-16 px-4 transition-colors">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <JeevanSetuLogo size="md" />
              <p className="text-slate-400 leading-relaxed">
                Transforming healthcare with cutting-edge AI and telemedicine solutions for a healthier tomorrow.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Product</h3>
              <ul className="space-y-3">
                <li><button onClick={() => scrollToSection('features')} className="text-slate-400 hover:text-white transition-colors">Features</button></li>
                <li><button onClick={() => scrollToSection('about')} className="text-slate-400 hover:text-white transition-colors">About</button></li>
                <li><button onClick={() => scrollToSection('hospice')} className="text-slate-400 hover:text-white transition-colors">Hospice Care</button></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">For Healthcare</h3>
              <ul className="space-y-3">
                <li><button onClick={() => setIsAuthOpen(true)} className="text-slate-400 hover:text-white transition-colors">For Patients</button></li>
                <li><button onClick={() => setIsAuthOpen(true)} className="text-slate-400 hover:text-white transition-colors">For Doctors</button></li>
                <li><button onClick={() => setIsAuthOpen(true)} className="text-slate-400 hover:text-white transition-colors">For Interns</button></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Support</h3>
              <ul className="space-y-3">
                <li><button onClick={() => scrollToSection('contact')} className="text-slate-400 hover:text-white transition-colors">Contact Us</button></li>
                <li><a href="mailto:support@jeevansetu.com" className="text-slate-400 hover:text-white transition-colors">Email Support</a></li>
                <li><a href="https://github.com/jeevansetu" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">GitHub</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 text-center">
            <p className="text-slate-400">
              &copy; {new Date().getFullYear()} JeevanSetu. All rights reserved. {t('contactFooter')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
