import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, GraduationCap, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/academics', label: 'Academics' },
  { href: '/contact', label: 'Contact' },
];

export const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, profile, role, signOut } = useAuth();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <div className="hidden sm:block">
            <span className="font-heading text-lg font-bold">Port Moresby</span>
            <span className="block text-xs text-muted-foreground">National High School</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} to={link.href} className={`nav-link ${location.pathname === link.href ? 'text-primary' : ''}`}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={profile?.avatar_url || ''} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {profile?.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="font-medium">{profile?.full_name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{role}</p>
                </div>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="cursor-pointer"><User className="mr-2 h-4 w-4" />Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/auth">Sign In</Link>
            </Button>
          )}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t border-border bg-background p-4 animate-slide-in">
          {navLinks.map((link) => (
            <Link key={link.href} to={link.href} onClick={() => setMobileOpen(false)} className={`block py-2 font-medium ${location.pathname === link.href ? 'text-primary' : ''}`}>
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};
