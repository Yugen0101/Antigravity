"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff } from "lucide-react"

interface VoiceInputProps {
    onTranscript: (text: string) => void
}

// Define minimal types for Web Speech API to avoid 'any'
interface SpeechRecognitionEvent {
    results: {
        [index: number]: {
            [index: number]: {
                transcript: string
            }
        }
        length: number
    }
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean
    interimResults: boolean
    lang: string
    start: () => void
    stop: () => void
    onstart: (() => void) | null
    onend: (() => void) | null
    onresult: ((event: SpeechRecognitionEvent) => void) | null
}

interface IWindow extends Window {
    webkitSpeechRecognition: new () => SpeechRecognition
    recognitionInstance?: SpeechRecognition
}

export function VoiceInput({ onTranscript }: VoiceInputProps) {
    const [isListening, setIsListening] = useState(false)
    const [support] = useState(() => {
        if (typeof window !== "undefined" && (window as unknown as IWindow).webkitSpeechRecognition) {
            return true
        }
        return false
    })

    const toggleListening = () => {
        const win = window as unknown as IWindow
        if (!support) {
            alert("Voice input is not supported in this browser.")
            return
        }

        if (isListening) {
            setIsListening(false)
            if (win.recognitionInstance) {
                win.recognitionInstance.stop()
            }
        } else {
            const SpeechRecognition = win.webkitSpeechRecognition
            const recognition = new SpeechRecognition()
            recognition.continuous = false
            recognition.interimResults = true
            recognition.lang = "en-US"

            recognition.onstart = () => setIsListening(true)
            recognition.onend = () => setIsListening(false)

            recognition.onresult = (event: SpeechRecognitionEvent) => {
                const results = event.results
                const transcript = Array.from({ length: results.length })
                    .map((_, i) => results[i][0].transcript)
                    .join("")

                if (onTranscript) {
                    onTranscript(transcript)
                }
            }

            win.recognitionInstance = recognition
            recognition.start()
        }
    }

    if (!support) return null

    return (
        <Button
            type="button"
            variant={isListening ? "destructive" : "secondary"}
            size="icon"
            onClick={toggleListening}
            className={`transition-all ${isListening ? 'animate-pulse' : ''}`}
            title="Voice Input"
        >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
    )
}
