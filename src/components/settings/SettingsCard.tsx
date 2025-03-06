
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface SettingsCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const SettingsCard = ({
  title,
  description,
  children,
  footer,
}: SettingsCardProps) => {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {children}
        </div>
      </CardContent>
      {footer && (
        <CardFooter className="flex-col space-y-2">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
};

export default SettingsCard;
