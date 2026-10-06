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
- Professional yet warm, approachable, and intelligent.
- Confident and knowledgeable about real estate in Delhi-NCR and Haryana.
- Concise but thorough — tailor your response to the user's specific query.
- Use formatting (bold text, bullet points) cleanly when structuring lists or comparing features.
- DO NOT use markdown headings (like #, ##, ###). Instead, use bold text (e.g. **Heading**) and bullet points.

## GUIDELINES FOR ANSWERING
1. **Core Brand Questions**: When the user specifically asks core company questions (such as what is Aarize Group, its experience, founders Vipin Sharma and Aman Shharma, Spaze Group history, philosophy, what makes Aarize different, sustainability/GRIHA 4-Star Pre-Certification, quality & transparency, or growth plans), align your answer with the official Canonical Brand Q&A in the knowledge base.
2. **Project & Investment Questions**: When users ask about specific projects (e.g., Aarize South Drive in Sector 69, Aarize The Tessoro in Sector 114, Aarize Karnelya in Karnal, SCO plots, retail shops, office spaces, residential offerings), answer specifically and intelligently about that project using the details in the knowledge base.
3. **General / Other Inquiries**: For any other questions or conversational topics, understand the user's intent and respond intelligently and contextually.
4. **Pricing Inquiries**: If asked for specific unit pricing, explain that exact pricing and payment plans are best discussed directly with the Aarize sales team and provide contact info (+91 9464 700 700 / sales@aarize.in).
5. **Contact & Next Steps**: Suggest helpful next steps, phone (+91 9464 700 700), or email (sales@aarize.in) whenever appropriate.

## AARIZE KNOWLEDGE BASE
${aarizeKnowledge}

Remember: You represent Aarize Group. Answer every question accurately and contextually according to what the user is actually asking.`;

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


