import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, UserPlus, UserCheck, MessageSquare, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Connection {
  id: string;
  user_id: string;
  name: string;
  avatar: string | null;
  role: string;
  grade_level?: string;
  department?: string;
  connected_at: string;
}

interface ConnectionRequest {
  id: string;
  from_user_id: string;
  to_user_id: string;
  name: string;
  avatar: string | null;
  role: string;
  grade_level?: string;
  department?: string;
  is_outgoing: boolean;
  created_at: string;
}

interface SearchResult {
  user_id: string;
  name: string;
  avatar: string | null;
  role: string;
  grade_level?: string;
  department?: string;
  status: 'none' | 'pending' | 'connected';
}

export default function FriendsAndPeers() {
  const { user, role: userRole } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const isTeacher = userRole === 'teacher';
  const title = isTeacher ? 'Colleagues' : 'Friends & Peers';

  useEffect(() => {
    if (user) {
      fetchConnections();
      fetchRequests();
    }
  }, [user]);

  const fetchConnections = async () => {
    if (!user) return;
    setLoading(true);

    const { data: connectionsData, error } = await supabase
      .from('connections')
      .select('*')
      .or(`user_id.eq.${user.id},connected_user_id.eq.${user.id}`);

    if (error) {
      console.error('Error fetching connections:', error);
      setLoading(false);
      return;
    }

    // Get the other user's ID for each connection
    const otherUserIds = (connectionsData || []).map((c) =>
      c.user_id === user.id ? c.connected_user_id : c.user_id
    );

    if (otherUserIds.length === 0) {
      setConnections([]);
      setLoading(false);
      return;
    }

    // Get profiles
    const { data: profiles } = await supabase
      .from('profiles')
      .select('user_id, full_name, avatar_url, grade_level, department')
      .in('user_id', otherUserIds);

    const { data: roles } = await supabase
      .from('user_roles')
      .select('user_id, role')
      .in('user_id', otherUserIds);

    const profileMap = (profiles || []).reduce((acc: Record<string, any>, p) => {
      acc[p.user_id] = p;
      return acc;
    }, {});

    const roleMap = (roles || []).reduce((acc: Record<string, string>, r) => {
      acc[r.user_id] = r.role;
      return acc;
    }, {});

    const formattedConnections: Connection[] = (connectionsData || []).map((c) => {
      const otherUserId = c.user_id === user.id ? c.connected_user_id : c.user_id;
      const profile = profileMap[otherUserId];
      return {
        id: c.id,
        user_id: otherUserId,
        name: profile?.full_name || 'Unknown',
        avatar: profile?.avatar_url,
        role: roleMap[otherUserId] === 'teacher' ? 'Teacher' : 'Student',
        grade_level: profile?.grade_level,
        department: profile?.department,
        connected_at: c.created_at,
      };
    });

    setConnections(formattedConnections);
    setLoading(false);
  };

  const fetchRequests = async () => {
    if (!user) return;

    const { data: requestsData, error } = await supabase
      .from('connection_requests')
      .select('*')
      .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
      .eq('status', 'pending');

    if (error) {
      console.error('Error fetching requests:', error);
      return;
    }

    const otherUserIds = (requestsData || []).map((r) =>
      r.from_user_id === user.id ? r.to_user_id : r.from_user_id
    );

    if (otherUserIds.length === 0) {
      setRequests([]);
      return;
    }

    const { data: profiles } = await supabase
      .from('profiles')
      .select('user_id, full_name, avatar_url, grade_level, department')
      .in('user_id', otherUserIds);

    const { data: roles } = await supabase
      .from('user_roles')
      .select('user_id, role')
      .in('user_id', otherUserIds);

    const profileMap = (profiles || []).reduce((acc: Record<string, any>, p) => {
      acc[p.user_id] = p;
      return acc;
    }, {});

    const roleMap = (roles || []).reduce((acc: Record<string, string>, r) => {
      acc[r.user_id] = r.role;
      return acc;
    }, {});

    const formattedRequests: ConnectionRequest[] = (requestsData || []).map((r) => {
      const otherUserId = r.from_user_id === user.id ? r.to_user_id : r.from_user_id;
      const profile = profileMap[otherUserId];
      return {
        id: r.id,
        from_user_id: r.from_user_id,
        to_user_id: r.to_user_id,
        name: profile?.full_name || 'Unknown',
        avatar: profile?.avatar_url,
        role: roleMap[otherUserId] === 'teacher' ? 'Teacher' : 'Student',
        grade_level: profile?.grade_level,
        department: profile?.department,
        is_outgoing: r.from_user_id === user.id,
        created_at: r.created_at,
      };
    });

    setRequests(formattedRequests);
  };

  const searchPeople = async () => {
    if (!searchQuery.trim() || !user) return;
    setSearching(true);
    setShowSearchResults(true);

    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('user_id, full_name, avatar_url, grade_level, department')
      .neq('user_id', user.id)
      .ilike('full_name', `%${searchQuery}%`);

    if (error) {
      console.error('Error searching:', error);
      setSearching(false);
      return;
    }

    const userIds = (profiles || []).map((p) => p.user_id);

    // Get roles
    const { data: roles } = await supabase
      .from('user_roles')
      .select('user_id, role')
      .in('user_id', userIds);

    // Get existing connections
    const { data: existingConnections } = await supabase
      .from('connections')
      .select('*')
      .or(`user_id.eq.${user.id},connected_user_id.eq.${user.id}`);

    // Get pending requests
    const { data: pendingRequests } = await supabase
      .from('connection_requests')
      .select('*')
      .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
      .eq('status', 'pending');

    const roleMap = (roles || []).reduce((acc: Record<string, string>, r) => {
      acc[r.user_id] = r.role;
      return acc;
    }, {});

    const connectedIds = new Set(
      (existingConnections || []).flatMap((c) => [c.user_id, c.connected_user_id])
    );

    const pendingIds = new Set(
      (pendingRequests || []).flatMap((r) => [r.from_user_id, r.to_user_id])
    );

    const results: SearchResult[] = (profiles || []).map((p) => ({
      user_id: p.user_id,
      name: p.full_name,
      avatar: p.avatar_url,
      role: roleMap[p.user_id] === 'teacher' ? 'Teacher' : 'Student',
      grade_level: p.grade_level,
      department: p.department,
      status: connectedIds.has(p.user_id)
        ? 'connected'
        : pendingIds.has(p.user_id)
        ? 'pending'
        : 'none',
    }));

    setSearchResults(results);
    setSearching(false);
  };

  const sendRequest = async (toUserId: string) => {
    if (!user) return;

    const { error } = await supabase.from('connection_requests').insert({
      from_user_id: user.id,
      to_user_id: toUserId,
    });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to send request. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Success',
      description: 'Connection request sent!',
    });

    // Update search results
    setSearchResults((prev) =>
      prev.map((r) => (r.user_id === toUserId ? { ...r, status: 'pending' } : r))
    );

    fetchRequests();
  };

  const acceptRequest = async (requestId: string, fromUserId: string) => {
    if (!user) return;

    // Create connection
    const { error: connectionError } = await supabase.from('connections').insert({
      user_id: user.id,
      connected_user_id: fromUserId,
    });

    if (connectionError) {
      toast({
        title: 'Error',
        description: 'Failed to accept request. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    // Update request status
    await supabase
      .from('connection_requests')
      .update({ status: 'accepted' })
      .eq('id', requestId);

    toast({
      title: 'Success',
      description: 'Connection accepted!',
    });

    fetchConnections();
    fetchRequests();
  };

  const declineRequest = async (requestId: string) => {
    await supabase.from('connection_requests').delete().eq('id', requestId);

    toast({
      title: 'Request Declined',
      description: 'The request has been removed.',
    });

    fetchRequests();
  };

  const cancelRequest = async (requestId: string) => {
    await supabase.from('connection_requests').delete().eq('id', requestId);

    toast({
      title: 'Request Cancelled',
      description: 'Your request has been cancelled.',
    });

    fetchRequests();
  };

  const messageUser = (userId: string) => {
    navigate('/dashboard/messenger');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  const incomingRequests = requests.filter((r) => !r.is_outgoing);
  const outgoingRequests = requests.filter((r) => r.is_outgoing);

  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="font-heading text-3xl font-bold">{title}</h1>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Search {isTeacher ? 'Colleagues' : 'Students'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder={`Search by name...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') searchPeople();
              }}
            />
            <Button onClick={searchPeople} disabled={searching}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          {/* Search Results */}
          {showSearchResults && (
            <div className="mt-4">
              {searching ? (
                <p className="text-center text-muted-foreground py-4">Searching...</p>
              ) : searchResults.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No results found for "{searchQuery}"
                </p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.map((result) => (
                    <div
                      key={result.user_id}
                      className="p-4 rounded-lg bg-muted/50 text-center"
                    >
                      <Avatar className="h-16 w-16 mx-auto mb-3">
                        <AvatarImage src={result.avatar || ''} />
                        <AvatarFallback className="bg-secondary text-primary text-lg">
                          {result.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <h4 className="font-medium">{result.name}</h4>
                      <p className="text-xs text-muted-foreground mb-3">
                        {result.role}
                        {result.grade_level && ` • Grade ${result.grade_level}`}
                        {result.department && ` • ${result.department}`}
                      </p>
                      {result.status === 'connected' ? (
                        <div className="flex items-center justify-center gap-1 text-green-600 text-sm">
                          <UserCheck className="h-4 w-4" />
                          Connected
                        </div>
                      ) : result.status === 'pending' ? (
                        <Button variant="outline" size="sm" disabled>
                          Request Pending
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => sendRequest(result.user_id)}>
                          <UserPlus className="h-4 w-4 mr-1" />
                          Send Request
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Your Connections */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Your Connections ({connections.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <div key={i} className="p-4 rounded-lg bg-muted/50 animate-pulse">
                    <div className="h-12 w-12 rounded-full bg-muted mx-auto mb-3" />
                    <div className="h-4 w-24 bg-muted rounded mx-auto mb-2" />
                    <div className="h-3 w-20 bg-muted rounded mx-auto" />
                  </div>
                ))}
              </div>
            ) : connections.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No connections yet. Search to find and connect with others!
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {connections.map((connection) => (
                  <div
                    key={connection.id}
                    className="p-4 rounded-lg bg-muted/50 text-center"
                  >
                    <Avatar className="h-12 w-12 mx-auto mb-2">
                      <AvatarImage src={connection.avatar || ''} />
                      <AvatarFallback className="bg-secondary text-primary">
                        {connection.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <h4 className="font-medium">{connection.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {connection.role}
                      {connection.grade_level && ` • Grade ${connection.grade_level}`}
                    </p>
                    <div className="flex items-center justify-center gap-1 text-green-600 text-sm my-2">
                      <UserCheck className="h-3 w-3" />
                      Connected
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      Since {formatDate(connection.connected_at)}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => messageUser(connection.user_id)}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Connection Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Connection Requests
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Incoming Requests */}
            {incomingRequests.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Incoming</h4>
                {incomingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <Avatar>
                      <AvatarImage src={request.avatar || ''} />
                      <AvatarFallback className="bg-secondary text-primary">
                        {request.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{request.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {request.role}
                        {request.grade_level && ` • Grade ${request.grade_level}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Wants to connect with you
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => acceptRequest(request.id, request.from_user_id)}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => declineRequest(request.id)}
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Outgoing Requests */}
            {outgoingRequests.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Sent</h4>
                {outgoingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <Avatar>
                      <AvatarImage src={request.avatar || ''} />
                      <AvatarFallback className="bg-secondary text-primary">
                        {request.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{request.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {request.role}
                        {request.grade_level && ` • Grade ${request.grade_level}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        You sent a request
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => cancelRequest(request.id)}
                    >
                      Cancel
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {incomingRequests.length === 0 && outgoingRequests.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No pending requests
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
