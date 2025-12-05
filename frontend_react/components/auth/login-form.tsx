"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { AlertCircle, Eye, EyeOff } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)
  setError("")

  try {
    if (!formData.username || !formData.password) {
      throw new Error("Please fill in all fields")
    }

    // Call your Django login API
    const res = await fetch("http://127.0.0.1:8000/api/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: formData.username,
        password: formData.password,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || "Login failed")
    }

    localStorage.setItem("auth_token", "demo_token_" + Date.now())
    localStorage.setItem("user_username", data.username)
    localStorage.setItem("user_role", data.role)

    // Redirect to dashboard
    router.replace("/")
  } catch (err) {
    setError(err instanceof Error ? err.message : "An error occurred")
  } finally {
    setIsLoading(false)
  }
}


  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground text-balance">Login</h2>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Username Field */}
      <div className="space-y-2">
        <Label htmlFor="username" className="text-sm font-medium text-foreground">
          Username
        </Label>
        <Input
          id="username"
          name="username"
          type="text"
          placeholder="Enter your username"
          value={formData.username}
          onChange={handleChange}
          disabled={isLoading}
          className="bg-input border-border text-foreground placeholder:text-muted-foreground h-10"
          autoComplete="username"
        />
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-sm font-medium text-foreground">
            Password
          </Label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            className="bg-input border-border text-foreground placeholder:text-muted-foreground pr-10 h-10"
            autoComplete="current-password"
          />
          {showPassword ? (
            <EyeOff className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          ) : (
            <Eye className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Forgot Password Link */}
      <div className="text-right">
        <button type="button" className="text-xs text-primary hover:text-primary/80 font-medium transition-colors">
          Forgot password?
        </button>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-10 transition-colors"
      >
        {isLoading ? (
          <>
            <Spinner className="mr-2 h-4 w-4" />
            Logging in...
          </>
        ) : (
          "Login"
        )}
      </Button>

      {/* Sign Up Link */}
      <p className="text-center text-sm text-muted-foreground">
        Don't have an account yet?{" "}
        <button type="button" className="text-primary hover:text-primary/80 font-semibold">
          Sign up
        </button>
      </p>
    </form>
  )
}
