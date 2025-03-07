import React from 'react';
import { User } from 'firebase/auth';
import SettingsToggle from '@/components/settings/SettingsToggle';
import LanguageDisplay from '@/components/settings/LanguageDisplay';
import { useSettings } from '@/hooks/useSettings';

interface SettingsContentProps {
  user: User;
  isLoggingOut: boolean;
  logoutDialogOpen: boolean;
  setLogoutDialogOpen: (open: boolean) => void;
  handleLogout: () => Promise<void>;
}

const SettingsContent = ({
  user,
  isLoggingOut,
  logoutDialogOpen,
  setLogoutDialogOpen,
  handleLogout
}: SettingsContentProps) => {
  const {
    notificationsEnabled,
    darkMode,
    handleNotificationsToggle,
    handleDarkModeToggle
  } = useSettings(user);

  return (
    <div className="space-y-6">
      {/* Notifications Toggle */}
      <SettingsToggle
        icon={
          <img 
            src="/notification-bell.png" 
            alt="Notifications" 
            className="h-5 w-5 object-contain"
          />
        }
        title="Notifications"
        description="Receive app notifications"
        enabled={notificationsEnabled}
        onToggle={handleNotificationsToggle}
      />

      {/* Dark Mode Toggle */}
      <SettingsToggle
        icon={
          <img 
            src="/dark-mode.png" 
            alt="Dark Mode" 
            className="h-5 w-5 object-contain"
          />
        }
        title="Dark Mode"
        description="Toggle dark mode on/off"
        enabled={darkMode}
        onToggle={handleDarkModeToggle}
      />

      {/* Language Display */}
      <LanguageDisplay />
    </div>
  );
};

export default SettingsContent;
