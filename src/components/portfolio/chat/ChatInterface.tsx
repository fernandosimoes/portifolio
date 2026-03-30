"use client";
// "use client" required: useChat, useState, useEffect, useRef all require browser APIs for streaming

import { useChat } from "@ai-sdk/react";
import { useState, useEffect, useRef, FormEvent } from "react";
import { ChatMessage } from "./ChatMessage";
import { SuggestionChips } from "./SuggestionChips";

export function ChatInterface() {
  const { messages, sendMessage, status, error } = useChat();

  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    sendMessage({ text: trimmed });
    setInput("");
    inputRef.current?.focus();
  };

  const handleChipClick = (prompt: string) => {
    if (isLoading) return;
    sendMessage({ text: prompt });
  };

  return (
    <div className="mt-2 w-full">
      {messages.length === 0 && (
        <div className="space-y-4 mb-6">
          <p className="text-stone-500 text-sm">
            Hi! I&apos;m Fernando&apos;s AI assistant. Ask me anything about his
            professional background.
          </p>
          <SuggestionChips onChipClick={handleChipClick} />
        </div>
      )}

      {error && (
        <div className="text-red-400 text-sm px-4 py-2 mb-4 border border-red-900 bg-red-950">
          {error.message}
        </div>
      )}

      <ol
        role="log"
        aria-live="polite"
        aria-label="Chat conversation"
        className="space-y-1"
      >
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </ol>

      {/* Input inline with conversation, matching terminal prompt style */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row sm:items-center mt-8 pt-4 w-full max-w-3xl"
      >
        <div className="flex items-center mb-2 sm:mb-0">
          <span className="text-fuchsia-500 font-bold shrink-0">➜</span>
          <span className="text-sky-500 ml-2 shrink-0">~</span>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything…"
          aria-label="Chat message input"
          disabled={isLoading}
          autoComplete="off"
          spellCheck={false}
          className="sm:ml-3 flex-1 w-full bg-transparent outline-none text-stone-100 placeholder-stone-700 caret-emerald-500 font-bold tracking-wide text-base disabled:opacity-50"
        />
      </form>
    </div>
  );
}
