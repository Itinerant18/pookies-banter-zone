
import React from 'react';
import { Toggle } from '@/components/ui/toggle';
import { LucideIcon } from 'lucide-react';

interface SettingsToggleProps {
  icon: LucideIcon;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => Promise<void>;
}

const SettingsToggle = ({
  icon: Icon,
  title,
  description,
  enabled,
  onToggle,
}: SettingsToggleProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <Toggle 
        aria-label={`Toggle ${title}`} 
        pressed={enabled}
        onPressedChange={onToggle}
        className={enabled ? "bg-primary/20 text-primary-foreground" : ""}
      />
    </div>
  );
};

export default SettingsToggle;
