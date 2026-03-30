import { streamText, convertToModelMessages } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { buildSystemPrompt } from "@/lib/system-prompt";
import { RESUME_DATA } from "@/data/resume";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: "Messages array is required and must not be empty" },
        { status: 400 }
      );
    }

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return Response.json(
        { error: "AI service not configured" },
        { status: 500 }
      );
    }

    const result = streamText({
      model: google("gemini-2.5-flash"),
      system: buildSystemPrompt(),
      messages: await convertToModelMessages(messages),
      maxOutputTokens: 1000,
      tools: {
        renderProjectCard: {
          description: "Display Fernando's projects as visual cards",
          inputSchema: z.object({}),
          execute: async () => ({
            projects: RESUME_DATA.projects,
          }),
        },
        renderCareerTimeline: {
          description:
            "Display Fernando's work experience as a career timeline",
          inputSchema: z.object({}),
          execute: async () => ({
            experience: RESUME_DATA.experience.map((exp) => ({
              company: exp.company,
              role: exp.role,
              period: exp.period,
              location: exp.location,
              description: exp.description,
              achievements: exp.achievements,
            })),
          }),
        },
        renderSkillTags: {
          description:
            "Display Fernando's technical skills grouped by proficiency level",
          inputSchema: z.object({}),
          execute: async () => ({
            skills: {
              proficient: RESUME_DATA.skills.proficient,
              intermediate: RESUME_DATA.skills.intermediate,
              knowledge: RESUME_DATA.skills.knowledge,
            },
          }),
        },
        renderContactCard: {
          description: "Display Fernando's contact information",
          inputSchema: z.object({}),
          execute: async () => ({
            contact: {
              email: RESUME_DATA.contact.email,
              linkedin: RESUME_DATA.contact.linkedin,
              location: RESUME_DATA.location,
              availability: "Open to opportunities",
            },
          }),
        },
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json(
      { error: "AI service temporarily unavailable" },
      { status: 503 }
    );
  }
}
