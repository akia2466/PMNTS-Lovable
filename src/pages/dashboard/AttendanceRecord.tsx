import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

const studentAttendance = [
  { date: 'Jan 22, 2025', subject: 'Mathematics', status: 'present', time: '8:00 AM' },
  { date: 'Jan 22, 2025', subject: 'Science', status: 'present', time: '10:00 AM' },
  { date: 'Jan 21, 2025', subject: 'Literature', status: 'late', time: '9:15 AM' },
  { date: 'Jan 21, 2025', subject: 'Social Science', status: 'present', time: '11:00 AM' },
  { date: 'Jan 20, 2025', subject: 'Mathematics', status: 'absent', time: '-' },
];

const subjectAttendance = [
  { subject: 'Mathematics', present: 18, total: 20, percentage: 90 },
  { subject: 'Science', present: 19, total: 20, percentage: 95 },
  { subject: 'Literature', present: 17, total: 20, percentage: 85 },
  { subject: 'Social Science', present: 20, total: 20, percentage: 100 },
];

const classAttendance = [
  { student: 'John Wari', present: 38, total: 40, percentage: 95 },
  { student: 'Sarah Mondo', present: 36, total: 40, percentage: 90 },
  { student: 'Peter Kila', present: 32, total: 40, percentage: 80 },
  { student: 'Anna Raga', present: 40, total: 40, percentage: 100 },
];

export default function AttendanceRecord() {
  const { role } = useAuth();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present': return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Present</Badge>;
      case 'absent': return <Badge className="bg-red-500"><XCircle className="h-3 w-3 mr-1" />Absent</Badge>;
      case 'late': return <Badge className="bg-orange-500"><Clock className="h-3 w-3 mr-1" />Late</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (role === 'teacher') {
    return (
      <div className="animate-fade-in space-y-6">
        <h1 className="font-heading text-3xl font-bold">Class Attendance</h1>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-green-500">92%</div><div className="text-sm text-muted-foreground">Overall Attendance</div></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-blue-500">124</div><div className="text-sm text-muted-foreground">Total Students</div></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-orange-500">8</div><div className="text-sm text-muted-foreground">Absent Today</div></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-red-500">3</div><div className="text-sm text-muted-foreground">At Risk Students</div></CardContent></Card>
        </div>

        {/* Student Attendance */}
        <Card>
          <CardHeader><CardTitle>Student Attendance Overview</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Present</TableHead><TableHead>Total</TableHead><TableHead>Rate</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>
                {classAttendance.map((s, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{s.student}</TableCell>
                    <TableCell>{s.present}</TableCell>
                    <TableCell>{s.total}</TableCell>
                    <TableCell><div className="flex items-center gap-2"><Progress value={s.percentage} className="w-20 h-2" /><span className="text-sm">{s.percentage}%</span></div></TableCell>
                    <TableCell>{s.percentage >= 90 ? <Badge className="bg-green-500">Good</Badge> : s.percentage >= 80 ? <Badge className="bg-orange-500">Warning</Badge> : <Badge className="bg-red-500">At Risk</Badge>}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="font-heading text-3xl font-bold">Attendance Record</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-green-500">95%</div><div className="text-sm text-muted-foreground">Overall Attendance</div></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-blue-500">38</div><div className="text-sm text-muted-foreground">Days Present</div></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-orange-500">2</div><div className="text-sm text-muted-foreground">Days Late</div></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-red-500">2</div><div className="text-sm text-muted-foreground">Days Absent</div></CardContent></Card>
      </div>

      {/* Subject-wise Attendance */}
      <Card>
        <CardHeader><CardTitle>Subject-wise Attendance</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjectAttendance.map((s, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-32 font-medium">{s.subject}</div>
                <Progress value={s.percentage} className="flex-1 h-3" />
                <div className="w-20 text-right text-sm">{s.present}/{s.total} ({s.percentage}%)</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Attendance */}
      <Card>
        <CardHeader><CardTitle>Recent Attendance</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Subject</TableHead><TableHead>Time</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {studentAttendance.map((a, i) => (
                <TableRow key={i}>
                  <TableCell>{a.date}</TableCell>
                  <TableCell>{a.subject}</TableCell>
                  <TableCell>{a.time}</TableCell>
                  <TableCell>{getStatusBadge(a.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
