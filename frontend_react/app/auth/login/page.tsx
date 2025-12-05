"use client"
import { LoginForm } from "@/components/auth/login-form"
import { Card } from "@/components/ui/card"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      {/* Background Decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary mb-4">
            <span className="text-lg font-bold text-primary-foreground">DI</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Institutionnel</h1>
          <p className="text-muted-foreground">Gestion des performances étudiantes</p>
        </div>

        {/* Login Form Card */}
        <Card className="border border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 shadow-lg">
          <LoginForm />
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          © 2025 Dashboard Institutionnel. Tous droits réservés.
        </p>
      </div>
    </div>
  )
}
