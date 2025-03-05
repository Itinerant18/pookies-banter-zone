
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface InterestManagerProps {
  interests: string[];
  setInterests: React.Dispatch<React.SetStateAction<string[]>>;
}

const InterestManager: React.FC<InterestManagerProps> = ({ interests, setInterests }) => {
  const [interestInput, setInterestInput] = useState('');
  const { toast } = useToast();

  // Add interest
  const handleAddInterest = () => {
    if (!interestInput.trim()) return;
    
    // Check if already exists
    if (interests.includes(interestInput.trim())) {
      toast({
        title: 'Interest already added',
        description: 'Please add a different interest',
        variant: 'destructive',
      });
      return;
    }
    
    // Check max limit
    if (interests.length >= 10) {
      toast({
        title: 'Maximum interests reached',
        description: 'Please remove some interests before adding more',
        variant: 'destructive',
      });
      return;
    }
    
    setInterests([...interests, interestInput.trim()]);
    setInterestInput('');
  };

  // Remove interest
  const handleRemoveInterest = (interest: string) => {
    setInterests(interests.filter(item => item !== interest));
  };

  return (
    <div className="space-y-2">
      <Label>Interests</Label>
      <div className="flex">
        <Input
          value={interestInput}
          onChange={(e) => setInterestInput(e.target.value)}
          placeholder="Add interest..."
          className="rounded-r-none"
        />
        <Button 
          type="button" 
          onClick={handleAddInterest}
          className="rounded-l-none"
          disabled={!interestInput.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-1">
        {interests.map((interest) => (
          <Badge key={interest} variant="secondary" className="flex items-center gap-1">
            {interest}
            <button 
              type="button" 
              onClick={() => handleRemoveInterest(interest)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default InterestManager;
