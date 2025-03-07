
import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Circle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

interface User {
  uid: string;
  name: string;
  photoURL: string | null;
  status: 'online' | 'offline';
  lastActive?: any;
  username?: string;
}

interface UsersListProps {
  onSelectUser: (user: User) => void;
}

const UsersList: React.FC<UsersListProps> = ({ onSelectUser }) => {
  const [user] = useAuthState(auth);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchMode, setSearchMode] = useState<'name' | 'username'>('name');
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    // Update current user's online status
    const updateOnlineStatus = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          status: 'online',
          lastActive: new Date()
        });
      } catch (error) {
        console.error('Error updating online status:', error);
      }
    };

    updateOnlineStatus();

    // Set up listener for online status when app closes/tab closes
    const handleBeforeUnload = () => {
      if (user?.uid) {
        const userRef = doc(db, "users", user.uid);
        updateDoc(userRef, {
          status: 'offline',
          lastActive: new Date()
        }).catch(console.error);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Query all users except current user
    const usersQuery = query(
      collection(db, "users"),
      where("uid", "!=", user.uid)
    );

    const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
      try {
        const usersList = snapshot.docs.map(doc => ({
          ...doc.data() as User,
          uid: doc.data().uid || doc.id
        }));
        
        console.log('Fetched users:', usersList);
        setUsers(usersList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Error",
          description: "Failed to load users. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
      }
    }, (error) => {
      console.error('Error in users subscription:', error);
      toast({
        title: "Error",
        description: "Failed to connect to user service.",
        variant: "destructive",
      });
      setLoading(false);
    });

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      unsubscribe();
    };
  }, [user, toast]);

  // Handle direct username search
  const handleUsernameSearch = () => {
    if (searchTerm.startsWith('@')) {
      setSearchMode('username');
    } else {
      setSearchMode('name');
    }
  };

  // Filter users based on search term and search mode
  const filteredUsers = users.filter(user => {
    if (!searchTerm) return true;
    
    if (searchMode === 'username' && searchTerm.startsWith('@')) {
      const searchUsername = searchTerm.substring(1).toLowerCase();
      return user.username && user.username.toLowerCase() === searchUsername;
    } else {
      return user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
  });

  return (
    <Card className="p-4 glass-card h-full">
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or @username"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            handleUsernameSearch();
          }}
          className="pl-9"
        />
        {searchTerm.startsWith('@') && (
          <div className="mt-1 text-xs text-muted-foreground">
            Searching for exact username match
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center my-8">
          <div className="animate-pulse space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-gray-300"></div>
                <div className="h-4 w-48 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center my-8 text-muted-foreground">
          {searchTerm ? (
            <>
              <p className="mb-2">No users found matching your search</p>
              {searchMode === 'username' && (
                <p className="text-sm">Check that you've entered the exact username including the @ symbol</p>
              )}
            </>
          ) : (
            "No users available"
          )}
        </div>
      ) : (
        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {filteredUsers.map((userItem) => (
              <div
                key={userItem.uid}
                className="flex items-center p-2 rounded-md hover:bg-accent cursor-pointer transition-colors"
                onClick={() => onSelectUser(userItem)}
              >
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={userItem.photoURL || undefined} alt={userItem.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {userItem.name ? userItem.name.charAt(0).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium">{userItem.name || 'Anonymous'}</div>
                  {userItem.username && (
                    <div className="text-xs text-muted-foreground">@{userItem.username}</div>
                  )}
                </div>
                <div className="flex items-center">
                  <Circle 
                    className={`h-3 w-3 mr-1 ${userItem.status === 'online' ? 'text-green-500 fill-green-500' : 'text-gray-400 fill-gray-400'}`} 
                  />
                  <span className="text-xs text-muted-foreground">
                    {userItem.status === 'online' ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </Card>
  );
};

export default UsersList;
