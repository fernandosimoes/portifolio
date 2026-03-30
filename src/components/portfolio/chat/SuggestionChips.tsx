"use client";

import type { SuggestionChip } from "@/types/chat";

const SUGGESTION_CHIPS: SuggestionChip[] = [
  {
    id: "chip-stack",
    label: "What's your tech stack?",
    prompt: "What technologies are you most proficient with?",
  },
  {
    id: "chip-projects",
    label: "Show me your projects",
    prompt: "Tell me about your projects",
  },
  {
    id: "chip-experience",
    label: "Work experience",
    prompt: "Walk me through your career history",
  },
  {
    id: "chip-contact",
    label: "How to reach you",
    prompt: "How can I contact Fernando?",
  },
];

interface SuggestionChipsProps {
  onChipClick: (prompt: string) => void;
}

export function SuggestionChips({ onChipClick }: SuggestionChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {SUGGESTION_CHIPS.map((chip) => (
        <button
          key={chip.id}
          onClick={() => onChipClick(chip.prompt)}
          className="bg-stone-900 hover:bg-stone-800 border border-stone-700 text-xs font-mono text-stone-300 px-3 py-1.5 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}
