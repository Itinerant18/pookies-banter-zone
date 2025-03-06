
import React from 'react';

const LanguageDisplay = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="h-5 w-5 flex items-center justify-center text-muted-foreground">
          <span className="text-sm">🇺🇸</span>
        </div>
        <div>
          <p className="text-sm font-medium">Language</p>
          <p className="text-xs text-muted-foreground">English</p>
        </div>
      </div>
    </div>
  );
};

export default LanguageDisplay;
