
import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, updateUserProfile, uploadUserPhoto } from '@/lib/firebase';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Camera, X, Plus, Save, UserPen } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { getUserProfile, updateCompleteUserProfile } from '@/lib/firebase/profile';

// Form schema with added fields
const profileSchema = z.object({
  displayName: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  age: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Age must be a valid number',
  }),
  gender: z.string().min(1, { message: 'Please select a gender' }),
  bio: z.string().max(150, { message: 'Bio must not exceed 150 characters' }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfileSettings: React.FC = () => {
  const [user] = useAuthState(auth);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [interestInput, setInterestInput] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.displayName || '',
      age: '',
      gender: '',
      bio: '',
    },
  });

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const profile = await getUserProfile(user.uid);
        
        if (profile) {
          form.reset({
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
  }, [user, form, toast]);

  // Handle image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    
    try {
      setIsUploading(true);
      await uploadUserPhoto(user, file);
      
      toast({
        title: 'Profile photo updated',
        description: 'Your profile photo has been updated successfully',
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: 'Upload failed',
        description: 'Please try again with a different image',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Remove profile picture
  const handleRemovePhoto = async () => {
    if (!user) return;
    
    try {
      setIsUploading(true);
      await updateUserProfile(user, { photoURL: null });
      
      toast({
        title: 'Profile photo removed',
        description: 'Your profile photo has been removed',
      });
    } catch (error) {
      console.error('Error removing photo:', error);
      toast({
        title: 'Failed to remove photo',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

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
      
      // Update profile in Firestore
      await updateCompleteUserProfile(user, profileData);
      
      // Also update the auth displayName
      await updateUserProfile(user, { displayName: data.displayName });
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully',
      });
      
      // Close dialog if open
      setIsEditDialogOpen(false);
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

  const renderProfileView = () => (
    <div className="w-full max-w-md mx-auto py-6 animate-fade-in">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>
            View your profile information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold">{form.getValues().displayName || user.displayName || 'Anonymous'}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Age</Label>
                <p className="text-sm">{form.getValues().age || 'Not set'}</p>
              </div>
              <div className="space-y-1">
                <Label>Gender</Label>
                <p className="text-sm">{form.getValues().gender || 'Not set'}</p>
              </div>
            </div>

            <div className="space-y-1">
              <Label>Bio</Label>
              <p className="text-sm whitespace-pre-wrap">{form.getValues().bio || 'No bio available'}</p>
            </div>

            <div className="space-y-1">
              <Label>Interests</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {interests.length > 0 ? (
                  interests.map((interest) => (
                    <Badge key={interest} variant="secondary">
                      {interest}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No interests added</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPen className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Update your profile information
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex flex-col items-center space-y-4 py-2">
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                      <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                        {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="absolute -bottom-2 -right-2 flex space-x-1">
                      <label
                        htmlFor="photo-upload"
                        className="bg-primary text-primary-foreground rounded-full p-2 cursor-pointer shadow-md hover:bg-primary/90 transition-colors"
                      >
                        {isUploading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Camera className="h-4 w-4" />
                        )}
                      </label>
                      
                      {user.photoURL && (
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="bg-destructive text-destructive-foreground rounded-full p-2 cursor-pointer shadow-md hover:bg-destructive/90 transition-colors"
                          disabled={isUploading}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                  </div>
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
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  );

  return renderProfileView();
};

export default ProfileSettings;
