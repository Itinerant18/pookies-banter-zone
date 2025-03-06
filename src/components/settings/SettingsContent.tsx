
import React from 'react';
import { User } from 'firebase/auth';
import { Bell, Moon } from 'lucide-react';
import SettingsToggle from '@/components/settings/SettingsToggle';
import LanguageDisplay from '@/components/settings/LanguageDisplay';
import LogoutDialog from '@/components/settings/LogoutDialog';
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
    <>
      {/* Notifications Toggle */}
      <SettingsToggle
        icon={Bell}
        title="Notifications"
        description="Receive app notifications"
        enabled={notificationsEnabled}
        onToggle={handleNotificationsToggle}
      />
      
      {/* Dark Mode Toggle */}
      <SettingsToggle
        icon={Moon}
        title="Dark Mode"
        description="Toggle dark mode on/off"
        enabled={darkMode}
        onToggle={handleDarkModeToggle}
      />
      
      {/* Language (Fixed to English) */}
      <LanguageDisplay />
    </>
  );
};

export default SettingsContent;
