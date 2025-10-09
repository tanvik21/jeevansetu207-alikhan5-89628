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
import AnimatedBackground from '@/components/landing/AnimatedBackground';
import AIHandshakeIllustration from '@/components/landing/AIHandshakeIllustration';
import CareTimelineFlow from '@/components/landing/CareTimelineFlow';
import WaveFooter from '@/components/landing/WaveFooter';
import CancerScreeningDialog from '@/components/appointments/CancerScreeningDialog';
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
  Sparkles,
  Star,
  CheckCircle,
  MapPin,
  Zap,
  Mail,
  Github
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
                {t('hospice')}
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
        {/* Split Hero Section */}
        <section id="home" className="min-h-screen flex items-center relative overflow-hidden">
          <AnimatedBackground />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left: AI + Human Illustration */}
              <div className="order-2 lg:order-1 h-[400px] lg:h-[600px]">
                <AIHandshakeIllustration />
              </div>

              {/* Right: Content */}
              <div className="order-1 lg:order-2 space-y-8">
                <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full border border-primary/30 shadow-lg animate-fade-in">
                  <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                  <span className="text-sm font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {t('leadingHealthcarePlatform')}
                  </span>
                </div>

                <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                    <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-shimmer-glow">
                      {t('heroHeadline')}
                    </span>
                  </h1>

                  <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                    {t('heroSubheadline')}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-8 py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group text-lg"
                    onClick={() => setIsAuthOpen(true)}
                  >
                    <Zap className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                    {t('startJourney')}
                    <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="px-8 py-6 rounded-2xl border-2 border-primary/30 hover:bg-primary/5 hover:border-primary hover:shadow-lg transition-all duration-300 group text-lg"
                    onClick={() => setIsAuthOpen(true)}
                  >
                    <Users className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                    {t('joinAsProvider')}
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                  <div className="p-4 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 backdrop-blur-sm rounded-2xl border border-white/60 dark:border-slate-700/60 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">1000+</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{t('expertDoctors')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 backdrop-blur-sm rounded-2xl border border-white/60 dark:border-slate-700/60 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">24/7</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{t('healthcare247')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex items-start justify-center p-2">
              <div className="w-1 h-3 bg-primary rounded-full animate-pulse" />
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
                <h3 className="text-2xl font-bold mb-4 text-red-900 dark:text-red-100">{t('cancerCareIntegration')}</h3>
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
                {t('forRolesTitle')}
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                {t('platformCatersDesc')}
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
                        {t('accessVirtualConsultations')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-primary">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">{t('trustedByPatients')}</span>
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
                        {t('buildProfessionalProfile')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-600">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-medium">{t('doctorRating')}</span>
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
                        {t('learnFromExperts')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-purple-600">
                      <Brain className="h-4 w-4" />
                      <span className="text-sm font-medium">{t('aiPoweredLearning')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Care Journey Timeline - Redesigned Features Section */}
        <section id="features" className="py-32 px-4 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-10 w-64 h-64 bg-primary rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-10 w-64 h-64 bg-secondary rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-6 mb-20">
              <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full border border-primary/30 shadow-lg">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm font-semibold text-primary">Verified AI Care Workflow</span>
              </div>

              <h2 className="text-4xl md:text-6xl font-bold">
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  From Symptom to Solution
                </span>
              </h2>
              
              <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
                Experience our complete AI-powered, human-verified care journey — designed for accuracy, empathy, and trust at every step
              </p>
            </div>

            {/* Timeline Flow Component */}
            <CareTimelineFlow />

            {/* Additional Feature Highlights */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-white/60 dark:border-slate-700/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 shadow-lg">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{t('featureSymptomChecker')}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {t('featureSymptomCheckerDesc')}
                </p>
              </div>

              <div className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-white/60 dark:border-slate-700/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-4 shadow-lg">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{t('featureVerification')}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {t('featureVerificationDesc')}
                </p>
              </div>

              <div className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-white/60 dark:border-slate-700/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{t('featureMultilingual')}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {t('featureMultilingualDesc')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Hospice & Cancer Awareness Section */}
        <section id="hospice" className="py-20 px-4 bg-white dark:bg-slate-900 relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-pink-50/50 to-rose-50/50 dark:from-purple-900/10 dark:via-pink-900/10 dark:to-rose-900/10" />
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-pink-200/20 to-purple-200/20 dark:from-pink-900/10 dark:to-purple-900/10 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold">
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 dark:from-purple-400 dark:via-pink-400 dark:to-rose-400 bg-clip-text text-transparent">
                  {t('hospiceTitle')}
                </span>
              </h2>
              
              <p className="text-xl text-slate-700 dark:text-slate-300 leading-relaxed">
                {t('hospiceDescription')}
              </p>

              <CancerScreeningDialog>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <MapPin className="h-5 w-5 mr-2" />
                  {t('findHospice')}
                </Button>
              </CancerScreeningDialog>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="p-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-pink-100 dark:border-pink-900/30">
                  <Heart className="h-12 w-12 text-pink-600 mx-auto mb-4 animate-pulse" />
                  <h3 className="font-bold text-lg mb-2">Comfort Care</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Symptom management and pain relief</p>
                </div>
                <div className="p-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-purple-100 dark:border-purple-900/30">
                  <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">Family Support</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Emotional and practical guidance</p>
                </div>
                <div className="p-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-rose-100 dark:border-rose-900/30">
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
      
      {/* Wave Footer */}
      <WaveFooter scrollToSection={scrollToSection} />
    </div>
  );
};

export default Index;
