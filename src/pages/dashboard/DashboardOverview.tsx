import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { TrendingUp, Users, BookOpen, Mail, Calendar, Trophy, Clock } from 'lucide-react';

const studentKpis = [
  { icon: TrendingUp, label: 'Current GPA', value: '3.75', change: '+0.15', color: 'text-green-500' },
  { icon: Calendar, label: 'Attendance Rate', value: '95%', change: '+2%', color: 'text-green-500' },
  { icon: Trophy, label: 'Class Rank', value: '12th', change: '↑3', color: 'text-green-500' },
  { icon: BookOpen, label: 'Pending Assignments', value: '4', change: 'Due soon', color: 'text-orange-500' },
  { icon: Mail, label: 'Unread Messages', value: '7', change: 'New', color: 'text-blue-500' },
  { icon: Clock, label: 'Upcoming Tests', value: '2', change: 'This week', color: 'text-purple-500' },
];

const teacherKpis = [
  { icon: Users, label: 'Total Students', value: '124', change: 'Active', color: 'text-blue-500' },
  { icon: TrendingUp, label: 'Class Avg GPA', value: '3.45', change: '+0.08', color: 'text-green-500' },
  { icon: Calendar, label: 'Class Attendance', value: '92%', change: 'This week', color: 'text-green-500' },
  { icon: BookOpen, label: 'Pending Grades', value: '18', change: 'To review', color: 'text-orange-500' },
  { icon: Mail, label: 'Unread Messages', value: '12', change: 'New', color: 'text-blue-500' },
  { icon: Trophy, label: 'Top Performers', value: '15', change: 'A+ students', color: 'text-purple-500' },
];

const recentActivity = [
  { text: 'Assignment "Math Quiz 5" graded', time: '2 hours ago', type: 'grade' },
  { text: 'New message from Mr. Kila', time: '3 hours ago', type: 'message' },
  { text: 'Attendance marked for Science class', time: '5 hours ago', type: 'attendance' },
  { text: 'Community post received 5 likes', time: '1 day ago', type: 'social' },
];

export default function DashboardOverview() {
  const { profile, role } = useAuth();
  const kpis = role === 'teacher' ? teacherKpis : studentKpis;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold">Welcome back, {profile?.full_name?.split(' ')[0]}!</h1>
        <p className="text-muted-foreground">Here's what's happening with your {role === 'teacher' ? 'classes' : 'studies'} today.</p>
      </div>

      {/* KPI Cards - Single Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, i) => (
          <Card key={i} className="kpi-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <kpi.icon className="h-5 w-5 text-primary" />
                <span className={`text-xs font-medium ${kpi.color}`}>{kpi.change}</span>
              </div>
              <div className="text-2xl font-bold font-heading">{kpi.value}</div>
              <div className="text-xs text-muted-foreground">{kpi.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardContent className="p-6">
          <h2 className="font-heading text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.text}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
