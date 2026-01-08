"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function deleteScriptAction(scriptId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error("Unauthorized")

    const { error } = await supabase
        .from('scripts')
        .delete()
        .eq('id', scriptId)
        .eq('user_id', user.id)

    if (error) {
        throw new Error("Failed to delete script")
    }

    revalidatePath('/dashboard')
    return { success: true }
}
