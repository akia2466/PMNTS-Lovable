import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';

const subjects = [
  { name: 'Mathematics', percentage: 88, grade: 'A', color: 'bg-blue-500' },
  { name: 'Science', percentage: 92, grade: 'A+', color: 'bg-green-500' },
  { name: 'Literature', percentage: 78, grade: 'B+', color: 'bg-purple-500' },
  { name: 'Social Science', percentage: 85, grade: 'A-', color: 'bg-orange-500' },
  { name: 'Technology', percentage: 95, grade: 'A+', color: 'bg-cyan-500' },
  { name: 'Arts', percentage: 82, grade: 'A-', color: 'bg-pink-500' },
];

const assessments = [
  { name: 'Math Quiz 5', subject: 'Mathematics', score: 45, max: 50, date: 'Jan 18, 2025' },
  { name: 'Science Lab Report', subject: 'Science', score: 92, max: 100, date: 'Jan 15, 2025' },
  { name: 'Essay: Modern Literature', subject: 'Literature', score: 38, max: 50, date: 'Jan 12, 2025' },
  { name: 'History Test', subject: 'Social Science', score: 85, max: 100, date: 'Jan 10, 2025' },
];

const classPerformance = [
  { student: 'John Wari', gpa: 3.92, attendance: '98%', rank: 1 },
  { student: 'Sarah Mondo', gpa: 3.85, attendance: '95%', rank: 2 },
  { student: 'Peter Kila', gpa: 3.78, attendance: '92%', rank: 3 },
  { student: 'Anna Raga', gpa: 3.72, attendance: '97%', rank: 4 },
];

export default function PerformanceSummary() {
  const { role } = useAuth();
  const [term, setTerm] = useState('term1');

  if (role === 'teacher') {
    return (
      <div className="animate-fade-in space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-3xl font-bold">Class Performance</h1>
          <Select value={term} onValueChange={setTerm}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="term1">Term 1</SelectItem>
              <SelectItem value="term2">Term 2</SelectItem>
              <SelectItem value="term3">Term 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Class Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[{ label: 'Class Average', value: '82%' }, { label: 'Highest Score', value: '98%' }, { label: 'Lowest Score', value: '45%' }, { label: 'Pass Rate', value: '94%' }].map((stat, i) => (
            <Card key={i}><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-primary">{stat.value}</div><div className="text-sm text-muted-foreground">{stat.label}</div></CardContent></Card>
          ))}
        </div>

        {/* Top Students */}
        <Card>
          <CardHeader><CardTitle>Top Performing Students</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>GPA</TableHead>
                  <TableHead>Attendance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classPerformance.map((student) => (
                  <TableRow key={student.rank}>
                    <TableCell className="font-medium">#{student.rank}</TableCell>
                    <TableCell>{student.student}</TableCell>
                    <TableCell>{student.gpa}</TableCell>
                    <TableCell>{student.attendance}</TableCell>
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
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold">Performance Summary</h1>
        <Select value={term} onValueChange={setTerm}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="term1">Term 1</SelectItem>
            <SelectItem value="term2">Term 2</SelectItem>
            <SelectItem value="term3">Term 3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Subject Cards - Single Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {subjects.map((subject, i) => (
          <Card key={i} className="subject-card">
            <CardContent className="p-4">
              <div className={`w-10 h-10 rounded-full ${subject.color} mx-auto mb-3 flex items-center justify-center text-white font-bold text-lg`}>
                {subject.grade}
              </div>
              <div className="text-2xl font-bold font-heading">{subject.percentage}%</div>
              <div className="text-xs text-muted-foreground mt-1">{subject.name}</div>
              <Progress value={subject.percentage} className="mt-2 h-1.5" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Assessments */}
      <Card>
        <CardHeader><CardTitle>Recent Assessments</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Assessment</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assessments.map((a, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{a.name}</TableCell>
                  <TableCell>{a.subject}</TableCell>
                  <TableCell>{a.score}/{a.max} ({Math.round(a.score / a.max * 100)}%)</TableCell>
                  <TableCell>{a.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
