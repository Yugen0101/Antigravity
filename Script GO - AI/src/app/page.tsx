import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check, CheckCircle2, Video, Linkedin, Sparkles, Youtube } from "lucide-react"
import Navbar from "@/components/Navbar"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" />
          <div className="absolute bottom-[-10%] right-[20%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px] mix-blend-screen opacity-50" />
        </div>

        <div className="container relative z-10 px-4 md:px-6 mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/40 border border-primary/20 text-primary text-xs md:text-sm font-medium mb-8 backdrop-blur-sm animate-fade-in-up">
            <Sparkles className="w-3 h-3" />
            <span>AI-Powered Script Generation</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent animate-fade-in-up delay-100 max-w-4xl mx-auto leading-tight">
            Stop staring at a <br className="hidden md:block" /> blank page.
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            ScriptGo uses advanced AI to craft high-conversion scripts for YouTube and LinkedIn. Start creating in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
            <Link href="/login?tab=signup">
              <Button size="lg" className="h-12 px-8 text-base bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all transform hover:scale-105 border-none rounded-full text-white">
                Get Started Free
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="#pricing">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base border-border bg-card/50 text-foreground hover:bg-secondary rounded-full">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Templates Showcase */}
      <section className="py-24 bg-secondary/20 relative border-t border-border/50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Proven Templates</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Choose from a variety of structures designed for engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { title: "Standard YouTube", desc: "Classic Hook-Intro-Body-Outro flow.", icon: Youtube, color: "text-red-400" },
              { title: "Viral Short / Reel", desc: "Fast-paced 60s structure for retention.", icon: Video, color: "text-pink-400" },
              { title: "LinkedIn Story", desc: "Professional narrative for networking.", icon: Linkedin, color: "text-blue-400" },
            ].map((t, i) => (
              <div key={i} className="group p-1 rounded-2xl bg-gradient-to-b from-primary/20 to-transparent hover:from-primary/30 transition-all duration-300">
                <div className="bg-card p-8 rounded-xl h-full border border-border group-hover:border-primary/30 transition-all">
                  <div className={`w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-6 ${t.color}`}>
                    <t.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{t.title}</h3>
                  <p className="text-sm text-muted-foreground">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing / Features */}
      <section id="pricing" className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Start for free, upgrade for power.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="p-8 rounded-3xl border border-border bg-card/60 backdrop-blur-sm shadow-xl">
              <div className="mb-8">
                <h3 className="text-xl font-medium text-primary mb-2">Starter</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                  Perfect for trying out the AI script generation.
                </p>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "3 AI Script Generations / mo",
                  "Standard YouTube Template",
                  "Basic Tone Selection",
                  "Export to Text"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/login?tab=signup" className="block">
                <Button variant="outline" className="w-full h-12 rounded-xl border-border hover:bg-secondary">
                  Get Started Free
                </Button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="relative p-8 rounded-3xl border border-primary/30 bg-primary/5 backdrop-blur-sm overflow-hidden shadow-2xl shadow-primary/10">
              <div className="absolute top-0 right-0 bg-primary text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider text-primary-foreground">
                Popular
              </div>
              <div className="mb-8">
                <h3 className="text-xl font-medium text-primary mb-2">Pro Creator</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">$19</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                  For serious creators needing unlimited power.
                </p>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "Unlimited AI Generations",
                  "Access All Premium Templates",
                  "Advanced Tone & Length Controls",
                  "Multi-language Support",
                  "Priority Support"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/login?tab=signup" className="block">
                <Button className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 border-none text-white">
                  Upgrade to Pro
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-12 border-t border-border bg-card">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ScriptGo AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
