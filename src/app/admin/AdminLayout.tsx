'use client';

import { useEffect, useState, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  MessageSquare, 
  FolderKanban, 
  Image,
  Package, 
  Loader2, 
  LucideIcon, 
  Wrench, 
  Menu, // New Import
  X,     // New Import
  Plane
} from 'lucide-react';

// --- Types ---
interface MenuItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

interface AdminLayoutProps {
  children: ReactNode;
}

// --- Menu Config ---
const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: MessageSquare, label: 'Enquiries', href: '/inquiries' },
  { icon: Plane, label: 'Packages', href: '/packages' }, 
  { icon: Image, label: 'Travel Gallery', href: '/gallery' }, 
  { icon: Wrench, label: 'Services', href: '/services' },
];


export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  
  // Auth State
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  
  // Mobile Menu State
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // 1. Logic to bypass auth check on Login page
  const isLoginPage = pathname === '/login' || pathname === '/admin/login';

  // Auth Check Effect
  useEffect(() => {
    if (isLoginPage) return; 

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        router.push('/login');
      } else {
        setIsAuthorized(true);
      }
    }
  }, [router, isLoginPage]);

  // Close mobile menu automatically when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      router.push('/login');
    }
  };

  // 2. Render Login Page immediately (No sidebar)
  if (isLoginPage) {
    return <>{children}</>;
  }

  // 3. Show Loader while checking auth
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <Loader2 className="animate-spin text-[#0f2a55] w-8 h-8" />
      </div>
    );
  }

  // 4. Main Layout
 return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      <aside className="w-64 bg-[#0f172a] text-white flex flex-col"> {/* Brand Dark Blue */}
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold tracking-wide text-white">
            HAPPY FEET<span className="text-orange-500">.</span> 
          </h1>
          <p className="text-xs text-blue-300 uppercase tracking-widest mt-1">Management Portal</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10">
              <item.icon size={20} className="text-orange-500" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-slate-50">{children}</main>
    </div>
  );

}