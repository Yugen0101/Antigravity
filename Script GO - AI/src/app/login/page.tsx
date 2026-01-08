"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export const dynamic = "force-dynamic"

function LoginContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const defaultTab = searchParams.get("tab") === "signup" ? "signup" : "login"
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        fullName: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            })

            if (error) {
                toast.error(error.message)
                return
            }

            toast.success("Welcome back!")
            router.push("/dashboard")
            router.refresh()
        } catch {
            toast.error("An unexpected error occurred")
        } finally {
            setLoading(false)
        }
    }

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        if (!formData.fullName) {
            toast.error("Please enter your full name")
            setLoading(false)
            return
        }

        try {
            const { error, data } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                    },
                },
            })

            if (error) {
                toast.error(error.message)
                return
            }

            toast.success("Account created! You can now log in.")

            if (data.session) {
                router.push("/dashboard")
                router.refresh()
            } else {
                toast.info("Please check your email to confirm your account.")
            }

        } catch {
            toast.error("An unexpected error occurred")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-background">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

            <Card className="w-full max-w-md z-10 glass-panel shadow-2xl border-white/10">
                <Tabs defaultValue={defaultTab} className="w-full">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">
                            Welcome to ScriptGo
                        </CardTitle>
                        <CardDescription className="text-center">
                            Create viral scripts in seconds with AI
                        </CardDescription>
                        <TabsList className="grid w-full grid-cols-2 mt-4">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="signup">Sign Up</TabsTrigger>
                        </TabsList>
                    </CardHeader>

                    <TabsContent value="login">
                        <form onSubmit={handleLogin}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full neon-button" type="submit" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Log In
                                </Button>
                            </CardFooter>
                        </form>
                    </TabsContent>

                    <TabsContent value="signup">
                        <form onSubmit={handleSignUp}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input
                                        id="fullName"
                                        name="fullName"
                                        placeholder="John Doe"
                                        required
                                        value={formData.fullName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full neon-button" type="submit" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Create Account
                                </Button>
                            </CardFooter>
                        </form>
                    </TabsContent>
                </Tabs>
            </Card>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="flex h-screen w-screen items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
            <LoginContent />
        </Suspense>
    )
}
