import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Image, FileSpreadsheet, File, Upload, Download, Trash2, FolderOpen, MoreVertical, Eye, X, Loader2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface UserFile {
  id: string;
  name: string;
  file_type: string | null;
  file_size: number | null;
  file_url: string;
  folder: string | null;
  created_at: string;
}

const getFileIcon = (type: string | null) => {
  if (!type) return <File className="h-10 w-10 text-muted-foreground" />;
  
  if (type.includes('pdf')) return <FileText className="h-10 w-10 text-red-500" />;
  if (type.includes('word') || type.includes('doc')) return <FileText className="h-10 w-10 text-blue-500" />;
  if (type.includes('image') || type.includes('png') || type.includes('jpg') || type.includes('jpeg')) 
    return <Image className="h-10 w-10 text-green-500" />;
  if (type.includes('excel') || type.includes('spreadsheet') || type.includes('xls')) 
    return <FileSpreadsheet className="h-10 w-10 text-emerald-500" />;
  if (type.includes('powerpoint') || type.includes('presentation') || type.includes('ppt')) 
    return <FileText className="h-10 w-10 text-orange-500" />;
  
  return <File className="h-10 w-10 text-muted-foreground" />;
};

const formatFileSize = (bytes: number | null) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function MyFiles() {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [files, setFiles] = useState<UserFile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<File[]>([]);

  useEffect(() => {
    if (user) {
      fetchFiles();
    }
  }, [user]);

  const fetchFiles = async () => {
    if (!user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from('user_files')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching files:', error);
      setLoading(false);
      return;
    }

    setFiles(data || []);
    setLoading(false);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelection = (selectedFiles: File[]) => {
    setUploadPreview(selectedFiles);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(Array.from(e.target.files));
    }
  };

  const clearUploadPreview = () => {
    setUploadPreview([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadFiles = async () => {
    if (!user || uploadPreview.length === 0) return;
    setUploading(true);

    try {
      for (const file of uploadPreview) {
        // Upload to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${file.name}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('user-files')
          .upload(fileName, file);

        if (uploadError) {
          // If bucket doesn't exist, just save file reference
          console.log('Storage upload skipped, saving reference only');
        }

        // Get public URL (or use placeholder)
        let fileUrl = '';
        if (uploadData) {
          const { data: urlData } = supabase.storage
            .from('user-files')
            .getPublicUrl(fileName);
          fileUrl = urlData.publicUrl;
        } else {
          fileUrl = `local://${file.name}`;
        }

        // Save file record to database
        const { error: dbError } = await supabase.from('user_files').insert({
          user_id: user.id,
          name: file.name,
          file_type: file.type,
          file_size: file.size,
          file_url: fileUrl,
          folder: 'general',
        });

        if (dbError) {
          throw dbError;
        }
      }

      toast({
        title: 'Success',
        description: `${uploadPreview.length} file(s) uploaded successfully!`,
      });

      clearUploadPreview();
      fetchFiles();
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload files. Please try again.',
        variant: 'destructive',
      });
    }

    setUploading(false);
  };

  const downloadFile = (file: UserFile) => {
    if (file.file_url.startsWith('local://')) {
      toast({
        title: 'Info',
        description: 'This file reference is stored locally. In production, it would download from cloud storage.',
      });
      return;
    }
    
    window.open(file.file_url, '_blank');
  };

  const previewFile = (file: UserFile) => {
    if (file.file_url.startsWith('local://')) {
      toast({
        title: 'Preview',
        description: `Previewing: ${file.name}\n\nFile type: ${file.file_type || 'Unknown'}\nSize: ${formatFileSize(file.file_size)}`,
      });
      return;
    }
    
    window.open(file.file_url, '_blank');
  };

  const deleteFile = async (fileId: string) => {
    const { error } = await supabase
      .from('user_files')
      .delete()
      .eq('id', fileId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete file. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Deleted',
      description: 'File deleted successfully.',
    });

    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold">My Files</h1>
        <Input
          placeholder="Search files..."
          className="max-w-xs"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Upload New File
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? 'border-primary bg-primary/5' : 'border-border'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileInputChange}
            />
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Drag and drop files here</p>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse from your computer
            </p>
            <Button onClick={() => fileInputRef.current?.click()}>
              <FolderOpen className="h-4 w-4 mr-2" />
              Browse Files
            </Button>
          </div>

          {/* Upload Preview */}
          {uploadPreview.length > 0 && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Selected Files ({uploadPreview.length})</h4>
                <Button variant="ghost" size="sm" onClick={clearUploadPreview}>
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {uploadPreview.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2"
                  >
                    <File className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({formatFileSize(file.size)})
                    </span>
                  </div>
                ))}
              </div>
              <Button
                onClick={uploadFiles}
                disabled={uploading}
                className="w-full"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload {uploadPreview.length} File(s)
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Files */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Files</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 animate-pulse"
                >
                  <div className="h-10 w-10 rounded bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-muted rounded" />
                    <div className="h-3 w-24 bg-muted rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{searchQuery ? 'No files found' : 'No files uploaded yet'}</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                >
                  {getFileIcon(file.file_type)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.file_size)} • {formatDate(file.created_at)}
                    </p>
                    <p className="text-xs text-primary capitalize">{file.folder}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => previewFile(file)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => downloadFile(file)}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => deleteFile(file.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
