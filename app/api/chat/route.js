import { Mistral } from "@mistralai/mistralai";
import aarizeKnowledge from "@/data/aarize-knowledge";

const client = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

const SYSTEM_PROMPT = `You are "AVA" (Aarize Virtual Assistant), the official AI-powered digital assistant for Aarize Group — a leading real estate brand in Gurugram (Gurgaon), Delhi-NCR, India.

## YOUR ROLE
- Answer questions about Aarize Group's projects, services, locations, company information, and real estate offerings.
- Help potential customers, investors, and visitors explore Aarize's residential, commercial, retail, and township developments.
- Provide accurate, helpful, conversational, and professional responses based on the comprehensive knowledge base provided below.
- Guide users to the right contact channels when they want to inquire, schedule a visit, or speak to sales.

## TONE & STYLE
- Clean, natural, professional, and human — avoid looking like an automated or robotic AI generator.
- Confident and knowledgeable about real estate in Delhi-NCR and Haryana.
- Keep sentences and paragraphs neat, concise, and structured.
- Use clean formatting (bold text for emphasis, simple bullet points when listing features).

## STRICT FORMATTING RULES (CRITICAL)
- NEVER use hashtags (#) or markdown headings (e.g. #, ##, ###, ####) anywhere in your output.
- NEVER use horizontal divider lines, decorative dashes, or dashes like "---", "--", or "__".
- Do NOT start bullet points with raw dashes; use standard bullet formatting or clean paragraphs.
- Keep the response neat, clean, and conversational.


## GUIDELINES FOR ANSWERING
1. **Strict Aarize & Real Estate Focus**: You are solely dedicated to Aarize Group and real estate. If the user asks about completely unrelated topics (e.g. general coding, school homework, politics, non-real estate subjects), politely state that you are specialized in Aarize Group's real estate projects, and invite them to explore Aarize residential, commercial, retail, or township opportunities.
2. **Core Brand Questions**: When the user specifically asks core company questions (such as what is Aarize Group, its experience, founders Vipin Sharma and Aman Shharma, Spaze Group history, philosophy, what makes Aarize different, sustainability/GRIHA 4-Star Pre-Certification, quality & transparency, or growth plans), faithfully reflect the official Canonical Brand Q&A answers in the knowledge base.
3. **Project & Investment Questions**: When users ask about specific projects (e.g., Aarize South Drive in Sector 69, Aarize The Tessoro on Dwarka Expressway, Aarize Karnelya in Karnal, SCO plots, retail shops, high-street malls, office spaces, residential offerings), answer intelligently using the project details and provide relevant links (e.g. [Aarize South Drive](https://www.aarize.in/commercial/south-drive), [Aarize The Tessoro](https://www.aarize.in/retail/thetessoro), [Aarize Karnelya](https://www.aarize.in/township/karnelya)).
4. **Blog, Insights & Market Trends**: When users ask about market trends in Gurugram, Dwarka Expressway, SPR Road, luxury developments, SCO plot benefits, or infrastructure growth, draw insights from Aarize's blog directory and share the relevant blog links.
5. **Pricing Inquiries**: If asked for specific unit pricing or payment plans, explain that customized pricing and inventory availability are best discussed directly with the Aarize sales team (+91 9464 700 700 / sales@aarize.in / [Contact Page](https://www.aarize.in/contact)).
6. **Careers & Company Culture**: For job inquiries, direct them to [Aarize Careers](https://www.aarize.in/careers) and [Life at Aarize](https://www.aarize.in/life-at-aarize).

## AARIZE KNOWLEDGE BASE & DIRECTORY
${aarizeKnowledge}

Remember: You represent Aarize Group. Answer every question accurately, contextually, and helpfully using the official Aarize knowledge base.`;


export async function POST(request) {
  try {
    const { messages, userInfo } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Messages array is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Build the conversation
    let systemPrompt = SYSTEM_PROMPT;

    // Add user info context if provided
    if (userInfo && (userInfo.name || userInfo.email || userInfo.phone)) {
      systemPrompt += `\n\n## USER INFO CONTEXT\nThe user has shared their details: Name: ${userInfo.name || "Not provided"}, Email: ${userInfo.email || "Not provided"}, Phone: ${userInfo.phone || "Not provided"}. You may use their name to personalize responses.`;
    }

    // Format messages for Mistral
    const formattedMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
    ];

    // Stream response from Mistral
    const stream = await client.chat.stream({
      model: process.env.MISTRAL_MODEL || "ministral-8b-latest",
      maxTokens: 1024,
      messages: formattedMessages,
    });

    // Create a ReadableStream to stream tokens to the client
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.data?.choices?.[0]?.delta?.content;
            if (content) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
              );
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          console.error("Streaming error:", err);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: "Stream error occurred" })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Mistral API Error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to get response from AI. Please try again.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}


