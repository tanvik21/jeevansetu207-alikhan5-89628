import React from 'react';
import { Users, Brain, Activity, Shield, CheckCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const CareTimelineFlow = () => {
  const { t } = useLanguage();

  const steps = [
    {
      icon: Users,
      title: t('patient'),
      description: 'Reports symptoms through AI assistant',
      color: 'from-blue-500 to-indigo-500',
      position: 'left'
    },
    {
      icon: Brain,
      title: 'AI Analysis',
      description: 'Advanced algorithms analyze symptoms',
      color: 'from-purple-500 to-pink-500',
      position: 'right'
    },
    {
      icon: Activity,
      title: t('intern'),
      description: 'Medical intern reviews AI report',
      color: 'from-emerald-500 to-teal-500',
      position: 'left'
    },
    {
      icon: Shield,
      title: t('doctor'),
      description: 'Expert doctor provides final verification',
      color: 'from-orange-500 to-red-500',
      position: 'right'
    },
    {
      icon: CheckCircle,
      title: 'Verified Care',
      description: 'Patient receives trusted diagnosis',
      color: 'from-green-500 to-emerald-500',
      position: 'left'
    }
  ];

  return (
    <div className="relative py-12">
      {/* Central timeline line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-secondary to-primary transform -translate-x-1/2 hidden md:block">
        {/* Glowing progress indicator */}
        <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-primary to-transparent animate-progress-glow" />
      </div>

      {/* Timeline steps */}
      <div className="space-y-16 md:space-y-24">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isLeft = step.position === 'left';
          
          return (
            <div
              key={index}
              className={`relative flex items-center ${
                isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
              } flex-col gap-8 animate-fade-in`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Content card */}
              <div className={`flex-1 ${isLeft ? 'md:text-right' : 'md:text-left'} text-center`}>
                <div className="inline-block p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{step.description}</p>
                </div>
              </div>

              {/* Central icon node */}
              <div className="relative z-10 flex-shrink-0">
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-2xl animate-bounce-slow`}>
                  <Icon className="h-10 w-10 text-white" />
                </div>
                
                {/* Connecting arrow */}
                {index < steps.length - 1 && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 hidden md:block">
                    <ArrowRight className="h-6 w-6 text-primary rotate-90 animate-pulse" />
                  </div>
                )}
              </div>

              {/* Spacer for opposite side */}
              <div className="flex-1 hidden md:block" />
            </div>
          );
        })}
      </div>

      {/* Verification loop indicator */}
      <div className="mt-16 flex justify-center">
        <div className="relative inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full border-2 border-primary/30 backdrop-blur-sm">
          <div className="w-3 h-3 bg-primary rounded-full animate-ping" />
          <span className="font-semibold text-primary">Continuous Verification Loop</span>
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      </div>
    </div>
  );
};

export default CareTimelineFlow;
