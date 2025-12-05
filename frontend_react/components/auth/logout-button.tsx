// New component for logout button in top navigation
"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_role")
    localStorage.removeItem("user_username")
    router.push("/auth/login")
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
      <LogOut className="w-4 h-4 mr-2" />
      Déconnexion
    </Button>
  )
}
