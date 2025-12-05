"use client"

import { Menu, Bell, Settings } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface TopNavBarProps {
  onMenuToggle?: () => void
}

export function TopNavBar({ onMenuToggle }: TopNavBarProps) {
  return (
    <header className="border-b border-border bg-card sticky top-0 z-40">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Left: Menu + Title */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="" onClick={onMenuToggle}>
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-lg sm:text-xl font-semibold text-foreground text-pretty">Dashboard Institutionnel</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Vue globale - Performance étudiant</p>
          </div>
        </div>

        {/* Right: Actions + Avatar */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Bell className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Settings className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-border">
            <div className="hidden sm:flex flex-col text-right">
              <p className="text-sm font-medium text-foreground">Admin User</p>
              <p className="text-xs text-muted-foreground">Administrateur</p>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://avatar.vercel.sh/admin" />
              <AvatarFallback>AU</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  )
}
