"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Package,
  Users,
  BarChart2,
  Code,
  MessageCircle,
  HelpCircle,
  ChevronDown,
  LucideIcon,
} from "lucide-react";

interface MenuItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  isActive: boolean;
  hasDropdown?: boolean;
}

const MenuItem = ({
  icon: Icon,
  label,
  href,
  isActive,
  hasDropdown = false,
}: MenuItemProps) => {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center w-full px-4 py-3 text-sm rounded-lg transition-all duration-200 ${
          isActive
            ? "bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-lg"
            : "text-gray-700 hover:bg-gray-100 hover:shadow-md"
        }`}
      >
        <Icon className="w-5 h-5 mr-3" />
        <span className="flex-grow text-left">{label}</span>
        {hasDropdown && <ChevronDown className="w-4 h-4" />}
      </motion.div>
    </Link>
  );
};

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="w-64 h-screen bg-white shadow-xl flex flex-col"
    >
      <div className="p-6 border-b border-gray-200">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text flex items-center"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-8 h-8 mr-2"
            fill="url(#logo-gradient)"
          >
            <defs>
              <linearGradient
                id="logo-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          Vulcano Byte
        </motion.h1>
      </div>
      <nav className="flex-grow p-4 space-y-2">
        <MenuItem
          icon={LayoutDashboard}
          label="Dashboard"
          href="/"
          isActive={pathname === "/"}
        />

        <MenuItem
          icon={FileText}
          label="Quotes & Invoices"
          href="/Invoices"
          isActive={pathname === "/Invoices"}
        />
        <MenuItem
          icon={Package}
          label="Products & Services"
          href="/Inventory"
          isActive={pathname === "/Inventory"}
        />
        <MenuItem
          icon={Users}
          label="Clients"
          href="/Clients"
          isActive={pathname === "/Clients"}
        />
        <MenuItem
          icon={BarChart2}
          label="Management"
          href="/management"
          isActive={pathname === "/management"}
          hasDropdown
        />
        <MenuItem
          icon={Code}
          label="Development"
          href="/development"
          isActive={pathname === "/development"}
          hasDropdown
        />
      </nav>
      <div className="mt-auto border-t border-gray-200 p-4 space-y-2">
        <MenuItem
          icon={MessageCircle}
          label="My Advisor"
          href="/my-advisor"
          isActive={pathname === "/my-advisor"}
        />
        <MenuItem
          icon={HelpCircle}
          label="Help Center"
          href="/help-center"
          isActive={pathname === "/help-center"}
        />
      </div>
    </motion.aside>
  );
}
