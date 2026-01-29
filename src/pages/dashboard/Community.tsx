import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share2, Image, Smile, Send, MoreHorizontal } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const posts = [
  {
    id: 1,
    author: 'Sarah Mondo',
    avatar: '',
    role: 'Grade 11 Student',
    content: 'Just finished my science project on renewable energy! 🌱 So excited to present it next week. Anyone else working on similar topics?',
    time: '2 hours ago',
    likes: 24,
    comments: 8,
    liked: false,
  },
  {
    id: 2,
    author: 'John Wari',
    avatar: '',
    role: 'Grade 12 Student',
    content: 'Study group for math finals this Saturday at the library. Everyone is welcome! 📚',
    time: '5 hours ago',
    likes: 15,
    comments: 12,
    liked: true,
  },
  {
    id: 3,
    author: 'Peter Kila',
    avatar: '',
    role: 'Grade 10 Student',
    content: 'Congratulations to our basketball team for winning the inter-school championship! 🏀🏆',
    time: '1 day ago',
    likes: 89,
    comments: 34,
    liked: false,
  },
];

const categories = ['All Posts', 'Announcements', 'Study Groups', 'Events', 'General'];

export default function Community() {
  const { role } = useAuth();
  const [postContent, setPostContent] = useState('');
  const [activeTab, setActiveTab] = useState('All Posts');
  const [localPosts, setLocalPosts] = useState(posts);

  const handleLike = (postId: number) => {
    setLocalPosts(localPosts.map(p => 
      p.id === postId ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    ));
  };

  const communityTitle = role === 'teacher' ? 'Teacher Community' : 'Student Community';

  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="font-heading text-3xl font-bold">{communityTitle}</h1>

      {/* Community Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap gap-2 h-auto bg-transparent">
          {categories.map((cat) => (
            <TabsTrigger 
              key={cat} 
              value={cat}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 rounded-lg"
            >
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-6 space-y-6">
          {/* Post Creator */}
          <Card>
            <CardHeader><CardTitle>Create a Post</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Textarea 
                placeholder={`What's on your mind? Share with the ${role === 'teacher' ? 'teacher' : 'student'} community...`}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                rows={3}
              />
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm"><Image className="h-4 w-4 mr-1" />Photo</Button>
                  <Button variant="ghost" size="sm"><Smile className="h-4 w-4 mr-1" />Emoji</Button>
                </div>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={!postContent.trim()}>
                  <Send className="h-4 w-4 mr-2" />Post
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Feed */}
          <div className="space-y-4">
            {localPosts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-6">
                  {/* Post Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={post.avatar} />
                        <AvatarFallback className="bg-primary text-primary-foreground">{post.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{post.author}</p>
                        <p className="text-xs text-muted-foreground">{post.role} • {post.time}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                  </div>

                  {/* Post Content */}
                  <p className="text-foreground mb-4">{post.content}</p>

                  {/* Post Actions */}
                  <div className="flex items-center gap-6 pt-4 border-t border-border">
                    <button 
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-2 text-sm transition-colors ${post.liked ? 'text-red-500' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      <Heart className={`h-5 w-5 ${post.liked ? 'fill-current' : ''}`} />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <MessageCircle className="h-5 w-5" />
                      <span>{post.comments}</span>
                    </button>
                    <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <Share2 className="h-5 w-5" />
                      <span>Share</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
