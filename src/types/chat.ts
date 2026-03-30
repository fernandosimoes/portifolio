export type ModeState = "terminal" | "chat";

export interface SuggestionChip {
  id: string;
  label: string;
  prompt: string;
}

export type GenerativeComponentType =
  | "renderProjectCard"
  | "renderCareerTimeline"
  | "renderSkillTags"
  | "renderContactCard";
