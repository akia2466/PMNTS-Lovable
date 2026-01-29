import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Image, FileSpreadsheet, File, Upload, Download, Trash2, FolderOpen, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const recentFiles = [
  { id: 1, name: 'Math Assignment 5.pdf', type: 'pdf', size: '2.4 MB', date: 'Jan 20, 2025', folder: 'Assignments' },
  { id: 2, name: 'Science Project.docx', type: 'doc', size: '1.8 MB', date: 'Jan 18, 2025', folder: 'Projects' },
  { id: 3, name: 'Class Photo.jpg', type: 'image', size: '3.2 MB', date: 'Jan 15, 2025', folder: 'Photos' },
  { id: 4, name: 'Grades Tracker.xlsx', type: 'excel', size: '856 KB', date: 'Jan 12, 2025', folder: 'Documents' },
  { id: 5, name: 'History Notes.pdf', type: 'pdf', size: '1.1 MB', date: 'Jan 10, 2025', folder: 'Notes' },
  { id: 6, name: 'Presentation.pptx', type: 'doc', size: '4.5 MB', date: 'Jan 8, 2025', folder: 'Projects' },
];

const getFileIcon = (type: string) => {
  switch (type) {
    case 'pdf': return <FileText className="h-10 w-10 text-red-500" />;
    case 'doc': return <FileText className="h-10 w-10 text-blue-500" />;
    case 'image': return <Image className="h-10 w-10 text-green-500" />;
    case 'excel': return <FileSpreadsheet className="h-10 w-10 text-emerald-500" />;
    default: return <File className="h-10 w-10 text-muted-foreground" />;
  }
};

export default function MyFiles() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const filteredFiles = recentFiles.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold">My Files</h1>
        <Input placeholder="Search files..." className="max-w-xs" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Upload className="h-5 w-5 text-primary" />Upload New File</CardTitle></CardHeader>
        <CardContent>
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive ? 'border-primary bg-primary/5' : 'border-border'}`}
            onDragEnter={() => setDragActive(true)}
            onDragLeave={() => setDragActive(false)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => setDragActive(false)}
          >
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Drag and drop files here</p>
            <p className="text-sm text-muted-foreground mb-4">or click to browse from your computer</p>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <FolderOpen className="h-4 w-4 mr-2" />Browse Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Files */}
      <Card>
        <CardHeader><CardTitle>Recent Files</CardTitle></CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFiles.map((file) => (
              <div key={file.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors group">
                {getFileIcon(file.type)}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{file.size} • {file.date}</p>
                  <p className="text-xs text-primary">{file.folder}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem><Download className="h-4 w-4 mr-2" />Download</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
          {filteredFiles.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No files found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
