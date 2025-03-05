
import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { ProfileFormValues } from './profile/ProfileEditForm';
import { getUserProfile } from '@/lib/firebase/profile';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Import our refactored components
import ProfileView from './profile/ProfileView';
import ProfileEditForm from './profile/ProfileEditForm';

const ProfileSettings: React.FC = () => {
  const [user] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [interests, setInterests] = useState<string[]>([]);
  const [profileData, setProfileData] = useState<ProfileFormValues>({
    displayName: '',
    age: '',
    gender: '',
    bio: ''
  });
  const { toast } = useToast();

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const profile = await getUserProfile(user.uid);
        
        if (profile) {
          setProfileData({
            displayName: profile.name || user.displayName || '',
            age: profile.age?.toString() || '',
            gender: profile.gender || '',
            bio: profile.bio || '',
          });
          
          if (profile.interests && Array.isArray(profile.interests)) {
            setInterests(profile.interests);
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: 'Failed to load profile',
          description: 'Please refresh the page and try again',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [user, toast]);

  if (!user) {
    return <div>Loading...</div>;
  }

  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto py-6 animate-fade-in">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>
            View your profile information
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <ProfileView 
            user={user} 
            profileData={profileData} 
            interests={interests}
            onEdit={() => setIsEditDialogOpen(true)} 
          />
        </CardContent>
        
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>
                Update your profile information
              </DialogDescription>
            </DialogHeader>
            
            <ProfileEditForm 
              user={user} 
              initialData={profileData}
              initialInterests={interests}
              onClose={() => setIsEditDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
};

export default ProfileSettings;
