import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, Database, GitMerge, Users, Box, Search, 
  Settings, Hexagon, BookOpen, BarChart2, FlaskConical, Target
} from 'lucide-react';

export function Sidebar({ isOpen, setIsOpen }: { isOpen?: boolean; setIsOpen?: any }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: <Home size={20} /> },
    { name: 'Datasets', href: '/dashboard/datasets', icon: <Database size={20} /> },
    { name: 'Workflows', href: '/dashboard/workflows', icon: <GitMerge size={20} /> },
    { name: 'Agents', href: '/dashboard/agents', icon: <Users size={20} /> },
    { name: 'Data Dictionary', href: '/dashboard/data-dictionary', icon: <BookOpen size={20} /> },
    { name: 'Data Insights', href: '/dashboard/data-insights', icon: <BarChart2 size={20} /> },
    { name: 'Data Lab', href: '/dashboard/data-lab', icon: <FlaskConical size={20} /> },
    { name: 'Models', href: '/dashboard/models', icon: <Box size={20} /> },
    { name: 'Predictions', href: '/dashboard/predictions', icon: <Target size={20} /> },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-[80px] bg-[#F8FAFC] border-r border-slate-200 flex flex-col items-center py-6 z-40 transition-all shadow-sm">
      {/* Logo */}
      <div className="mb-8">
        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
          <Hexagon size={24} fill="currentColor" className="text-emerald-500" />
          {/* Workaround for filled hexagon with white border/interior */}
          <div className="absolute">
            <Hexagon size={20} className="text-white" />
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <div className="flex-1 flex flex-col items-center gap-4 w-full">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} className="w-full flex justify-center">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                isActive 
                ? 'bg-[#0F172A] text-white shadow-lg shadow-slate-400/20' 
                : 'text-slate-400 hover:bg-white hover:text-[#0F172A] hover:shadow-sm'
              }`}>
                {item.icon}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bottom Nav */}
      <div className="mt-auto mb-4 w-full px-3">
        <Link 
          href="/dashboard/settings"
          className={`flex justify-center items-center w-12 h-12 rounded-xl text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-colors mx-auto ${pathname === '/dashboard/settings' ? 'bg-emerald-50 text-emerald-600' : ''}`}
          title="Settings"
        >
          <Settings size={20} />
        </Link>
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm mt-2 mx-auto">
          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" alt="User Avatar" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
}
