"use client";

import Link from "next/link";
import { 
  LayoutDashboard, 
  Mail, 
  Phone, 
  CreditCard, 
  Settings, 
  Receipt,
  Shield
} from "lucide-react";
import { SidebarItem } from "@/components/ui/SidebarItem";
import { Logo } from "@/components/landing/Navbar";

export function Sidebar() {
  return (
    <div className="flex h-full w-64 flex-col bg-slate-900 border-r border-slate-800">
      <div className="flex h-16 items-center px-6 border-b border-slate-800">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-indigo-500" />
          <span className="text-xl font-bold text-white tracking-tight">Veil</span>
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        <SidebarItem 
          href="/dashboard" 
          icon={LayoutDashboard} 
          label="Overview" 
        />
        <SidebarItem 
          href="/dashboard/aliases" 
          icon={Mail} 
          label="Email Aliases" 
        />
        <SidebarItem 
          href="/dashboard/numbers" 
          icon={Phone} 
          label="Phone Numbers" 
        />
        <SidebarItem 
          href="/dashboard/cards" 
          icon={CreditCard} 
          label="Virtual Cards" 
        />
      </div>

      <div className="p-4 border-t border-slate-800 space-y-2">
        <SidebarItem 
          href="/dashboard/billing" 
          icon={Receipt} 
          label="Billing" 
        />
        <SidebarItem 
          href="/dashboard/settings" 
          icon={Settings} 
          label="Settings" 
        />
      </div>
    </div>
  );
}
