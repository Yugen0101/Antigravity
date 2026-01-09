import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, FileText, Youtube, Linkedin, Video, Play, ArrowRight } from "lucide-react"
import Navbar from "@/components/Navbar"

// Client component wrapper for delete button to handle interaction
import { DeleteButton } from "@/components/DeleteButton"

export default async function Dashboard() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch user profile for premium status
    const { data: profile } = await supabase
        .from('profiles')
        .select('is_premium')
        .eq('id', user.id)
        .single()

    const isPremium = profile?.is_premium || false

    const { data: scripts } = await supabase
        .from('scripts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <div className="min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary/30">
            <Navbar />

            <div className="container mx-auto px-4 py-8 pt-24 relative">
                {/* Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                    <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full mix-blend-screen opacity-50 dark:opacity-100" />
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 z-10 relative">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">Dashboard</h1>
                        <p className="text-muted-foreground">Manage your generated scripts and content.</p>
                    </div>

                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                        {!isPremium && (
                            <Link href="/#pricing">
                                <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 rounded-full">
                                    Upgrade Plan
                                </Button>
                            </Link>
                        )}
                        <Link href="/editor">
                            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 rounded-full px-6 transition-transform hover:scale-105">
                                <Plus className="w-4 h-4 mr-2" />
                                New Script
                            </Button>
                        </Link>
                    </div>
                </div>

                {scripts && scripts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 z-10 relative">
                        {scripts.map((script) => (
                            <div key={script.id} className="group relative bg-card/50 border border-border/50 rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 flex flex-col h-full backdrop-blur-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-2 rounded-lg bg-primary/10 text-primary`}>
                                        {script.platform === 'youtube' && <Youtube className="w-5 h-5" />}
                                        {script.platform === 'linkedin' && <Linkedin className="w-5 h-5" />}
                                        {script.platform === 'tiktok' && <Video className="w-5 h-5" />}
                                        {script.platform === 'shorts' && <Play className="w-5 h-5" />}
                                    </div>
                                    <span className="text-xs text-muted-foreground font-mono">
                                        {new Date(script.created_at).toLocaleDateString()}
                                    </span>
                                </div>

                                <h3 className="text-lg font-semibold text-card-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                                    {script.title || script.topic || "Untitled Project"}
                                </h3>

                                <p className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-1">
                                    {script.content?.hook || "No preview available..."}
                                </p>

                                <div className="flex items-center gap-2 pt-4 border-t border-border mt-auto">
                                    <Link href={`/editor?id=${script.id}`} className="flex-1">
                                        <Button variant="secondary" className="w-full bg-secondary/50 hover:bg-secondary text-secondary-foreground border border-border/50">
                                            Open <ArrowRight className="w-3 h-3 ml-2" />
                                        </Button>
                                    </Link>
                                    <DeleteButton id={script.id} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center min-h-[400px] border border-dashed border-border rounded-3xl bg-card/20 relative z-10">
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                            <FileText className="w-10 h-10 text-primary/50" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-foreground">No scripts found</h3>
                        <p className="text-muted-foreground mb-8 text-center max-w-sm">
                            Your dashboard is empty. Launch the editor to create your first viral script.
                        </p>
                        <Link href="/editor">
                            <Button className="h-12 px-8 bg-primary hover:bg-primary/90 rounded-full shadow-lg shadow-primary/20 text-primary-foreground">
                                Start Creating
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
