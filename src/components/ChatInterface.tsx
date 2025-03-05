
import React, { useState, useEffect, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, findRandomUser, createChatRoom, sendMessage, subscribeToMessages } from '@/lib/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, RefreshCw, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ChatInterface: React.FC = () => {
  const [user] = useAuthState(auth);
  const [matchedUser, setMatchedUser] = useState<any>(null);
  const [finding, setFinding] = useState(false);
  const [chatRoomId, setChatRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Find a random user to chat with
  const findRandomMatch = async () => {
    if (!user) return;
    
    try {
      setFinding(true);
      setMatchedUser(null);
      setChatRoomId(null);
      setMessages([]);
      
      // Find a random user
      const randomUser = await findRandomUser(user.uid);
      
      if (!randomUser) {
        toast({
          title: 'No users available',
          description: 'Please try again later when more users are online',
          variant: 'destructive',
        });
        return;
      }
      
      // Create a chat room
      const roomId = await createChatRoom(user.uid, randomUser.uid);
      
      setMatchedUser(randomUser);
      setChatRoomId(roomId);
    } catch (error) {
      console.error('Error finding match:', error);
      toast({
        title: 'Error finding match',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setFinding(false);
    }
  };

  // Subscribe to messages when chat room changes
  useEffect(() => {
    if (!chatRoomId) return;
    
    const unsubscribe = subscribeToMessages(chatRoomId, (newMessages) => {
      setMessages(newMessages);
    });
    
    return () => unsubscribe();
  }, [chatRoomId]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Find a match on first load
  useEffect(() => {
    if (user) {
      findRandomMatch();
    }
  }, [user]);

  // Handle sending a message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !chatRoomId || !newMessage.trim()) return;
    
    try {
      setSending(true);
      await sendMessage(chatRoomId, user.uid, newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error sending message',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto pt-6 pb-20 animate-fade-in">
      {finding ? (
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <h3 className="text-xl font-medium">Finding someone to chat with...</h3>
          <p className="text-muted-foreground mt-2">This might take a moment</p>
        </div>
      ) : !matchedUser ? (
        <div className="flex flex-col items-center justify-center h-64">
          <h3 className="text-xl font-medium mb-4">No one to chat with right now</h3>
          <Button onClick={findRandomMatch} size="lg" className="animate-enter">
            Find Someone to Chat With
          </Button>
        </div>
      ) : (
        <div className="flex flex-col space-y-4">
          <Card className="glass-card overflow-hidden">
            <CardContent className="p-4 flex items-center space-x-4">
              <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                <AvatarImage src={matchedUser.photoURL || undefined} alt={matchedUser.name} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {matchedUser.name ? matchedUser.name.charAt(0).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-lg font-medium">{matchedUser.name}</h3>
                <p className="text-sm text-muted-foreground">You are now chatting</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={findRandomMatch} 
                disabled={finding}
                className="shrink-0"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                New Chat
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card overflow-hidden">
            <ScrollArea className="h-[400px] p-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <h3 className="text-lg font-medium">No messages yet</h3>
                  <p className="text-muted-foreground mt-2">Say hello to start the conversation!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.senderId === user?.uid ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[75%] px-4 py-2 rounded-lg ${
                          msg.senderId === user?.uid
                            ? 'bg-primary text-primary-foreground rounded-br-none'
                            : 'bg-secondary text-secondary-foreground rounded-bl-none'
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>
          </Card>

          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1"
              disabled={sending}
            />
            <Button type="submit" disabled={!newMessage.trim() || sending}>
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
