"use client";

import { type UIMessage } from "ai";
import { motion, useReducedMotion } from "framer-motion";
import { ProjectCard } from "./generative/ProjectCard";
import { CareerTimeline } from "./generative/CareerTimeline";
import { SkillTags } from "./generative/SkillTags";
import { ContactCard } from "./generative/ContactCard";

interface ChatMessageProps {
  message: UIMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const prefersReducedMotion = useReducedMotion();
  const duration = prefersReducedMotion ? 0 : 0.2;

  if (!message.parts || message.parts.length === 0) {
    return null;
  }

  const isUser = message.role === "user";

  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration }}
      className="py-2"
    >
      {isUser ? (
        <div className="flex items-start gap-0 text-base">
          <span className="text-fuchsia-500 font-bold shrink-0">➜</span>
          <span className="text-sky-500 ml-2 shrink-0">~</span>
          <span className="text-stone-100 ml-3 font-bold tracking-wide">
            {message.parts
              .filter((p) => p.type === "text")
              .map((p) => (p as { type: "text"; text: string }).text)
              .join("")}
          </span>
        </div>
      ) : (
        <div className="pl-0 sm:pl-8">
          {message.parts.map((part, index) => {
            if (part.type === "text" && part.text) {
              return (
                <p
                  key={`text-${index}`}
                  className="text-stone-400 text-sm leading-relaxed whitespace-pre-wrap"
                >
                  {part.text}
                </p>
              );
            }

            if (part.type.startsWith("tool-")) {
              const toolPart = part as {
                type: string;
                toolCallId: string;
                state: string;
                output?: Record<string, unknown>;
              };

              if (toolPart.state === "output-available") {
                const output = toolPart.output as Record<string, unknown>;
                const toolName = part.type.replace("tool-", "");

                switch (toolName) {
                  case "renderProjectCard":
                    return (
                      <ProjectCard
                        key={`tool-${index}`}
                        projects={
                          output.projects as {
                            name: string;
                            status: string;
                            description: string;
                            techStack: string[];
                          }[]
                        }
                      />
                    );
                  case "renderCareerTimeline":
                    return (
                      <CareerTimeline
                        key={`tool-${index}`}
                        experience={
                          output.experience as {
                            company: string;
                            role: string;
                            period: string;
                            location: string;
                            description: string;
                            achievements: string[];
                          }[]
                        }
                      />
                    );
                  case "renderSkillTags":
                    return (
                      <SkillTags
                        key={`tool-${index}`}
                        skills={
                          output.skills as {
                            proficient: string[];
                            intermediate: string[];
                            knowledge: string[];
                          }
                        }
                      />
                    );
                  case "renderContactCard":
                    return (
                      <ContactCard
                        key={`tool-${index}`}
                        contact={
                          output.contact as {
                            email: string;
                            linkedin: string;
                            location: string;
                            availability: string;
                          }
                        }
                      />
                    );
                  default:
                    return null;
                }
              }

              if (
                toolPart.state === "input-available" ||
                toolPart.state === "input-streaming"
              ) {
                return (
                  <span
                    key={`tool-loading-${index}`}
                    className="text-stone-600 text-xs animate-pulse"
                  >
                    thinking…
                  </span>
                );
              }
            }

            return null;
          })}
        </div>
      )}
    </motion.li>
  );
}
