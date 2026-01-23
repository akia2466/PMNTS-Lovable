
-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('student', 'teacher', 'admin');

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    grade_level TEXT,
    department TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_roles table (separate for security)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Create courses table
CREATE TABLE public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    department TEXT NOT NULL,
    teacher_id UUID REFERENCES auth.users(id),
    credits INTEGER DEFAULT 3,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create enrollments table
CREATE TABLE public.enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    term TEXT NOT NULL,
    grade TEXT,
    percentage NUMERIC(5,2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (student_id, course_id, term)
);

-- Create assignments table
CREATE TABLE public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    teacher_id UUID REFERENCES auth.users(id) NOT NULL,
    due_date TIMESTAMPTZ,
    max_score NUMERIC(5,2) DEFAULT 100,
    file_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create submissions table
CREATE TABLE public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    file_url TEXT,
    score NUMERIC(5,2),
    feedback TEXT,
    status TEXT DEFAULT 'pending',
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    graded_at TIMESTAMPTZ,
    UNIQUE (assignment_id, student_id)
);

-- Create attendance table
CREATE TABLE public.attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'present',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (student_id, course_id, date)
);

-- Create messages table for chat
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create community_posts table
CREATE TABLE public.community_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    image_url TEXT,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    visibility TEXT DEFAULT 'all',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create post_likes table
CREATE TABLE public.post_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (post_id, user_id)
);

-- Create post_comments table
CREATE TABLE public.post_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE NOT NULL,
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create connections table (friends/colleagues)
CREATE TABLE public.connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    connected_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, connected_user_id)
);

-- Create connection_requests table
CREATE TABLE public.connection_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    to_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (from_user_id, to_user_id)
);

-- Create user_files table
CREATE TABLE public.user_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT,
    file_size INTEGER,
    folder TEXT DEFAULT 'general',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create contact_submissions table for public contact form
CREATE TABLE public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create announcements table
CREATE TABLE public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES auth.users(id),
    priority TEXT DEFAULT 'normal',
    visible_to TEXT DEFAULT 'all',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connection_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Create has_role function for RLS
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_community_posts_updated_at
    BEFORE UPDATE ON public.community_posts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for profiles
CREATE POLICY "Profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
    ON public.user_roles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own role on signup"
    ON public.user_roles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- RLS Policies for courses
CREATE POLICY "Courses are viewable by everyone"
    ON public.courses FOR SELECT
    USING (true);

CREATE POLICY "Teachers can manage their courses"
    ON public.courses FOR ALL
    USING (auth.uid() = teacher_id OR public.has_role(auth.uid(), 'admin'));

-- RLS Policies for enrollments
CREATE POLICY "Students can view their enrollments"
    ON public.enrollments FOR SELECT
    USING (auth.uid() = student_id OR public.has_role(auth.uid(), 'teacher'));

CREATE POLICY "Teachers can manage enrollments"
    ON public.enrollments FOR ALL
    USING (public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'admin'));

-- RLS Policies for assignments
CREATE POLICY "Assignments viewable by enrolled students and teachers"
    ON public.assignments FOR SELECT
    USING (true);

CREATE POLICY "Teachers can manage assignments"
    ON public.assignments FOR ALL
    USING (auth.uid() = teacher_id OR public.has_role(auth.uid(), 'admin'));

-- RLS Policies for submissions
CREATE POLICY "Students can view their submissions"
    ON public.submissions FOR SELECT
    USING (auth.uid() = student_id OR public.has_role(auth.uid(), 'teacher'));

CREATE POLICY "Students can insert their submissions"
    ON public.submissions FOR INSERT
    WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Teachers can update submissions"
    ON public.submissions FOR UPDATE
    USING (public.has_role(auth.uid(), 'teacher'));

-- RLS Policies for attendance
CREATE POLICY "Students can view their attendance"
    ON public.attendance FOR SELECT
    USING (auth.uid() = student_id OR public.has_role(auth.uid(), 'teacher'));

CREATE POLICY "Teachers can manage attendance"
    ON public.attendance FOR ALL
    USING (public.has_role(auth.uid(), 'teacher'));

-- RLS Policies for messages
CREATE POLICY "Users can view their messages"
    ON public.messages FOR SELECT
    USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages"
    ON public.messages FOR INSERT
    WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their sent messages"
    ON public.messages FOR UPDATE
    USING (auth.uid() = receiver_id);

-- RLS Policies for community_posts
CREATE POLICY "Posts viewable by authenticated users"
    ON public.community_posts FOR SELECT
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create posts"
    ON public.community_posts FOR INSERT
    WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their posts"
    ON public.community_posts FOR UPDATE
    USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their posts"
    ON public.community_posts FOR DELETE
    USING (auth.uid() = author_id);

-- RLS Policies for post_likes
CREATE POLICY "Likes viewable by authenticated users"
    ON public.post_likes FOR SELECT
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can like posts"
    ON public.post_likes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike posts"
    ON public.post_likes FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for post_comments
CREATE POLICY "Comments viewable by authenticated users"
    ON public.post_comments FOR SELECT
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can comment on posts"
    ON public.post_comments FOR INSERT
    WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can delete their comments"
    ON public.post_comments FOR DELETE
    USING (auth.uid() = author_id);

-- RLS Policies for connections
CREATE POLICY "Users can view their connections"
    ON public.connections FOR SELECT
    USING (auth.uid() = user_id OR auth.uid() = connected_user_id);

CREATE POLICY "Users can create connections"
    ON public.connections FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete connections"
    ON public.connections FOR DELETE
    USING (auth.uid() = user_id OR auth.uid() = connected_user_id);

-- RLS Policies for connection_requests
CREATE POLICY "Users can view their connection requests"
    ON public.connection_requests FOR SELECT
    USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users can send connection requests"
    ON public.connection_requests FOR INSERT
    WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "Users can update requests sent to them"
    ON public.connection_requests FOR UPDATE
    USING (auth.uid() = to_user_id);

CREATE POLICY "Users can delete their requests"
    ON public.connection_requests FOR DELETE
    USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

-- RLS Policies for user_files
CREATE POLICY "Users can view their files"
    ON public.user_files FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can upload files"
    ON public.user_files FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their files"
    ON public.user_files FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for contact_submissions (public can insert)
CREATE POLICY "Anyone can submit contact form"
    ON public.contact_submissions FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Staff can view contact submissions"
    ON public.contact_submissions FOR SELECT
    USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'teacher'));

-- RLS Policies for announcements
CREATE POLICY "Announcements viewable by everyone"
    ON public.announcements FOR SELECT
    USING (true);

CREATE POLICY "Staff can manage announcements"
    ON public.announcements FOR ALL
    USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'teacher'));

-- Create storage bucket for files
INSERT INTO storage.buckets (id, name, public) VALUES ('files', 'files', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Storage policies for files bucket
CREATE POLICY "Users can upload their own files"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view files"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'files');

CREATE POLICY "Users can delete their own files"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for avatars bucket
CREATE POLICY "Anyone can view avatars"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their avatar"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their avatar"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
