import { Link } from 'react-router-dom';
import { GraduationCap, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <span className="font-heading text-lg font-bold text-primary">Port Moresby</span>
                <span className="block text-xs">National High School</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Empowering students with knowledge, skills, and values for a brighter future since 1957.</p>
          </div>

          <div>
            <h3 className="font-heading font-semibold mb-4 text-primary">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/academics" className="hover:text-primary transition-colors">Academics</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/auth" className="hover:text-primary transition-colors">Student/Staff Login</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold mb-4 text-primary">Contact Info</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-primary" /><span>Ward Strip, Konedobu, Port Moresby, NCD, Papua New Guinea</span></li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /><span>+675 321 2345</span></li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /><span>info@pmnhs.edu.pg</span></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold mb-4 text-primary">Follow Us</h3>
            <div className="flex gap-3">
              <a href="#" className="h-10 w-10 flex items-center justify-center rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="h-10 w-10 flex items-center justify-center rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="h-10 w-10 flex items-center justify-center rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="h-10 w-10 flex items-center justify-center rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"><Youtube className="h-5 w-5" /></a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-muted py-4">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Port Moresby National High School. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
