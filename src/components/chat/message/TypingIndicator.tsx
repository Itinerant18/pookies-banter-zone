
import React from 'react';

interface TypingIndicatorProps {
  isTyping: boolean;
  recipientId?: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ 
  isTyping, 
  recipientId 
}) => {
  if (!isTyping || !recipientId) return null;
  
  return (
    <div className="flex justify-start">
      <div className="flex flex-col">
        <div className="max-w-[75%] px-4 py-2 rounded-lg bg-secondary text-secondary-foreground rounded-bl-none">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "600ms" }}></div>
          </div>
        </div>
        <span className="text-xs text-muted-foreground mt-1 px-2">Typing...</span>
      </div>
    </div>
  );
};

export default TypingIndicator;
