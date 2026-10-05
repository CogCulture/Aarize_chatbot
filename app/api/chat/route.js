import { Mistral } from "@mistralai/mistralai";
import aarizeKnowledge from "@/data/aarize-knowledge";

const client = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

const SYSTEM_PROMPT = `You are "AVA" (Aarize Virtual Assistant), the official AI-powered digital assistant for Aarize Group — a leading real estate developer in Gurugram (Gurgaon), Delhi-NCR, India.

## YOUR ROLE
- Answer questions about Aarize Group's projects, services, locations, and company information
- Help potential customers, investors, and visitors explore Aarize's residential, commercial, retail, and township offerings
- Provide accurate, helpful, and professional responses based on the knowledge base provided
- Guide users to the right contact channels when they want to inquire or schedule a visit

## TONE & STYLE
- Professional yet warm and approachable
- Confident and knowledgeable about real estate
- Concise but thorough — don't give overly short or overly long answers
- Use formatting (bold, bullet points) when listing features or comparing options
- Always be helpful and suggest next steps when relevant

## IMPORTANT RULES
1. ONLY answer based on the Aarize knowledge base provided below. Do NOT make up information about pricing, availability, or specific details not in the knowledge base.
2. If asked about pricing, say that pricing details are best discussed with the sales team and provide the contact: +91 9464 700 700 or sales@aarize.in
3. If asked about something not in the knowledge base, politely say you don't have that specific information and suggest contacting Aarize directly
4. Always provide relevant links from the Aarize website when mentioning specific projects or pages
5. When mentioning contact info, always include phone (+91 9464 700 700) and email (sales@aarize.in)
7. Always maintain professionalism befitting a premium real estate brand.
8. DO NOT use markdown headings (like #, ##, ###, etc.) in your response. Instead, use bold text (e.g. **Heading**) and bullet points to structure your response.
9. When answering questions related to Aarize Group's brand identity, experience/founders (Vipin Sharma and Aman Shharma, Spaze Group background), philosophy, project portfolio (South Drive, The Tessoro, Karnelya), quality & customer commitment, sustainability/GRIHA certification, and upcoming growth plans, ensure your responses faithfully reflect the Core Brand Q&A answers in the knowledge base.

## AARIZE KNOWLEDGE BASE
${aarizeKnowledge}

Remember: You represent Aarize Group. Be helpful, accurate, and professional at all times.`;

const CANONICAL_QA_LIST = [
  {
    patterns: [
      /what\s+is\s+aarize(\s+group)?/i,
      /tell\s+me\s+about\s+aarize(\s+group)?/i,
      /who\s+is\s+aarize(\s+group)?/i,
      /about\s+aarize(\s+group)?/i,
    ],
    answer:
      "Aarize Group is a real estate brand focused on creating distinctive spaces across residential, commercial, retail and township developments. The brand was created with a clear intent to move beyond conventional real estate and create places that offer a stronger sense of character, experience and long-term relevance.",
  },
  {
    patterns: [
      /how\s+experienced\s+is\s+aarize/i,
      /experience\s+of\s+aarize/i,
      /how\s+many\s+years\s+of\s+experience/i,
      /how\s+long\s+has\s+aarize/i,
    ],
    answer:
      "Aarize Group brings decades of real estate experience behind the brand. Its leadership has been active in the industry for over two decades and together they previously co-founded Spaze Group in 2005. Before establishing Aarize Group in 2023, the team had delivered over 15 million sq. ft. across commercial, retail and residential developments.",
  },
  {
    patterns: [
      /what\s+kind\s+of\s+(real\s+estate\s+)?projects\s+does\s+aarize/i,
      /what\s+types?\s+of\s+projects\s+does\s+aarize/i,
      /projects\s+portfolio/i,
    ],
    answer:
      "Aarize Group works across multiple segments, including residential, commercial, retail and plotted townships. Its portfolio includes developments such as Aarize South Drive in Sector 69, Aarize The Tessoro on Dwarka Expressway, and Aarize Karnelya, a European-inspired plotted township in Karnal.",
  },
  {
    patterns: [
      /what\s+makes\s+aarize(\s+group)?\s+different/i,
      /different\s+from\s+other\s+(luxury\s+)?real\s+estate\s+developers/i,
      /how\s+is\s+aarize\s+different/i,
      /why\s+choose\s+aarize/i,
    ],
    answer:
      "Aarize’s approach is centred on creating distinctive developments rather than simply following established formats. The focus is on bringing together location, design, functionality and experience to create spaces with their own identity. The brand’s philosophy is rooted in challenging conventional approaches to real estate.",
  },
  {
    patterns: [
      /philosophy\s+behind\s+aarize/i,
      /aarize('s)?\s+philosophy/i,
      /approach\s+to\s+development/i,
    ],
    answer:
      "The idea is simple: real estate should offer more than physical space. Aarize Group looks at the larger experience a development can create, from how people use the space to how it fits its surroundings and remains relevant over time. This reflects the brand’s belief in going beyond conventional development models.",
  },
  {
    patterns: [
      /who\s+are\s+the\s+people\s+behind\s+aarize/i,
      /who\s+are\s+the\s+founders/i,
      /who\s+founded\s+aarize/i,
      /leadership\s+of\s+aarize/i,
      /who\s+started\s+aarize/i,
      /vipin\s+sharma/i,
      /aman\s+shharma/i,
    ],
    answer:
      "Aarize Group was established by Vipin Sharma and Aman Shharma, who bring extensive experience in the NCR real estate sector. Their earlier work through Spaze Group includes commercial, retail, residential, IT Park and SCO developments. Aarize Group represents the next chapter of their work, with a focus on creating distinctive destinations across different real estate segments.",
  },
  {
    patterns: [
      /where\s+are\s+aarize('s|\s+group)?\s+(current\s+and\s+upcoming\s+)?projects\s+located/i,
      /location\s+of\s+aarize\s+projects/i,
      /where\s+are\s+aarize\s+projects/i,
    ],
    answer:
      "Aarize Group currently has developments across key growth locations in Gurugram and Karnal. Its portfolio includes Aarize South Drive in Sector 69, Aarize The Tessoro in Sector 114 on Dwarka Expressway and Aarize Karnelya in Sector 34, Karnal. The brand is also expanding its residential portfolio in Gurugram.",
  },
  {
    patterns: [
      /quality,\s*transparency\s*and\s*customer\s*commitment/i,
      /how\s+does\s+aarize\s+approach\s+quality/i,
      /quality\s+and\s+transparency/i,
    ],
    answer:
      "For Aarize Group, these are part of the way a development is delivered, not just brand promises. The approach focuses on maintaining quality across development, communicating clearly with stakeholders and taking responsibility through the different stages of a project. Project-specific details and commitments are also subject to the applicable approvals and official documentation.",
  },
  {
    patterns: [
      /sustainability\s+and\s+esg/i,
      /what\s+does\s+sustainability.*mean\s+for\s+aarize/i,
      /griha/i,
      /green\s+building/i,
    ],
    answer:
      "Aarize Group considers sustainability as part of the planning and development process. Depending on the project, this can include green-building standards, resource efficiency, landscaping and other measures that support more responsible development. For example, Aarize The Tessoro is presented as GRIHA 4-Star Pre-Certified.",
  },
  {
    patterns: [
      /upcoming\s+projects\s+and\s+growth\s+plans/i,
      /growth\s+plans/i,
      /future\s+plans\s+of\s+aarize/i,
      /upcoming\s+developments/i,
    ],
    answer:
      "Aarize Group is expanding its portfolio across residential, commercial, retail and township developments, with a focus on high-growth markets. The brand’s recent portfolio includes Aarize South Drive, Aarize The Tessoro and Aarize Karnelya, while its wider growth plan is centred on creating more distinctive developments and strengthening its presence across key markets.",
  },
];

function findCanonicalMatch(text) {
  if (!text || typeof text !== "string") return null;
  const clean = text.trim().replace(/[?!.,]+$/, "");
  for (const item of CANONICAL_QA_LIST) {
    for (const pattern of item.patterns) {
      if (pattern.test(clean)) {
        return item.answer;
      }
    }
  }
  return null;
}

export async function POST(request) {
  try {
    const { messages, userInfo } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Messages array is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const lastMessage = messages[messages.length - 1];
    const userQuestion = lastMessage?.role === "user" ? lastMessage.content : "";

    // Check for exact/canonical Q&A match to guarantee 100% precision with zero hallucination
    const canonicalAnswer = findCanonicalMatch(userQuestion);
    if (canonicalAnswer) {
      const encoder = new TextEncoder();
      const readableStream = new ReadableStream({
        start(controller) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ content: canonicalAnswer })}\n\n`)
          );
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        },
      });

      return new Response(readableStream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
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

