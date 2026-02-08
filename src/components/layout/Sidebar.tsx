'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { 
  LayoutDashboard, 
  MessageSquare, 
  FolderKanban, 
  Package, 

  LogOut, 

  Tags,
  Wrench
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('adminToken');
    Cookies.remove('adminUser');
    router.push('/login');
  };

  // Menu Configuration
  const mainNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: MessageSquare, label: 'Inquiries', href: '/inquiries' },
  ];

  const contentNavItems = [
    { icon: FolderKanban, label: 'Projects', href: '/projects' },
    { icon: Package, label: 'Products', href: '/products' },
    { icon: Wrench, label: 'Services', href: '/services' },
    { icon: Tags, label: 'Categories', href: '/categories' },
  ];

  return (
    <aside className="h-screen w-72 bg-[#0f2a55] text-white flex flex-col shadow-2xl border-r border-[#1a3a6c]">
      
      {/* --- LOGO AREA --- */}
      <div className="p-6 pb-2">
        <div className="flex items-center gap-3">
            {/* You can replace this div with <Image /> if you have a logo file */}
            <div className="w-10 h-10 bg-hercules-gold rounded-lg flex items-center justify-center text-[#0f2a55] font-black text-xl shadow-lg">
                H
            </div>
            <div>
                <h1 className="text-lg font-bold font-serif tracking-wide leading-none">
                    HERCULES
                </h1>
                <p className="text-[10px] text-blue-300 uppercase tracking-[0.2em] font-medium mt-1">
                    Admin Panel
                </p>
            </div>
        </div>
      </div>

      <div className="px-6 my-4">
        <Separator className="bg-blue-800/50" />
      </div>

      {/* --- SCROLLABLE NAVIGATION --- */}
      <div className="flex-1 overflow-y-auto px-4 space-y-6">
        
        {/* Section 1: Main */}
        <div>
            <h3 className="px-4 text-xs font-bold text-blue-300 uppercase tracking-wider mb-2">Overview</h3>
            <nav className="space-y-1">
                {mainNavItems.map((item) => (
                    <NavItem key={item.href} {...item} isActive={pathname === item.href} />
                ))}
            </nav>
        </div>

        {/* Section 2: Content Management */}
        <div>
            <h3 className="px-4 text-xs font-bold text-blue-300 uppercase tracking-wider mb-2">Content Manager</h3>
            <nav className="space-y-1">
                {contentNavItems.map((item) => (
                    <NavItem key={item.href} {...item} isActive={pathname.startsWith(item.href)} />
                ))}
            </nav>
        </div>

      </div>

      {/* --- USER FOOTER --- */}
      <div className="p-4 mt-auto bg-[#0a1e3f]">
        <div className="flex items-center gap-3 mb-4 px-2">
            <Avatar className="h-10 w-10 border-2 border-blue-400/30">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold truncate">Admin User</p>
                <p className="text-xs text-blue-300 truncate">admin@hercules.com</p>
            </div>
        </div>
        
        <Button 
            onClick={handleLogout} 
            variant="destructive" 
            className="w-full justify-start pl-4 bg-red-600/10 hover:bg-red-600/90 text-red-200 hover:text-white border border-red-900/50"
        >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
        </Button>
      </div>

    </aside>
  );
}

// --- HELPER COMPONENT FOR LINKS ---
function NavItem({ icon: Icon, label, href, isActive }: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; href: string; isActive: boolean; }) {
    return (
        <Link 
            href={href}
            className={`
                group flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive 
                    ? 'bg-hercules-gold text-white shadow-md translate-x-1'  // Changed text-[#0f2a55] to text-white
                    : 'text-blue-100/80 hover:bg-white/10 hover:text-white'
                }
            `}
        >
            <Icon 
              size={18} 
              className={`${isActive ? 'text-white' : 'text-blue-300 group-hover:text-white'}`} // Changed icon color to match
            />
            {label}
        </Link>
    );
}