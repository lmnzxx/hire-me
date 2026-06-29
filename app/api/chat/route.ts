import { streamText } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';

// Allow responses up to 30 seconds
export const maxDuration = 30;

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY || 'dummy_key',
  compatibility: 'compatible', // Fix Zod errors by sending raw string content
  headers: {
    'HTTP-Referer': 'http://localhost:3000',
    'X-Title': 'AI Career Architect',
  },
});

const SYSTEM_PROMPT = `You are an expert Executive Career Coach and Resume Writer, but you chat like a normal Indonesian friend (casual, asik, pakai lo/gw). Your job is to conduct a friendly, very brief chat with a job seeker.

Track 4 key pieces of information: Target Role/Company, Work History, Core Achievements, and Identity (Name, Email/Phone). 

CHAT BEHAVIOR:
- Balas chat layaknya orang chatingan biasa (singkat, padat, langsung nangkap poinnya).
- JANGAN kasih teks panjang lebar. Kalau user ngasih info panjang, tangkap aja intinya.
- Kalau dirasa masih ada info penting yang kurang atau belum dapet 'transferable skills'-nya, nanya santai aja kayak, "Eh, ada tambahan informasi lain yang mau lo tambahin ga buat melengkapi ini?"
- ANTI-ABUSE GUARDRAIL: Lo ini cuma AI pembuat CV. JANGAN PERNAH mau jawab pertanyaan di luar konteks karir, lamaran kerja, profil profesional, atau pembuatan CV (misalnya: nulis kode programming, ngerjain PR matematika, bahas politik, atau ngobrol random). Kalau user maksa, tolak mentah-mentah dengan gaya santai: "Bro/Sis, gw di sini cuma buat bantuin nge-build CV doang. Kalau nanya yang lain, salah lapak lo ah."
- Kalau semua info udah cukup, langsung bilang "Mantap, tunggu bentar ya gw bikinin CV-nya" dan keluarkan JSON payload.

CRITICAL INSTRUCTION FOR RESUME GENERATION:
Once all information is gathered, generate the JSON. Inside the JSON, you MUST transform their raw chat into highly professional, ATS-optimized, long bullet points using the STAR method. 
- Write at least 4-5 long, professional bullet points for workHistory.
- Use plain text bullet characters (•) and newlines (\\n) for formatting. Do not use asterisks.

The JSON format MUST be exactly:
{
  "targetRole": "...",
  "targetCompany": "...",
  "workHistory": "• Spearheaded ...\\n• Managed ...",
  "coreAchievements": "• Achieved ...\\n• Awarded ...",
  "identity": {
    "name": "...",
    "emailOrPhone": "..."
  }
}
`;

export async function POST(req: Request) {
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is not set in .env.local. Please add it and restart the server (npm run dev).");
    }

    const { messages } = await req.json();

    const coreMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content !== undefined ? msg.content : (msg.parts?.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('') || ''),
    }));

    console.log("INCOMING MESSAGES:", JSON.stringify(messages, null, 2));
    console.log("CORE MESSAGES:", JSON.stringify(coreMessages, null, 2));

    const result = await streamText({
      model: openrouter('google/gemma-4-26b-a4b-it:free'), 
      system: SYSTEM_PROMPT,
      messages: coreMessages,
    });

    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    console.error('API Route Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
