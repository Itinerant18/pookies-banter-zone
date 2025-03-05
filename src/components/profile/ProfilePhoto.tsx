
import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Camera, X } from 'lucide-react';
import { uploadUserPhoto, updateUserProfile } from '@/lib/firebase';
import { useToast } from '@/components/ui/use-toast';

interface ProfilePhotoProps {
  user: User;
}

const ProfilePhoto: React.FC<ProfilePhotoProps> = ({ user }) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

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

  return (
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
  );
};

export default ProfilePhoto;
