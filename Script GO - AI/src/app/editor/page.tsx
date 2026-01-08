"use client"

import { useState, useEffect, Suspense, Fragment } from "react"
import Navbar from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { VoiceInput } from "@/components/VoiceInput"
import { generateScriptAction } from "@/app/actions/generateScript"
import { toast } from "sonner"
import { Loader2, Copy, Save, Youtube, Linkedin, Video, Play, Edit3, Rocket, Globe, Clock, Volume2, ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter, useSearchParams } from "next/navigation"

export const dynamic = "force-dynamic"

// Interface for Script Data
interface ScriptData {
    title?: string
    topic?: string
    platform?: string
    language?: string
    hook?: string
    visuals?: string[]
    audio?: string[]
    hashtags?: string[]
    [key: string]: unknown
}

// Simple base64 click sound to avoid external assets
const playHaptic = () => {
    try {
        const win = window as any
        const AudioContextClass = win.AudioContext || win.webkitAudioContext;
        if (!AudioContextClass) return;

        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = "sine";
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

        osc.start();
        osc.stop(ctx.currentTime + 0.05);
    } catch {
        // Ignore audio errors
    }
}

function EditorContent() {
    const [loading, setLoading] = useState(false)
    const [topic, setTopic] = useState("")
    const [tone, setTone] = useState("Professional")
    const [scriptLength, setScriptLength] = useState("general")
    const [customDuration, setCustomDuration] = useState("60")
    const [language, setLanguage] = useState("English")
    const [platform, setPlatform] = useState("youtube")
    const [script, setScript] = useState<ScriptData | null>(null)

    const supabase = createClient()
    const router = useRouter()
    const searchParams = useSearchParams()

    // Load existing script if ID is present
    useEffect(() => {
        const id = searchParams.get('id')
        if (!id) return

        const fetchScript = async () => {
            setLoading(true)
            const { data, error } = await supabase
                .from('scripts')
                .select('*')
                .eq('id', id)
                .single()

            if (error) {
                toast.error("Failed to load script")
            } else if (data) {
                setTopic(data.topic || "")
                setPlatform(data.platform || "youtube")
                setTone(data.tone || "Professional")

                // Type safe assignment
                if (data.content && typeof data.content === 'object') {
                    setScript(data.content as ScriptData)
                }

                const dur = data.duration_seconds
                if (dur === 45) setScriptLength("short")
                else if (dur === 180) setScriptLength("indepth")
                else if (dur === 60) setScriptLength("general")
                else {
                    setScriptLength("custom")
                    setCustomDuration(dur?.toString() || "60")
                }
            }
            setLoading(false)
        }

        fetchScript()
    }, [searchParams, supabase])

    const handleGenerate = async () => {
        playHaptic()
        if (!topic) {
            toast.error("Please enter a topic")
            return
        }

        setLoading(true)
        setScript(null)

        try {
            const formData = new FormData()
            formData.append("topic", topic)
            formData.append("tone", tone)
            formData.append("platform", platform)
            formData.append("length", scriptLength === "custom" ? "custom" : scriptLength)
            formData.append("customDuration", customDuration)
            formData.append("language", language)

            const result = await generateScriptAction(formData)
            setScript(result as ScriptData)
            toast.success("Script generated successfully!")
        } catch (error: unknown) {
            let msg = "Failed to generate script."
            if (error instanceof Error) msg = error.message
            toast.error(msg)
        } finally {
            setLoading(false)
        }
    }

    const copyToClipboard = () => {
        playHaptic()
        if (!script) return;

        const text = script.audio && Array.isArray(script.audio)
            ? script.audio.join('\n')
            : JSON.stringify(script, null, 2);

        navigator.clipboard.writeText(text);
        toast.success("Script copied to clipboard")
    }

    const handleToneChange = (val: string) => {
        playHaptic();
        setTone(val);
    }

    return (
        <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden selection:bg-primary/30">
            <Navbar />

            <div className="flex flex-1 pt-20 overflow-hidden relative">
                {/* Background Gradients */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 opacity-50 dark:opacity-100">
                    <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full mix-blend-screen" />
                    <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-indigo-500/20 blur-[100px] rounded-full mix-blend-screen" />
                </div>

                {/* Left Sidebar - Settings & Input */}
                <div className="w-full md:w-[420px] border-r border-border bg-card/80 p-6 overflow-y-auto flex flex-col gap-6 z-10 backdrop-blur-md">
                    <div>
                        <div className="flex items-center gap-2 mb-6 text-muted-foreground">
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-secondary/20" onClick={() => router.push('/dashboard')}>
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                            <h2 className="text-lg font-medium flex items-center gap-2 text-foreground">
                                <Edit3 className="w-4 h-4" /> Script Settings
                            </h2>
                        </div>

                        <div className="space-y-6">
                            {/* Platform Grid */}
                            <div className="space-y-3">
                                <Label className="text-xs uppercase tracking-wider text-primary font-semibold">Platform</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { id: 'youtube', label: 'YouTube', icon: Youtube },
                                        { id: 'linkedin', label: 'LinkedIn', icon: Linkedin },
                                        { id: 'tiktok', label: 'TikTok', icon: Video },
                                        { id: 'shorts', label: 'Shorts', icon: Play },
                                    ].map((p) => (
                                        <Button
                                            key={p.id}
                                            type="button"
                                            variant="outline"
                                            className={`h-14 justify-start gap-3 border-border bg-card hover:bg-secondary relative overflow-hidden transition-all ${platform === p.id ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary/20' : 'text-muted-foreground'}`}
                                            onClick={() => { playHaptic(); setPlatform(p.id); }}
                                        >
                                            <p.icon className={`w-5 h-5 ${platform === p.id ? 'text-primary' : 'text-muted-foreground'}`} />
                                            {p.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Topic Input */}
                            <div className="space-y-3">
                                <Label className="text-xs uppercase tracking-wider text-primary font-semibold">Topic</Label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="e.g. The Future of AI in 2026..."
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        className="flex-1 bg-input/20 border-input focus:border-primary/50 h-11"
                                    />
                                    <VoiceInput onTranscript={(text) => setTopic((prev) => prev ? prev + " " + text : text)} />
                                </div>
                            </div>

                            {/* Tone & Length */}
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-3">
                                    <Label className="text-xs uppercase tracking-wider text-primary font-semibold">Script Tone</Label>
                                    <div className="relative">
                                        <Volume2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                                        <select
                                            className="flex h-11 w-full rounded-md border border-input bg-input/20 px-3 py-2 pl-9 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 text-foreground cursor-pointer hover:bg-secondary/30 transition-colors appearance-none"
                                            value={tone}
                                            onChange={(e) => handleToneChange(e.target.value)}
                                        >
                                            <option className="bg-card text-card-foreground" value="Professional">Professional</option>
                                            <option className="bg-card text-card-foreground" value="Casual">Casual</option>
                                            <option className="bg-card text-card-foreground" value="Creative">Creative</option>
                                            <option className="bg-card text-card-foreground" value="Friendly">Friendly</option>
                                            <option className="bg-card text-card-foreground" value="Educational">Educational</option>
                                            <option className="bg-card text-card-foreground" value="Funny">Funny</option>
                                            <option className="bg-card text-card-foreground" value="Viral">Viral / High Energy</option>
                                            <option className="bg-card text-card-foreground" value="Controversial">Controversial</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs uppercase tracking-wider text-primary font-semibold">Script Length</Label>
                                        {scriptLength === 'custom' && (
                                            <span className="text-[10px] text-muted-foreground/70">Custom Seconds</span>
                                        )}
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="flex-1 relative">
                                            <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                                            <select
                                                className="flex h-11 w-full rounded-md border border-input bg-input/20 px-3 py-2 pl-9 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 text-foreground cursor-pointer hover:bg-secondary/30 transition-colors appearance-none"
                                                value={scriptLength}
                                                onChange={(e) => { playHaptic(); setScriptLength(e.target.value); }}
                                            >
                                                <option className="bg-card text-card-foreground" value="short">Short Info (~45s)</option>
                                                <option className="bg-card text-card-foreground" value="general">General (~60s)</option>
                                                <option className="bg-card text-card-foreground" value="indepth">In-depth (~3m)</option>
                                                <option className="bg-card text-card-foreground" value="custom">Custom Duration</option>
                                            </select>
                                        </div>

                                        {scriptLength === 'custom' && (
                                            <Input
                                                type="number"
                                                className="w-24 bg-input/20 border-input h-11 text-center"
                                                value={customDuration}
                                                onChange={(e) => setCustomDuration(e.target.value)}
                                                min={10} max={600}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Language */}
                            <div className="space-y-3">
                                <Label className="text-xs uppercase tracking-wider text-primary font-semibold">Script Language</Label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <select
                                        className="flex h-11 w-full rounded-md border border-input bg-input/20 px-3 py-2 pl-9 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 text-foreground cursor-pointer hover:bg-secondary/30 transition-colors appearance-none"
                                        value={language}
                                        onChange={(e) => { playHaptic(); setLanguage(e.target.value); }}
                                    >
                                        <option className="bg-card text-card-foreground" value="English">English</option>
                                        <option className="bg-card text-card-foreground" value="Tamil">Tamil</option>
                                        <option className="bg-card text-card-foreground" value="Telugu">Telugu</option>
                                        <option className="bg-card text-card-foreground" value="Kannada">Kannada</option>
                                        <option className="bg-card text-card-foreground" value="Hindi">Hindi</option>
                                        <option className="bg-card text-card-foreground" value="Spanish">Spanish</option>
                                        <option className="bg-card text-card-foreground" value="French">French</option>
                                        <option className="bg-card text-card-foreground" value="German">German</option>
                                        <option className="bg-card text-card-foreground" value="Japanese">Japanese</option>
                                    </select>
                                </div>
                            </div>

                            <Button
                                className="w-full h-12 text-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all transform active:scale-95 duration-200 rounded-lg mt-4"
                                onClick={handleGenerate}
                                disabled={loading}
                            >
                                {loading ? (
                                    <> <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Crafting... </>
                                ) : (
                                    <> <Rocket className="mr-2 h-5 w-5" /> Generate Magic </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Right Content - Script Display */}
                <div className="flex-1 bg-background p-6 md:p-12 overflow-y-auto relative scroll-smooth">


                    {!script && !loading && (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-40">
                            <div className="w-24 h-24 rounded-3xl bg-secondary/30 border border-secondary flex items-center justify-center">
                                <Rocket className="w-10 h-10 text-primary/50" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground">Ready to create?</h3>
                                <p className="text-muted-foreground max-w-md mx-auto mt-2">
                                    Configure your script settings on the left.
                                </p>
                            </div>
                        </div>
                    )}

                    {loading && (
                        <div className="flex flex-col items-center justify-center h-full space-y-6">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
                                </div>
                            </div>
                            <p className="text-lg font-medium text-primary animate-pulse">Consulting the AI...</p>
                        </div>
                    )}

                    {script && (
                        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="flex items-start justify-between border-b border-border pb-6">
                                <div>
                                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-muted-foreground">
                                        {script.title || topic}
                                    </h1>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="text-xs uppercase tracking-wider font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                                            {platform}
                                        </span>
                                        <span className="text-xs text-muted-foreground">{language}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" className="border-border bg-card text-foreground hover:bg-secondary" onClick={copyToClipboard} title="Copy Content">
                                        <Copy className="w-4 h-4 mr-2" /> Copy
                                    </Button>
                                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => router.push('/dashboard')}>
                                        <Save className="w-4 h-4 mr-2" /> Done
                                    </Button>
                                </div>
                            </div>

                            {script.hook && (
                                <div className="bg-gradient-to-r from-primary/5 to-indigo-500/5 border border-primary/20 rounded-xl p-6 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Rocket className="w-24 h-24 text-primary transform rotate-12" />
                                    </div>
                                    <Label className="text-primary font-bold uppercase tracking-wider text-xs mb-3 block">Hook Strategy</Label>
                                    <p className="text-xl md:text-2xl font-medium leading-relaxed text-foreground shadow-sm">{script.hook}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-border/50 rounded-xl overflow-hidden shadow-2xl bg-card/80 backdrop-blur-sm">
                                <div className="bg-secondary/40 p-4 border-b md:border-b-0 md:border-r border-border text-center font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                                    Visual (See)
                                </div>
                                <div className="bg-secondary/40 p-4 text-center font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                                    Audio (Hear)
                                </div>

                                {/* Rows */}
                                {script.visuals?.map((visual: string, i: number) => (
                                    <Fragment key={i}>
                                        <div className="p-6 border-b border-border/50 text-sm md:text-base leading-relaxed text-card-foreground relative group hover:bg-secondary/10 transition-colors">
                                            <span className="absolute top-3 left-3 text-[10px] text-muted-foreground/40 font-mono">{(i + 1).toString().padStart(2, '0')}</span>
                                            {visual}
                                        </div>
                                        <div className="p-6 border-b border-border/50 text-sm md:text-base leading-relaxed font-medium text-foreground relative group hover:bg-secondary/10 transition-colors border-l md:border-l border-border/50">
                                            {script.audio?.[i] || ""}
                                        </div>
                                    </Fragment>
                                ))}
                            </div>

                            {script.hashtags && (
                                <div className="flex flex-wrap gap-2 pt-4">
                                    {script.hashtags.map((tag: string) => (
                                        <span key={tag} className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground border border-border text-sm font-medium hover:bg-secondary/80 transition-colors cursor-default">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function EditorPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <EditorContent />
        </Suspense>
    )
}
