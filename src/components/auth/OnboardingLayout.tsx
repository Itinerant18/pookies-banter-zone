
import React from 'react';
import { Card } from '@/components/ui/card';

interface OnboardingLayoutProps {
  children: React.ReactNode;
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold bg-gradient-to-t from-cherry-200 to-cherry-600 text-transparent bg-clip-text animate-slide-down">Pookie's Banter Zone</h1>
          <p className="mt-3 text-lg text-gray-900 max-w-sm mx-auto animate-slide-down">Connect With Your Pookie Around The Corner</p>
        </div>

        <Card className="glass-card animate-slide-up">
          {children}
        </Card>
        
        <div className="text-center mt-8 text-sm text-gray-500 animate-slide-up">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  );
};

export default OnboardingLayout;
