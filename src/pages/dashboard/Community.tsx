import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ThumbsUp, MessageCircle, Image, Paperclip, Send, School, GraduationCap, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Post {
  id: string;
  content: string;
  author_id: string;
  author_name: string;
  author_avatar: string | null;
  author_role: string;
  category: string;
  image_url: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  liked_by_user: boolean;
}

interface Comment {
  id: string;
  content: string;
  author_id: string;
  author_name: string;
  author_avatar: string | null;
  created_at: string;
}

const communityTabs = [
  { id: 'school', name: 'School Community', icon: School },
  { id: 'grade', name: 'Grade Community', icon: GraduationCap },
  { id: 'class', name: 'Class Community', icon: Users },
];

export default function Community() {
  const { user, profile, role } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('school');
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [expandedComments, setExpandedComments] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [newComment, setNewComment] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user, activeTab]);

  const fetchPosts = async () => {
    if (!user) return;
    setLoading(true);

    const { data: postsData, error } = await supabase
      .from('community_posts')
      .select('*')
      .eq('category', activeTab)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
      return;
    }

    // Get author profiles
    const authorIds = [...new Set((postsData || []).map((p) => p.author_id))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('user_id, full_name, avatar_url')
      .in('user_id', authorIds);

    const { data: roles } = await supabase
      .from('user_roles')
      .select('user_id, role')
      .in('user_id', authorIds);

    // Check which posts user has liked
    const { data: userLikes } = await supabase
      .from('post_likes')
      .select('post_id')
      .eq('user_id', user.id);

    const likedPostIds = new Set((userLikes || []).map((l) => l.post_id));

    const profileMap = (profiles || []).reduce((acc: Record<string, any>, p) => {
      acc[p.user_id] = p;
      return acc;
    }, {});

    const roleMap = (roles || []).reduce((acc: Record<string, string>, r) => {
      acc[r.user_id] = r.role;
      return acc;
    }, {});

    const formattedPosts: Post[] = (postsData || []).map((p) => ({
      id: p.id,
      content: p.content,
      author_id: p.author_id,
      author_name: profileMap[p.author_id]?.full_name || 'Unknown',
      author_avatar: profileMap[p.author_id]?.avatar_url,
      author_role: roleMap[p.author_id] === 'teacher' ? 'Teacher' : 'Student',
      category: p.category || 'school',
      image_url: p.image_url,
      likes_count: p.likes_count || 0,
      comments_count: p.comments_count || 0,
      created_at: p.created_at,
      liked_by_user: likedPostIds.has(p.id),
    }));

    setPosts(formattedPosts);
    setLoading(false);
  };

  const createPost = async () => {
    if (!newPostContent.trim() || !user) return;
    setPosting(true);

    const { error } = await supabase.from('community_posts').insert({
      author_id: user.id,
      content: newPostContent.trim(),
      category: activeTab,
    });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to create post. Please try again.',
        variant: 'destructive',
      });
      setPosting(false);
      return;
    }

    toast({
      title: 'Success',
      description: 'Post created successfully!',
    });

    setNewPostContent('');
    setPosting(false);
    fetchPosts();
  };

  const toggleLike = async (postId: string, isLiked: boolean) => {
    if (!user) return;

    if (isLiked) {
      // Unlike
      await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', user.id);

      // Update local state
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, liked_by_user: false, likes_count: p.likes_count - 1 } : p
        )
      );

      // Update post likes_count
      await supabase
        .from('community_posts')
        .update({ likes_count: posts.find((p) => p.id === postId)!.likes_count - 1 })
        .eq('id', postId);
    } else {
      // Like
      await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id });

      // Update local state
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, liked_by_user: true, likes_count: p.likes_count + 1 } : p
        )
      );

      // Update post likes_count
      await supabase
        .from('community_posts')
        .update({ likes_count: posts.find((p) => p.id === postId)!.likes_count + 1 })
        .eq('id', postId);
    }
  };

  const fetchComments = async (postId: string) => {
    const { data: commentsData, error } = await supabase
      .from('post_comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
      return;
    }

    // Get author profiles
    const authorIds = [...new Set((commentsData || []).map((c) => c.author_id))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('user_id, full_name, avatar_url')
      .in('user_id', authorIds);

    const profileMap = (profiles || []).reduce((acc: Record<string, any>, p) => {
      acc[p.user_id] = p;
      return acc;
    }, {});

    const formattedComments: Comment[] = (commentsData || []).map((c) => ({
      id: c.id,
      content: c.content,
      author_id: c.author_id,
      author_name: profileMap[c.author_id]?.full_name || 'Unknown',
      author_avatar: profileMap[c.author_id]?.avatar_url,
      created_at: c.created_at,
    }));

    setComments((prev) => ({ ...prev, [postId]: formattedComments }));
  };

  const toggleComments = (postId: string) => {
    if (expandedComments === postId) {
      setExpandedComments(null);
    } else {
      setExpandedComments(postId);
      if (!comments[postId]) {
        fetchComments(postId);
      }
    }
  };

  const addComment = async (postId: string) => {
    const commentContent = newComment[postId]?.trim();
    if (!commentContent || !user) return;

    const { error } = await supabase.from('post_comments').insert({
      post_id: postId,
      author_id: user.id,
      content: commentContent,
    });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to add comment. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    // Update comments count
    const post = posts.find((p) => p.id === postId);
    if (post) {
      await supabase
        .from('community_posts')
        .update({ comments_count: post.comments_count + 1 })
        .eq('id', postId);

      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, comments_count: p.comments_count + 1 } : p))
      );
    }

    setNewComment((prev) => ({ ...prev, [postId]: '' }));
    fetchComments(postId);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="font-heading text-3xl font-bold">
        {role === 'teacher' ? 'Teacher' : 'Student'} Community
      </h1>

      {/* Community Tabs */}
      <div className="flex flex-wrap gap-2">
        {communityTabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'outline'}
            onClick={() => setActiveTab(tab.id)}
            className="gap-2"
          >
            <tab.icon className="h-4 w-4" />
            {tab.name}
          </Button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Post Creator */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Create Post</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Avatar>
                <AvatarImage src={profile?.avatar_url || ''} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {profile?.full_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{profile?.full_name}</p>
                <p className="text-xs text-muted-foreground capitalize">{role}</p>
              </div>
            </div>
            <Textarea
              placeholder="What's on your mind? Share with your community..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <Image className="h-4 w-4 mr-1" />
                  Photo
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <Paperclip className="h-4 w-4 mr-1" />
                  File
                </Button>
              </div>
              <Button onClick={createPost} disabled={!newPostContent.trim() || posting}>
                <Send className="h-4 w-4 mr-2" />
                Post
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Feed */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-muted" />
                      <div className="space-y-2">
                        <div className="h-4 w-32 bg-muted rounded" />
                        <div className="h-3 w-24 bg-muted rounded" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-muted rounded" />
                      <div className="h-4 w-3/4 bg-muted rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No posts yet. Be the first to share something!</p>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-6">
                  {/* Post Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar>
                      <AvatarImage src={post.author_avatar || ''} />
                      <AvatarFallback className="bg-secondary text-primary">
                        {post.author_name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{post.author_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {post.author_role} • {formatTime(post.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* Post Content */}
                  <p className="text-sm mb-4 whitespace-pre-wrap">{post.content}</p>

                  {post.image_url && (
                    <img
                      src={post.image_url}
                      alt="Post attachment"
                      className="rounded-lg mb-4 max-h-80 object-cover w-full"
                    />
                  )}

                  {/* Post Actions */}
                  <div className="flex items-center gap-4 pt-4 border-t">
                    <button
                      className={`flex items-center gap-2 text-sm transition-colors ${
                        post.liked_by_user ? 'text-primary font-medium' : 'text-muted-foreground hover:text-primary'
                      }`}
                      onClick={() => toggleLike(post.id, post.liked_by_user)}
                    >
                      <ThumbsUp className={`h-4 w-4 ${post.liked_by_user ? 'fill-current' : ''}`} />
                      {post.likes_count} Likes
                    </button>
                    <button
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => toggleComments(post.id)}
                    >
                      <MessageCircle className="h-4 w-4" />
                      {post.comments_count} Comments
                    </button>
                  </div>

                  {/* Comments Section */}
                  {expandedComments === post.id && (
                    <div className="mt-4 pt-4 border-t space-y-4">
                      {comments[post.id]?.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.author_avatar || ''} />
                            <AvatarFallback className="bg-muted text-xs">
                              {comment.author_name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 bg-muted/50 rounded-lg p-3">
                            <p className="text-sm font-medium">{comment.author_name}</p>
                            <p className="text-sm">{comment.content}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatTime(comment.created_at)}
                            </p>
                          </div>
                        </div>
                      ))}

                      {/* Add Comment */}
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a comment..."
                          value={newComment[post.id] || ''}
                          onChange={(e) =>
                            setNewComment((prev) => ({ ...prev, [post.id]: e.target.value }))
                          }
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addComment(post.id);
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          onClick={() => addComment(post.id)}
                          disabled={!newComment[post.id]?.trim()}
                        >
                          Post
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
