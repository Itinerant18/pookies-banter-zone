
import React from 'react';

const EmptyMessageList: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <h3 className="text-lg font-medium">No messages yet</h3>
      <p className="text-muted-foreground mt-2">Say hello to start the conversation!</p>
    </div>
  );
};

export default EmptyMessageList;
