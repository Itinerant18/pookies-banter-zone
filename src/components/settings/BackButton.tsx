
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BackButton = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <div className="mb-4">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleBackClick}
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Home
      </Button>
    </div>
  );
};

export default BackButton;
