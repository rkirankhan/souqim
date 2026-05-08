import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Info, LayoutGrid, MessageSquare, LogOut, User, LayoutDashboard, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/lib/auth-context'

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Explore', path: '/browse' },
  { label: 'Categories', path: '/categories' },
  { label: 'About', path: '/about' },
]

function getInitials(name: string) {
  return name
    .split(/[\s@]+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, displayName, signOut, loading, isAdmin, hasListings } = useAuth()

  async function handleSignOut() {
    await signOut()
    navigate('/')
    setMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-card">
        <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <span
              className="text-xl font-medium text-primary"
              style={{ fontFamily: 'Fraunces, serif', letterSpacing: '-0.025em' }}
            >
              List<em className="italic font-medium">m</em>io
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {!loading && !user && (
              <>
                <Link
                  to="/signin"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:inline"
                >
                  Sign in
                </Link>
                <Button asChild size="sm" className="hidden sm:flex">
                  <Link to="/list">List your business for Free.</Link>
                </Button>
              </>
            )}

            {!loading && user && (
              <>
                {hasListings ? (
                  <Button asChild size="sm" variant="outline" className="hidden sm:flex rounded-full">
                    <Link to="/dashboard">
                      <LayoutDashboard className="size-4" />
                      Dashboard
                    </Link>
                  </Button>
                ) : (
                  <Button asChild size="sm" variant="outline" className="hidden sm:flex rounded-full">
                    <Link to="/list">List your business for Free.</Link>
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="hidden md:flex">
                    <button className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      <Avatar size="sm">
                        <AvatarFallback className="text-xs">{getInitials(displayName)}</AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel className="font-normal">
                      <p className="text-sm font-medium truncate">{displayName}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => navigate('/dashboard')}>
                      <LayoutDashboard className="size-4" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => navigate('/dashboard/account')}>
                      <User className="size-4" />
                      Account
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem onSelect={() => navigate('/admin')}>
                        <ShieldCheck className="size-4" />
                        Admin
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={handleSignOut}>
                      <LogOut className="size-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm">
                  {mobileMenuOpen ? (
                    <X className="size-5" />
                  ) : (
                    <Menu className="size-5" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] p-6">
                <nav className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-base font-medium transition-colors ${
                        location.pathname === item.path
                          ? 'text-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}

                  {!loading && user && (
                    <>
                      <div className="border-t pt-4 mt-2" />
                      <Link
                        to="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/dashboard/account"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Account
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                        >
                          <ShieldCheck className="size-4" /> Admin
                        </Link>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors text-left"
                      >
                        Sign out
                      </button>
                    </>
                  )}

                  {!loading && !user && (
                    <>
                      <div className="border-t pt-4 mt-2" />
                      <Link
                        to="/signin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Sign in
                      </Link>
                    </>
                  )}

                  <Button asChild className="mt-4">
                    <Link to="/list" onClick={() => setMobileMenuOpen(false)}>
                      List your business for Free.
                    </Link>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-16 text-white/70" style={{ backgroundColor: '#1D2939' }}>
        <div className="container max-w-7xl mx-auto px-4 pt-14 pb-8">
          {/* Top: link columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div>
              <h3
                className="font-medium mb-3 text-white inline-flex items-center gap-2"
                style={{ fontFamily: 'Fraunces, serif' }}
              >
                <Info className="size-4 text-white/50" />
                About
              </h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="text-white/60 hover:text-white transition-colors">About Listmio</Link></li>
                <li><Link to="/privacy" className="text-white/60 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-white/60 hover:text-white transition-colors">Terms</Link></li>
              </ul>
            </div>
            <div>
              <h3
                className="font-medium mb-3 text-white inline-flex items-center gap-2"
                style={{ fontFamily: 'Fraunces, serif' }}
              >
                <LayoutGrid className="size-4 text-white/50" />
                Categories
              </h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/browse?category=Food & Catering" className="text-white/60 hover:text-white transition-colors">Food & Drink</Link></li>
                <li><Link to="/browse?category=Beauty & Salon" className="text-white/60 hover:text-white transition-colors">Beauty & Wellness</Link></li>
                <li><Link to="/browse?category=Home Services" className="text-white/60 hover:text-white transition-colors">Home Services</Link></li>
                <li><Link to="/browse?women-led=true" className="text-white/60 hover:text-white transition-colors">Women-led businesses</Link></li>
              </ul>
            </div>
            <div>
              <h3
                className="font-medium mb-3 text-white inline-flex items-center gap-2"
                style={{ fontFamily: 'Fraunces, serif' }}
              >
                <MessageSquare className="size-4 text-white/50" />
                Support
              </h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/services" className="text-white/60 hover:text-white transition-colors">Services</Link></li>
                <li><Link to="/contact" className="text-white/60 hover:text-white transition-colors">Contact us</Link></li>
                <li><Link to="/faq" className="text-white/60 hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom: brand lockup + meta */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
            <div>
              <span
                className="text-[28px] text-white font-medium block leading-none"
                style={{ fontFamily: 'Fraunces, serif', letterSpacing: '-0.025em' }}
              >
                List<em className="italic font-medium">m</em>io
              </span>
              <span className="block text-xs text-white/40 mt-2 tracking-[0.02em]">
                UK's community business directory · © 2026
              </span>
            </div>
            <div className="text-xs text-white/40 sm:text-right">
              List your business. Be found by your community.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
