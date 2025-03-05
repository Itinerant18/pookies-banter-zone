
import React from 'react';
import { User } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserPen } from 'lucide-react';
import { ProfileFormValues } from './ProfileEditForm';

interface ProfileViewProps {
  user: User;
  profileData: ProfileFormValues;
  interests: string[];
  onEdit: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ 
  user, 
  profileData, 
  interests,
  onEdit 
}) => {
  return (
    <div className="space-y-6">
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
          <h3 className="text-xl font-semibold">{profileData.displayName || user.displayName || 'Anonymous'}</h3>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>Age</Label>
            <p className="text-sm">{profileData.age || 'Not set'}</p>
          </div>
          <div className="space-y-1">
            <Label>Gender</Label>
            <p className="text-sm">{profileData.gender || 'Not set'}</p>
          </div>
        </div>

        <div className="space-y-1">
          <Label>Bio</Label>
          <p className="text-sm whitespace-pre-wrap">{profileData.bio || 'No bio available'}</p>
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

      <div className="flex justify-end">
        <Button onClick={onEdit}>
          <UserPen className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </div>
    </div>
  );
};

export default ProfileView;
