import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, FileText, Clock, CheckCircle, AlertCircle, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const studentAssignments = [
  { id: 1, title: 'Math Worksheet 5', subject: 'Mathematics', dueDate: 'Jan 25, 2025', status: 'pending', teacher: 'Mr. Kila' },
  { id: 2, title: 'Science Lab Report', subject: 'Science', dueDate: 'Jan 22, 2025', status: 'submitted', teacher: 'Dr. Mondo' },
  { id: 3, title: 'Essay Draft', subject: 'Literature', dueDate: 'Jan 20, 2025', status: 'graded', score: '92/100', teacher: 'Mrs. Wari' },
];

const teacherFiles = [
  { id: 1, title: 'Chapter 5 Notes', type: 'PDF', uploadedAt: 'Jan 18, 2025' },
  { id: 2, title: 'Practice Problems Set', type: 'PDF', uploadedAt: 'Jan 15, 2025' },
];

const submissions = [
  { id: 1, student: 'John Wari', assignment: 'Math Worksheet 5', submittedAt: 'Jan 20, 2025', status: 'pending' },
  { id: 2, student: 'Sarah Mondo', assignment: 'Math Worksheet 5', submittedAt: 'Jan 19, 2025', status: 'graded', score: '88/100' },
  { id: 3, student: 'Peter Kila', assignment: 'Math Worksheet 5', submittedAt: 'Jan 21, 2025', status: 'pending' },
];

export default function AssignmentsHub() {
  const { role } = useAuth();
  const [uploadMode, setUploadMode] = useState(false);

  const getStatusBadge = (status: string, score?: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline" className="text-orange-500 border-orange-500"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'submitted': return <Badge variant="outline" className="text-blue-500 border-blue-500"><Send className="h-3 w-3 mr-1" />Submitted</Badge>;
      case 'graded': return <Badge variant="outline" className="text-green-500 border-green-500"><CheckCircle className="h-3 w-3 mr-1" />{score}</Badge>;
      default: return <Badge variant="outline"><AlertCircle className="h-3 w-3 mr-1" />Unknown</Badge>;
    }
  };

  if (role === 'teacher') {
    return (
      <div className="animate-fade-in space-y-6">
        <h1 className="font-heading text-3xl font-bold">Assignments Hub</h1>
        <Tabs defaultValue="submissions">
          <TabsList><TabsTrigger value="submissions">Student Submissions</TabsTrigger><TabsTrigger value="upload">Upload Assignment</TabsTrigger></TabsList>
          <TabsContent value="submissions" className="mt-6">
            <Card>
              <CardHeader><CardTitle>Recent Submissions</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow><TableHead>Student</TableHead><TableHead>Assignment</TableHead><TableHead>Submitted</TableHead><TableHead>Status</TableHead><TableHead>Action</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium">{s.student}</TableCell>
                        <TableCell>{s.assignment}</TableCell>
                        <TableCell>{s.submittedAt}</TableCell>
                        <TableCell>{getStatusBadge(s.status, s.score)}</TableCell>
                        <TableCell><Button size="sm" variant="outline"><Download className="h-4 w-4 mr-1" />View</Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="upload" className="mt-6">
            <Card>
              <CardHeader><CardTitle>Upload New Assignment</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Assignment Title" />
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Drag and drop files here, or click to browse</p>
                  <Button variant="outline" className="mt-4">Browse Files</Button>
                </div>
                <Button className="w-full bg-primary text-primary-foreground">Upload Assignment</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="font-heading text-3xl font-bold">Assignments Hub</h1>
      <Tabs defaultValue="pending">
        <TabsList><TabsTrigger value="pending">Pending</TabsTrigger><TabsTrigger value="submitted">Submitted</TabsTrigger><TabsTrigger value="files">Teacher Files</TabsTrigger></TabsList>
        
        <TabsContent value="pending" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Pending Assignments</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Assignment</TableHead><TableHead>Subject</TableHead><TableHead>Due Date</TableHead><TableHead>Teacher</TableHead><TableHead>Action</TableHead></TableRow></TableHeader>
                <TableBody>
                  {studentAssignments.filter(a => a.status === 'pending').map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium"><FileText className="h-4 w-4 inline mr-2 text-primary" />{a.title}</TableCell>
                      <TableCell>{a.subject}</TableCell>
                      <TableCell>{a.dueDate}</TableCell>
                      <TableCell>{a.teacher}</TableCell>
                      <TableCell><Button size="sm" className="bg-primary text-primary-foreground"><Upload className="h-4 w-4 mr-1" />Submit</Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submitted" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Submitted Assignments</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Assignment</TableHead><TableHead>Subject</TableHead><TableHead>Due Date</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                <TableBody>
                  {studentAssignments.filter(a => a.status !== 'pending').map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium">{a.title}</TableCell>
                      <TableCell>{a.subject}</TableCell>
                      <TableCell>{a.dueDate}</TableCell>
                      <TableCell>{getStatusBadge(a.status, a.score)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Files from Teachers</CardTitle></CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {teacherFiles.map((f) => (
                  <div key={f.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                    <FileText className="h-10 w-10 text-primary" />
                    <div className="flex-1"><p className="font-medium">{f.title}</p><p className="text-xs text-muted-foreground">{f.type} • {f.uploadedAt}</p></div>
                    <Button size="sm" variant="outline"><Download className="h-4 w-4" /></Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
