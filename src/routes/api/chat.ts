import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createClient } from "@supabase/supabase-js";
import { createFileRoute } from "@tanstack/react-router";
import type { Database } from "@/integrations/supabase/types";

function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
    );

    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }

    headers.set("apikey", supabaseKey);
    return fetch(input, { ...init, headers });
  };
}

type ChatRequestBody = {
  caseId?: unknown;
  messages?: unknown;
};

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const authHeader = request.headers.get("authorization");
        const token = authHeader?.startsWith("Bearer ")
          ? authHeader.slice("Bearer ".length)
          : null;
        const body = (await request.json()) as ChatRequestBody;

        if (!token || typeof body.caseId !== "string" || !Array.isArray(body.messages)) {
          return new Response("A signed-in case and messages are required.", { status: 400 });
        }

        const url = process.env["SUPABASE_URL"];
        const publishableKey = process.env["SUPABASE_PUBLISHABLE_KEY"];
        const lovableApiKey = process.env["LOVABLE_API_KEY"];

        if (!url || !publishableKey) {
          return new Response("Cloud connection is not configured.", { status: 500 });
        }

        if (!lovableApiKey) {
          return new Response("The legal assistant is not configured yet.", { status: 500 });
        }

        const supabase = createClient<Database>(url, publishableKey, {
          global: {
            fetch: createSupabaseFetch(publishableKey),
            headers: { Authorization: `Bearer ${token}` },
          },
          auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
        });

        const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
        const userId = claimsData?.claims?.sub;
        if (claimsError || typeof userId !== "string") {
          return new Response("Your session has expired. Please sign in again.", { status: 401 });
        }

        const { data: legalCase, error: caseError } = await supabase
          .from("legal_cases")
          .select("title, document_name, document_text")
          .eq("id", body.caseId)
          .eq("user_id", userId)
          .single();

        if (caseError || !legalCase) {
          return new Response("That case could not be found.", { status: 404 });
        }

        const lovable = createOpenAI({
          baseURL: "https://ai.gateway.lovable.dev/v1",
          apiKey: lovableApiKey,
          headers: {
            "Lovable-API-Key": lovableApiKey,
            "X-Lovable-AIG-SDK": "vercel-ai-sdk",
          },
        });

        const result = streamText({
          model: lovable.responses("openai/gpt-6-astra"),
          system: `You are Lexicon, a careful legal-information assistant.

Your job is to help a person understand the material in their case, not to act as their lawyer or make a final legal decision. Use plain language, distinguish facts from interpretation, and say when the provided material does not answer a question. Do not invent clauses, deadlines, rights, or jurisdiction-specific rules. When the user asks what to do next, provide practical questions or preparation steps for a qualified legal professional. Start responses with the clearest answer, then add concise supporting detail. Always remind the user when professional legal advice is especially important.

Case: ${legalCase.title}
Document: ${legalCase.document_name || "No document label provided"}
Document text:
${legalCase.document_text || "No document text has been added yet. Ask the user to add or paste the relevant text before analyzing it."}`,
          messages: await convertToModelMessages(body.messages as UIMessage[]),
          providerOptions: {
            openai: {
              forceReasoning: true,
              reasoningEffort: "low",
              reasoningSummary: "auto",
              store: false,
              include: ["reasoning.encrypted_content"],
            },
          },
        });

        return result.toUIMessageStreamResponse({
          originalMessages: body.messages as UIMessage[],
          sendReasoning: true,
        });
      },
    },
  },
});