import { useEffect } from 'react';
import { useNavigate, Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, TrendingUp, BookOpen, Calendar, FolderOpen, MessageSquare, Users, UserPlus, GraduationCap, LogOut, Menu, X, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';

const studentNav = [
  { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'performance', label: 'Performance Summary', icon: TrendingUp, path: '/dashboard/performance' },
  { id: 'assignments', label: 'Assignments Hub', icon: BookOpen, path: '/dashboard/assignments' },
  { id: 'attendance', label: 'Attendance Record', icon: ClipboardList, path: '/dashboard/attendance' },
  { id: 'files', label: 'My Files', icon: FolderOpen, path: '/dashboard/files' },
  { id: 'messenger', label: 'My Messenger', icon: MessageSquare, path: '/dashboard/messenger' },
  { id: 'community', label: 'Student Community', icon: Users, path: '/dashboard/community' },
  { id: 'friends', label: 'Friends & Peers', icon: UserPlus, path: '/dashboard/friends' },
];

const teacherNav = [
  { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'performance', label: 'Class Performance', icon: TrendingUp, path: '/dashboard/performance' },
  { id: 'assignments', label: 'Assignments Hub', icon: BookOpen, path: '/dashboard/assignments' },
  { id: 'attendance', label: 'Class Attendance', icon: ClipboardList, path: '/dashboard/attendance' },
  { id: 'files', label: 'My Files', icon: FolderOpen, path: '/dashboard/files' },
  { id: 'messenger', label: 'My Messenger', icon: MessageSquare, path: '/dashboard/messenger' },
  { id: 'community', label: 'Teacher Community', icon: Users, path: '/dashboard/community' },
  { id: 'colleagues', label: 'Colleagues', icon: UserPlus, path: '/dashboard/colleagues' },
];

export default function DashboardLayout() {
  const { user, profile, role, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  const navItems = role === 'teacher' ? teacherNav : studentNav;

  return (
    <div className="min-h-screen bg-muted flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-border">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <span className="font-heading text-sm font-bold">Port Moresby</span>
                <span className="block text-xs text-muted-foreground">National High School</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`dashboard-nav-item ${location.pathname === item.path ? 'active' : ''}`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-4">
              <Avatar>
                <AvatarImage src={profile?.avatar_url || ''} />
                <AvatarFallback className="bg-primary text-primary-foreground">{profile?.full_name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{profile?.full_name}</p>
                <p className="text-xs text-muted-foreground capitalize">{role}</p>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Mobile Header */}
        <header className="sticky top-0 z-40 lg:hidden bg-card border-b border-border p-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <span className="font-heading font-semibold">Dashboard</span>
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile?.avatar_url || ''} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">{profile?.full_name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}
