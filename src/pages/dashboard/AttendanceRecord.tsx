import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, CheckCircle, XCircle, Clock, AlertTriangle, FileText, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AttendanceRecord {
  id: string;
  date: string;
  status: string;
  course_id: string;
  course_name?: string;
  notes: string | null;
}

interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
}

interface SubjectAttendance {
  course_id: string;
  course_name: string;
  present: number;
  total: number;
  percentage: number;
}

export default function AttendanceRecord() {
  const { user, role } = useAuth();
  const { toast } = useToast();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState<AttendanceStats>({ total: 0, present: 0, absent: 0, late: 0, percentage: 0 });
  const [subjectAttendance, setSubjectAttendance] = useState<SubjectAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Excuse form state
  const [excuseType, setExcuseType] = useState('');
  const [excuseDate, setExcuseDate] = useState('');
  const [excuseReason, setExcuseReason] = useState('');
  const [submittingExcuse, setSubmittingExcuse] = useState(false);

  const isTeacher = role === 'teacher';

  useEffect(() => {
    if (user) {
      fetchAttendance();
    }
  }, [user]);

  const fetchAttendance = async () => {
    if (!user) return;
    setLoading(true);

    // Fetch attendance records
    const { data: attendanceData, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('student_id', user.id)
      .order('date', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching attendance:', error);
      setLoading(false);
      return;
    }

    // Get course names
    const courseIds = [...new Set((attendanceData || []).map((a) => a.course_id))];
    const { data: courses } = await supabase
      .from('courses')
      .select('id, name')
      .in('id', courseIds);

    const courseMap = (courses || []).reduce((acc: Record<string, string>, c) => {
      acc[c.id] = c.name;
      return acc;
    }, {});

    const formattedRecords: AttendanceRecord[] = (attendanceData || []).map((a) => ({
      ...a,
      course_name: courseMap[a.course_id] || 'Unknown Course',
    }));

    setRecords(formattedRecords);

    // Calculate stats
    const total = formattedRecords.length;
    const present = formattedRecords.filter((r) => r.status === 'present').length;
    const absent = formattedRecords.filter((r) => r.status === 'absent').length;
    const late = formattedRecords.filter((r) => r.status === 'late').length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    setStats({ total, present, absent, late, percentage });

    // Calculate subject-wise attendance
    const subjectMap: Record<string, { present: number; total: number; name: string }> = {};
    formattedRecords.forEach((r) => {
      if (!subjectMap[r.course_id]) {
        subjectMap[r.course_id] = { present: 0, total: 0, name: r.course_name || '' };
      }
      subjectMap[r.course_id].total++;
      if (r.status === 'present' || r.status === 'late') {
        subjectMap[r.course_id].present++;
      }
    });

    const subjectStats: SubjectAttendance[] = Object.entries(subjectMap).map(([id, data]) => ({
      course_id: id,
      course_name: data.name,
      present: data.present,
      total: data.total,
      percentage: data.total > 0 ? Math.round((data.present / data.total) * 100) : 0,
    }));

    setSubjectAttendance(subjectStats);
    setLoading(false);
  };

  const submitExcuse = async () => {
    if (!excuseType || !excuseDate || !excuseReason.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setSubmittingExcuse(true);

    // In a real app, this would submit to a dedicated excuse requests table
    // For now, we'll show a success message
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: 'Excuse Submitted',
      description: `Your ${excuseType} excuse for ${new Date(excuseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} has been submitted for review.`,
    });

    setExcuseType('');
    setExcuseDate('');
    setExcuseReason('');
    setSubmittingExcuse(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="h-3 w-3" />
            Present
          </span>
        );
      case 'absent':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <XCircle className="h-3 w-3" />
            Absent
          </span>
        );
      case 'late':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            <Clock className="h-3 w-3" />
            Late
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="font-heading text-3xl font-bold">
        {isTeacher ? 'Class Attendance' : 'Attendance Record'}
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Days</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.present}</p>
                <p className="text-xs text-muted-foreground">Present</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.absent}</p>
                <p className="text-xs text-muted-foreground">Absent</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.late}</p>
                <p className="text-xs text-muted-foreground">Late</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Subject-wise Attendance */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Subject Attendance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 w-24 bg-muted rounded mb-2" />
                    <div className="h-2 w-full bg-muted rounded" />
                  </div>
                ))}
              </div>
            ) : subjectAttendance.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No attendance records yet
              </p>
            ) : (
              subjectAttendance.map((subject) => (
                <div key={subject.course_id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{subject.course_name}</span>
                    <span className={subject.percentage >= 75 ? 'text-green-600' : 'text-red-600'}>
                      {subject.percentage}%
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        subject.percentage >= 75 ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${subject.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {subject.present}/{subject.total} classes
                  </p>
                </div>
              ))
            )}

            {/* Overall Attendance */}
            <div className="pt-4 border-t">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold">Overall Attendance</span>
                <span className={`font-bold ${stats.percentage >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.percentage}%
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    stats.percentage >= 75 ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${stats.percentage}%` }}
                />
              </div>
              {stats.percentage < 75 && (
                <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Below 75% minimum requirement
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Attendance */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Recent Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg animate-pulse">
                    <div className="h-4 w-32 bg-muted rounded" />
                    <div className="h-4 w-16 bg-muted rounded" />
                    <div className="h-4 w-24 bg-muted rounded" />
                  </div>
                ))}
              </div>
            ) : records.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No attendance records found
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Date</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Subject</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record) => (
                      <tr key={record.id} className="border-b last:border-0">
                        <td className="py-3 px-2 text-sm">{formatDate(record.date)}</td>
                        <td className="py-3 px-2 text-sm">{record.course_name}</td>
                        <td className="py-3 px-2">{getStatusBadge(record.status)}</td>
                        <td className="py-3 px-2 text-sm text-muted-foreground">
                          {record.notes || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Submit Excuse Form (Students Only) */}
      {!isTeacher && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Submit Excuse
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="excuseType">Excuse Type *</Label>
                <Select value={excuseType} onValueChange={setExcuseType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medical">Medical Leave</SelectItem>
                    <SelectItem value="family">Family Emergency</SelectItem>
                    <SelectItem value="school">School Activity</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="excuseDate">Date *</Label>
                <Input
                  id="excuseDate"
                  type="date"
                  value={excuseDate}
                  onChange={(e) => setExcuseDate(e.target.value)}
                />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Label htmlFor="excuseReason">Reason *</Label>
                <Textarea
                  id="excuseReason"
                  placeholder="Please provide details about your absence..."
                  value={excuseReason}
                  onChange={(e) => setExcuseReason(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <div className="sm:col-span-2">
                <Button onClick={submitExcuse} disabled={submittingExcuse}>
                  <Send className="h-4 w-4 mr-2" />
                  {submittingExcuse ? 'Submitting...' : 'Submit Excuse'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
