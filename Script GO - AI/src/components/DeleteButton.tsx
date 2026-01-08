"use client"

import { Button } from "./ui/button"
import { Trash2, Loader2 } from "lucide-react"
import { deleteScriptAction } from "../app/actions/deleteScript"
import { toast } from "sonner"
import { useState } from "react"



// Simple click sound
const playHaptic = () => {
    try {
        const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
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

export function DeleteButton({ id }: { id: string }) {
    const [deleting, setDeleting] = useState(false)

    const handleDelete = async () => {
        playHaptic()
        if (!confirm("Are you sure you want to delete this script?")) return;

        setDeleting(true)
        try {
            await deleteScriptAction(id)
            toast.success("Script deleted")
        } catch {
            toast.error("Failed to delete")
        } finally {
            setDeleting(false)
        }
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            className="hover:bg-destructive/10 hover:text-destructive text-muted-foreground/40 transition-colors"
            onClick={handleDelete}
            disabled={deleting}
        >
            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </Button>
    )
}
