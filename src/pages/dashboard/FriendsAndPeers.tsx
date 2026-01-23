import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, UserPlus, MessageSquare, UserMinus, Check, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const connections = [
  { id: 1, name: 'John Wari', info: 'Grade 11 • Science Stream', avatar: '', mutual: 5 },
  { id: 2, name: 'Sarah Mondo', info: 'Grade 11 • Arts Stream', avatar: '', mutual: 8 },
  { id: 3, name: 'Peter Kila', info: 'Grade 12 • Science Stream', avatar: '', mutual: 3 },
  { id: 4, name: 'Anna Raga', info: 'Grade 10 • Commerce Stream', avatar: '', mutual: 6 },
  { id: 5, name: 'David Tau', info: 'Grade 11 • Science Stream', avatar: '', mutual: 4 },
  { id: 6, name: 'Grace Bai', info: 'Grade 12 • Arts Stream', avatar: '', mutual: 7 },
];

const friendRequests = [
  { id: 1, name: 'Michael Kora', info: 'Grade 10 • Science Stream', avatar: '', mutual: 2 },
  { id: 2, name: 'Lucy Wari', info: 'Grade 11 • Commerce Stream', avatar: '', mutual: 4 },
];

const colleagueConnections = [
  { id: 1, name: 'Dr. Sarah Mondo', info: 'Science Department', avatar: '', mutual: 8 },
  { id: 2, name: 'Mr. Peter Kila', info: 'Mathematics Department', avatar: '', mutual: 12 },
  { id: 3, name: 'Mrs. Anna Wari', info: 'Humanities Department', avatar: '', mutual: 6 },
  { id: 4, name: 'Mr. David Raga', info: 'Technology Department', avatar: '', mutual: 5 },
];

const colleagueRequests = [
  { id: 1, name: 'Ms. Grace Tau', info: 'Arts Department', avatar: '', mutual: 3 },
];

export default function FriendsAndPeers() {
  const { role } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const isTeacher = role === 'teacher';
  const currentConnections = isTeacher ? colleagueConnections : connections;
  const currentRequests = isTeacher ? colleagueRequests : friendRequests;
  const pageTitle = isTeacher ? 'Colleagues' : 'Friends & Peers';

  const filteredConnections = currentConnections.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold">{pageTitle}</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder={`Search ${isTeacher ? 'colleagues' : 'friends'}...`} 
            className="pl-9 w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Friend Requests */}
      {currentRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              {isTeacher ? 'Connection Requests' : 'Friend Requests'}
              <span className="ml-2 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs">{currentRequests.length}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentRequests.map((request) => (
                <div key={request.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={request.avatar} />
                    <AvatarFallback className="bg-primary text-primary-foreground">{request.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{request.name}</p>
                    <p className="text-xs text-muted-foreground">{request.info}</p>
                    <p className="text-xs text-primary">{request.mutual} mutual connections</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" className="h-8 w-8 bg-primary text-primary-foreground hover:bg-primary/90">
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline" className="h-8 w-8">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Connections */}
      <Card>
        <CardHeader>
          <CardTitle>Your Connections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredConnections.map((connection) => (
              <div key={connection.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors group">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={connection.avatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground">{connection.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{connection.name}</p>
                  <p className="text-xs text-muted-foreground">{connection.info}</p>
                  <p className="text-xs text-primary">{connection.mutual} mutual</p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive">
                    <UserMinus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {filteredConnections.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <UserPlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No connections found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Find New Connections */}
      <Card>
        <CardHeader>
          <CardTitle>Find New {isTeacher ? 'Colleagues' : 'Friends'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">Search for {isTeacher ? 'colleagues' : 'classmates'} by name or {isTeacher ? 'department' : 'grade'}</p>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <UserPlus className="h-4 w-4 mr-2" />Browse {isTeacher ? 'Colleagues' : 'Students'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
