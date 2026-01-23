import { Card, CardContent } from '@/components/ui/card';
import { Target, Eye, Heart, Users, Award, BookOpen } from 'lucide-react';

const values = [
  { icon: Target, title: 'Excellence', desc: 'Striving for the highest standards in all endeavors.' },
  { icon: Heart, title: 'Integrity', desc: 'Acting with honesty and ethical principles.' },
  { icon: Users, title: 'Community', desc: 'Building strong relationships and mutual respect.' },
  { icon: Award, title: 'Innovation', desc: 'Embracing creativity and forward thinking.' },
];

export default function About() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="bg-secondary py-16">
        <div className="container">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-secondary-foreground mb-4">
            About <span className="text-gradient-gold">Our School</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl">Discover our rich history, mission, and the values that guide our educational excellence.</p>
        </div>
      </section>

      {/* History */}
      <section className="py-16">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-3xl font-bold mb-6">Our History</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>Founded in 1957, Port Moresby National High School has been a cornerstone of education in Papua New Guinea for over six decades.</p>
                <p>What began as a small institution has grown into one of the nation's premier educational establishments, serving thousands of students and producing graduates who have become leaders in every sector.</p>
                <p>Our alumni network spans across the globe, with graduates excelling in government, business, medicine, law, and countless other fields.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-primary text-primary-foreground"><CardContent className="p-6 text-center"><div className="text-4xl font-bold">1957</div><div className="text-sm">Year Founded</div></CardContent></Card>
              <Card className="bg-secondary text-secondary-foreground"><CardContent className="p-6 text-center"><div className="text-4xl font-bold text-primary">50K+</div><div className="text-sm">Alumni</div></CardContent></Card>
              <Card className="bg-secondary text-secondary-foreground"><CardContent className="p-6 text-center"><div className="text-4xl font-bold text-primary">150+</div><div className="text-sm">Staff Members</div></CardContent></Card>
              <Card className="bg-primary text-primary-foreground"><CardContent className="p-6 text-center"><div className="text-4xl font-bold">25+</div><div className="text-sm">Programs</div></CardContent></Card>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-muted">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="card-hover">
              <CardContent className="p-8">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Target className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-heading text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-muted-foreground">To provide quality education that empowers students with knowledge, skills, and values necessary for personal growth and contribution to society. We are committed to nurturing well-rounded individuals who are prepared to meet the challenges of a rapidly changing world.</p>
              </CardContent>
            </Card>
            <Card className="card-hover">
              <CardContent className="p-8">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Eye className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-heading text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-muted-foreground">To be the leading educational institution in Papua New Guinea, recognized for academic excellence, innovative teaching, and the development of responsible citizens who contribute positively to national and global communities.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16">
        <div className="container">
          <h2 className="font-heading text-3xl font-bold text-center mb-12">Our Core Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <Card key={i} className="card-hover text-center">
                <CardContent className="p-6">
                  <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-full bg-primary/10 mb-4">
                    <v.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h4 className="font-heading font-semibold text-lg mb-2">{v.title}</h4>
                  <p className="text-sm text-muted-foreground">{v.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Principal's Message */}
      <section className="py-16 bg-secondary">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-6">
              <BookOpen className="h-12 w-12 text-primary" />
            </div>
            <h2 className="font-heading text-3xl font-bold text-secondary-foreground mb-4">Principal's Message</h2>
            <blockquote className="text-lg text-muted-foreground italic mb-4">
              "Education is not just about acquiring knowledge; it's about developing character, building relationships, and preparing for a life of purpose. At Port Moresby National High School, we are committed to nurturing the leaders of tomorrow."
            </blockquote>
            <p className="font-semibold text-primary">Dr. James Koroma</p>
            <p className="text-sm text-muted-foreground">Principal, Port Moresby National High School</p>
          </div>
        </div>
      </section>
    </div>
  );
}
