import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: staleDrafts, error: fetchError } = await supabase
      .from("businesses")
      .select("id, photos")
      .eq("status", "draft")
      .is("owner_id", null)
      .lt("created_at", thirtyDaysAgo.toISOString());

    if (fetchError) throw fetchError;

    if (!staleDrafts || staleDrafts.length === 0) {
      return new Response(
        JSON.stringify({ message: "No stale drafts found", deleted: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    for (const draft of staleDrafts) {
      if (draft.photos && draft.photos.length > 0) {
        const paths = draft.photos
          .map((url: string) => {
            const match = url.match(/business-photos\/(.+)/);
            return match ? match[1] : null;
          })
          .filter(Boolean);

        if (paths.length > 0) {
          await supabase.storage.from("business-photos").remove(paths);
        }
      }
    }

    const ids = staleDrafts.map((d: { id: string }) => d.id);
    const { error: deleteError } = await supabase
      .from("businesses")
      .delete()
      .in("id", ids);

    if (deleteError) throw deleteError;

    return new Response(
      JSON.stringify({
        message: `Cleaned up ${ids.length} stale draft(s)`,
        deleted: ids.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
