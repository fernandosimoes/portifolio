"use client";

import { FormEvent, ChangeEvent } from "react";

interface ChatInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export function ChatInput({ value, onChange, onSubmit, isLoading }: ChatInputProps) {
  const isDisabled = isLoading || value.trim() === "";

  return (
    <form
      onSubmit={onSubmit}
      className="bg-stone-900 border-t border-stone-800 px-4 py-3 flex items-center gap-3"
    >
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Ask me anything…"
        aria-label="Chat message input"
        disabled={isLoading}
        autoComplete="off"
        spellCheck={false}
        className="flex-1 bg-transparent text-stone-100 caret-emerald-500 font-mono text-sm outline-none placeholder-stone-600 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={isDisabled}
        aria-label="Send message"
        className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 border border-stone-700 text-xs font-mono text-stone-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
      >
        Send
      </button>
    </form>
  );
}
