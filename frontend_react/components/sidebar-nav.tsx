"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Users, BookOpen, User, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { LogoutButton } from "@/components/auth/logout-button"

const navItems = [
  {
    title: "Vue globale (admin)",
    href: "/",
    icon: BarChart3,
  },
  {
    title: "Vue par filière / classe",
    href: "/dashboard/filiere",
    icon: Users,
  },
  {
    title: "Vue par cours",
    href: "/dashboard/cours",
    icon: BookOpen,
  },
  {
    title: "Vue par étudiant",
    href: "/dashboard/student",
    icon: User,
  },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col h-full">
      {/* Logo/Brand */}
      <div className="px-6 py-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sidebar-foreground text-sm hidden sm:inline">EduDash</span>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-muted",
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="hidden sm:inline">{item.title}</span>
            </Link>
          )
        })}
      </div>

      {/* Logout */}
      <div className="px-4 py-4 border-t border-sidebar-border">
        <LogoutButton />
      </div>
    </nav>
  )
}
