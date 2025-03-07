
import React from 'react';
import { Trash2 } from 'lucide-react';

const DeletedMessage: React.FC = () => {
  return (
    <div className="flex items-center gap-2 italic text-muted-foreground px-3 py-2 rounded-md bg-secondary/30">
      <Trash2 className="h-3 w-3" />
      <span className="text-sm">This message was deleted</span>
    </div>
  );
};

export default DeletedMessage;
