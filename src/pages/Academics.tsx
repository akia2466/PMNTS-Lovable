import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FlaskConical, Calculator, BookText, Laptop, Music, Palette, Users, Phone } from 'lucide-react';

const departments = [
  { id: 'science', name: 'Science', icon: FlaskConical, courses: ['Biology', 'Chemistry', 'Physics', 'Environmental Science'], head: 'Dr. Sarah Mondo', ext: '101' },
  { id: 'math', name: 'Mathematics', icon: Calculator, courses: ['Algebra', 'Geometry', 'Calculus', 'Statistics'], head: 'Mr. Peter Kila', ext: '102' },
  { id: 'humanities', name: 'Humanities', icon: BookText, courses: ['History', 'Geography', 'Economics', 'Social Studies'], head: 'Mrs. Anna Wari', ext: '103' },
  { id: 'tech', name: 'Technology', icon: Laptop, courses: ['Computer Science', 'IT Applications', 'Digital Media', 'Web Development'], head: 'Mr. David Raga', ext: '104' },
  { id: 'arts', name: 'Arts', icon: Palette, courses: ['Visual Arts', 'Drama', 'Creative Writing', 'Design'], head: 'Mrs. Grace Bai', ext: '105' },
  { id: 'music', name: 'Music', icon: Music, courses: ['Music Theory', 'Instrumental', 'Choir', 'Traditional Music'], head: 'Mr. John Tau', ext: '106' },
];

const programs = [
  { title: 'Grade 9-10 Foundation', desc: 'Building strong academic foundations across core subjects.', duration: '2 Years' },
  { title: 'Grade 11-12 Senior', desc: 'Specialized pathways preparing students for higher education.', duration: '2 Years' },
  { title: 'STEM Excellence', desc: 'Advanced science and technology focused curriculum.', duration: 'Elective' },
  { title: 'Arts & Humanities', desc: 'Creative and social sciences specialization track.', duration: 'Elective' },
];

export default function Academics() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="bg-secondary py-16">
        <div className="container">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-secondary-foreground mb-4">
            <span className="text-gradient-gold">Academic</span> Programs
          </h1>
          <p className="text-muted-foreground max-w-2xl">Explore our comprehensive curriculum designed to prepare students for success in higher education and beyond.</p>
        </div>
      </section>

      {/* Programs */}
      <section className="py-16">
        <div className="container">
          <h2 className="font-heading text-3xl font-bold mb-8">Our Programs</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map((p, i) => (
              <Card key={i} className="card-hover">
                <CardContent className="p-6">
                  <div className="text-xs font-medium text-primary mb-2">{p.duration}</div>
                  <h3 className="font-heading font-semibold text-lg mb-2">{p.title}</h3>
                  <p className="text-sm text-muted-foreground">{p.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="py-16 bg-muted">
        <div className="container">
          <h2 className="font-heading text-3xl font-bold mb-8">Departments</h2>
          <Tabs defaultValue="science" className="w-full">
            <TabsList className="flex flex-wrap gap-2 h-auto bg-transparent mb-6">
              {departments.map((d) => (
                <TabsTrigger key={d.id} value={d.id} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 rounded-lg">
                  <d.icon className="h-4 w-4 mr-2" />{d.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {departments.map((d) => (
              <TabsContent key={d.id} value={d.id}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <d.icon className="h-6 w-6 text-primary" />
                      {d.name} Department
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Courses Offered</h4>
                        <ul className="space-y-2">
                          {d.courses.map((c, i) => (
                            <li key={i} className="flex items-center gap-2 text-muted-foreground">
                              <div className="w-2 h-2 rounded-full bg-primary" />{c}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Users className="h-5 w-5 text-primary" />
                          <div>
                            <div className="text-sm text-muted-foreground">Department Head</div>
                            <div className="font-medium">{d.head}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-primary" />
                          <div>
                            <div className="text-sm text-muted-foreground">Extension</div>
                            <div className="font-medium">Ext. {d.ext}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Faculty */}
      <section className="py-16">
        <div className="container">
          <h2 className="font-heading text-3xl font-bold mb-8">Faculty Directory</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((d, i) => (
              <Card key={i} className="card-hover">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <d.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{d.head}</h4>
                    <p className="text-sm text-muted-foreground">{d.name} Department</p>
                    <p className="text-xs text-primary">Ext. {d.ext}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
