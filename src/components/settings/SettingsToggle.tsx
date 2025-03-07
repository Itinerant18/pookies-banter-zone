// components/settings/SettingsToggle.tsx
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface SettingsToggleProps {
  icon: React.ReactNode; // Changed to accept any React node
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}

const SettingsToggle = ({
  icon,
  title,
  description,
  enabled,
  onToggle,
}: SettingsToggleProps) => {
  return (
    <div className="flex items-center justify-between space-x-4">
      <div className="flex items-center space-x-4">
        <div className={cn("h-5 w-5", enabled ? "text-primary" : "text-muted-foreground")}>
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <Switch checked={enabled} onCheckedChange={onToggle} />
    </div>
  );
};

export default SettingsToggle;
