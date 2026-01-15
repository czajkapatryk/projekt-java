"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2, Database } from "lucide-react"

interface LoginFormProps {
  onSwitchToRegister: () => void
  onSuccess: () => void
}

export function LoginForm({ onSwitchToRegister, onSuccess }: LoginFormProps) {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await login(email, password)
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wystąpił błąd podczas logowania")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setEmail("jan.kowalski@example.com")
    setPassword("password123")
    setError("")
    setIsLoading(true)

    try {
      await login("jan.kowalski@example.com", "password123")
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wystąpił błąd podczas logowania")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Zaloguj się</CardTitle>
        <CardDescription>Wprowadź swoje dane, aby kontynuować</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-2 rounded-lg bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-300">
            <Database className="h-4 w-4 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">Baza danych PostgreSQL</p>
              <p className="text-xs opacity-80">Aplikacja połączona z prawdziwą bazą danych Neon PostgreSQL.</p>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="jan.kowalski@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Hasło</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-background/50"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Zaloguj się
          </Button>
          <p className="text-sm text-muted-foreground">
            Nie masz konta?{" "}
            <button type="button" onClick={onSwitchToRegister} className="text-primary hover:underline">
              Zarejestruj się
            </button>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
