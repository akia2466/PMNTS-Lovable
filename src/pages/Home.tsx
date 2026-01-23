import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Users, BookOpen, Trophy, Calendar, Bell, ArrowRight, Clock } from 'lucide-react';

const stats = [
  { icon: GraduationCap, label: 'Years Established', value: '67+' },
  { icon: Users, label: 'Students Enrolled', value: '2,500+' },
  { icon: BookOpen, label: 'Academic Programs', value: '25+' },
  { icon: Trophy, label: 'National Awards', value: '150+' },
];

const news = [
  { title: 'Academic Excellence Awards 2025', date: 'Jan 15, 2025', excerpt: 'Celebrating our top performing students across all departments.' },
  { title: 'New Science Laboratory Opening', date: 'Jan 10, 2025', excerpt: 'State-of-the-art facilities to enhance STEM education.' },
  { title: 'Inter-School Sports Championship', date: 'Jan 5, 2025', excerpt: 'Our athletes bring home gold in regional competitions.' },
];

const events = [
  { title: 'Open Day 2025', date: 'Feb 15', time: '9:00 AM - 3:00 PM' },
  { title: 'Parent-Teacher Conference', date: 'Feb 20', time: '2:00 PM - 5:00 PM' },
  { title: 'Science Fair', date: 'Mar 1', time: '10:00 AM - 4:00 PM' },
];

export default function Home() {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-secondary py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/95 to-secondary/80" />
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-secondary-foreground mb-6">
              Welcome to <span className="text-gradient-gold">Port Moresby</span> National High School
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Empowering the next generation of leaders through excellence in education, character development, and community engagement since 1957.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/academics">Explore Programs <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <Card key={i} className="card-hover text-center border-none shadow-lg">
                <CardContent className="pt-6">
                  <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-full bg-primary/10 mb-4">
                    <stat.icon className="h-7 w-7 text-primary" />
                  </div>
                  <div className="text-3xl font-heading font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* News & Events */}
      <section className="py-16">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* News */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <Bell className="h-6 w-6 text-primary" />
                <h2 className="font-heading text-2xl font-bold">Latest News</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {news.slice(0, 2).map((item, i) => (
                  <Card key={i} className="card-hover">
                    <CardContent className="p-6">
                      <div className="text-xs text-primary font-medium mb-2">{item.date}</div>
                      <h3 className="font-heading font-semibold text-lg mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.excerpt}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Events */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="h-6 w-6 text-primary" />
                <h2 className="font-heading text-2xl font-bold">Upcoming Events</h2>
              </div>
              <div className="space-y-4">
                {events.map((event, i) => (
                  <Card key={i} className="card-hover">
                    <CardContent className="p-4 flex gap-4">
                      <div className="w-14 h-14 flex flex-col items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
                        <div className="text-sm font-bold">{event.date.split(' ')[0]}</div>
                        <div className="text-xs">{event.date.split(' ')[1]}</div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{event.title}</h4>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <Clock className="h-3 w-3" />{event.time}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary">
        <div className="container text-center">
          <h2 className="font-heading text-3xl font-bold text-secondary-foreground mb-4">Ready to Join Our Community?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Take the first step towards excellence. Explore our programs and discover how we can help you achieve your goals.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/academics">View Programs</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <Link to="/auth">Apply Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
