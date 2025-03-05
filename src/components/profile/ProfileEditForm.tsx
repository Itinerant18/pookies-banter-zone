
import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { DialogFooter } from '@/components/ui/dialog';
import { updateCompleteUserProfile, updateUserProfile } from '@/lib/firebase/profile';
import ProfilePhoto from './ProfilePhoto';
import InterestManager from './InterestManager';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Form schema with added fields
const profileSchema = z.object({
  displayName: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  age: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Age must be a valid number',
  }),
  gender: z.string().min(1, { message: 'Please select a gender' }),
  bio: z.string().max(150, { message: 'Bio must not exceed 150 characters' }),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileEditFormProps {
  user: User;
  initialData: ProfileFormValues;
  initialInterests: string[];
  onClose: () => void;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ 
  user, 
  initialData, 
  initialInterests, 
  onClose 
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [interests, setInterests] = useState<string[]>(initialInterests);
  const { toast } = useToast();

  // Form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialData
  });

  // Handle form submission
  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;
    
    try {
      setIsUpdating(true);
      
      // Prepare update data
      const profileData = {
        name: data.displayName,
        age: parseInt(data.age, 10),
        gender: data.gender,
        bio: data.bio,
        interests: interests
      };
      
      console.log("Updating profile with data:", profileData);
      
      // Update profile in Firestore
      await updateCompleteUserProfile(user, profileData);
      
      // Also update the auth displayName
      await updateUserProfile(user, { displayName: data.displayName });
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully',
      });
      
      // Close dialog
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Update failed',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex flex-col items-center space-y-4 py-2">
        <ProfilePhoto user={user} />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="displayName">Name</Label>
        <Input
          id="displayName"
          {...form.register('displayName')}
        />
        {form.formState.errors.displayName && (
          <p className="text-sm text-red-500">{form.formState.errors.displayName.message}</p>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            {...form.register('age')}
          />
          {form.formState.errors.age && (
            <p className="text-sm text-red-500">{form.formState.errors.age.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select
            onValueChange={(value) => form.setValue('gender', value)}
            defaultValue={form.getValues().gender}
          >
            <SelectTrigger id="gender">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="nonbinary">Non-binary</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.gender && (
            <p className="text-sm text-red-500">{form.formState.errors.gender.message}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          {...form.register('bio')}
          placeholder="Tell us about yourself..."
          className="resize-none"
          maxLength={150}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Max 150 characters</span>
          <span>{form.watch('bio')?.length || 0}/150</span>
        </div>
        {form.formState.errors.bio && (
          <p className="text-sm text-red-500">{form.formState.errors.bio.message}</p>
        )}
      </div>
      
      <InterestManager interests={interests} setInterests={setInterests} />
      
      <DialogFooter>
        <Button type="submit" disabled={isUpdating}>
          {isUpdating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default ProfileEditForm;
