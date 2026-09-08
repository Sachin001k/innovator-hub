import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase configuration in .env.local");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const verifyAdminPin = async (pin: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from("admin_settings")
      .select("pin, active")
      .eq("active", true)
      .single();

    if (error) {
      console.error("Error fetching admin PIN:", error);
      return false;
    }

    return data?.pin === pin;
  } catch (error) {
    console.error("Unexpected error verifying PIN:", error);
    return false;
  }
};

// ── Chapter data storage ───────────────────────────────────────────────────────

export const saveChapterData = async (
  chapterId: string,
  data: Record<string, any>
): Promise<boolean> => {
  try {
    // Check if row exists
    const { data: existing, error: fetchError } = await supabase
      .from("chapters_data")
      .select("id")
      .eq("chapter_id", chapterId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error(`[Supabase] Error checking chapter ${chapterId}:`, fetchError);
      return false;
    }

    if (existing) {
      // Row exists, update it
      const { error: updateError } = await supabase
        .from("chapters_data")
        .update({
          data,
          updated_at: new Date().toISOString(),
        })
        .eq("chapter_id", chapterId);

      if (updateError) {
        console.error(`[Supabase] Error updating chapter ${chapterId}:`, updateError);
        return false;
      }
      console.log(`[Supabase] Updated chapter ${chapterId}`);
    } else {
      // Row doesn't exist, insert it
      const { error: insertError } = await supabase.from("chapters_data").insert({
        chapter_id: chapterId,
        data,
        updated_at: new Date().toISOString(),
      });

      if (insertError) {
        console.error(`[Supabase] Error inserting chapter ${chapterId}:`, insertError);
        return false;
      }
      console.log(`[Supabase] Inserted chapter ${chapterId}`);
    }

    console.log(`[Supabase] Saved chapter ${chapterId}`);
    return true;
  } catch (error) {
    console.error(`[Supabase] Unexpected error saving chapter ${chapterId}:`, error);
    return false;
  }
};

export const getChapterDataFromDB = async (
  chapterId: string
): Promise<Record<string, any> | null> => {
  try {
    const { data, error } = await supabase
      .from("chapters_data")
      .select("data, updated_at")
      .eq("chapter_id", chapterId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No row found - this is OK, return null to use static data
        console.log(`[Supabase] No data found for chapter ${chapterId}, using static data`);
        return null;
      }
      console.error(`[Supabase] Error fetching chapter ${chapterId}:`, error);
      return null;
    }

    console.log(`[Supabase] Fetched chapter ${chapterId} (updated: ${data.updated_at})`);
    return data.data;
  } catch (error) {
    console.error(`[Supabase] Unexpected error fetching chapter ${chapterId}:`, error);
    return null;
  }
};

export const getAllChaptersFromDB = async (): Promise<Record<string, any>> => {
  try {
    const { data, error } = await supabase.from("chapters_data").select("chapter_id, data");

    if (error) {
      console.error("[Supabase] Error fetching all chapters:", error);
      return {};
    }

    const result: Record<string, any> = {};
    data?.forEach((row) => {
      result[row.chapter_id] = row.data;
    });

    console.log(`[Supabase] Fetched ${Object.keys(result).length} chapters from database`);
    return result;
  } catch (error) {
    console.error("[Supabase] Unexpected error fetching all chapters:", error);
    return {};
  }
};
