"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { User, AuthChangeEvent, Session } from "@supabase/supabase-js"
import { LogOut, Sun, Moon, Rocket } from "lucide-react"
import { useTheme } from "next-themes"

export default function Navbar() {
    const [user, setUser] = useState<User | null>(null)
    const pathname = usePathname()
    const supabase = createClient()
    const { setTheme, theme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        const init = async () => {
            setMounted(true)
            const { data: { user: supabaseUser } } = await supabase.auth.getUser()
            setUser(supabaseUser)
        }
        init()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [supabase.auth])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        location.reload()
    }

    if (!mounted) return null;

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/60 backdrop-blur-xl">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                        <Rocket className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">ScriptGo</span>
                </Link>

                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="rounded-full"
                    >
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>

                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard" className={`text-sm font-medium hover:text-primary transition-colors ${pathname === '/dashboard' ? 'text-primary' : 'text-muted-foreground'}`}>
                                Dashboard
                            </Link>
                            <Button onClick={handleSignOut} variant="outline" size="sm" className="gap-2">
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/login">
                                <Button variant="ghost" size="sm">Log In</Button>
                            </Link>
                            <Link href="/login?tab=signup">
                                <Button className="neon-button">
                                    <span className="relative z-10 text-white">Get Started</span>
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}
