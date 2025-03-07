
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CardHeader, CardDescription, CardTitle } from '@/components/ui/card';
import { signInWithGoogle } from '@/lib/firebase/auth';
import OnboardingLayout from './auth/OnboardingLayout';
import LoginForm from './auth/LoginForm';
import RegisterForm from './auth/RegisterForm';

const OnboardingScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('login');

  const handleGoogleSignIn = async (rememberMe: boolean) => {
    try {
      setIsLoading(true);
      await signInWithGoogle(rememberMe);
      navigate('/chat');
    } catch (error: any) {
      toast({
        title: 'Google sign-in failed',
        description: error.message || 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OnboardingLayout>
      <Tabs 
        defaultValue="login" 
        className="w-full"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>
              Enter your credentials to sign in to your account
            </CardDescription>
          </CardHeader>
          <LoginForm 
            onSocialSignIn={handleGoogleSignIn}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </TabsContent>
        
        <TabsContent value="register">
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>
              Enter your details to create a new account
            </CardDescription>
          </CardHeader>
          <RegisterForm 
            onSocialSignIn={handleGoogleSignIn}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </TabsContent>
      </Tabs>
    </OnboardingLayout>
  );
};

export default OnboardingScreen;
