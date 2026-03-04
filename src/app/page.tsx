"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { TerminalHeader } from "@/components/portfolio/terminal/TerminalHeader";
import { 
  AboutCommand, 
  HelpCommand, 
  SkillsCommand, 
  NotFoundCommand 
} from "@/components/portfolio/commands/BasicCommands";
import { ProjectsCommand } from "@/components/portfolio/commands/ProjectsCommand";
import { JobsCommand } from "@/components/portfolio/commands/JobsCommand";
import { RESUME_DATA } from "@/data/resume";

type HistoryItem = {
  id: string;
  type: "command" | "output";
  content?: ReactNode;
  cmd?: string;
};

export default function Portfolio() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  // Accordion state managed centrally so expanding items works across commands
  const [collapsedItems, setCollapsedItems] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    RESUME_DATA.projects.forEach((_, idx) => { if (idx > 0) initial.add(`proj-/projects-${idx}`); });
    RESUME_DATA.experience.forEach((_, idx) => { if (idx > 0) initial.add(`job-/jobs-${idx}`); });
    return initial;
  });

  const toggleCollapse = (id: string) => {
    setCollapsedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Initialize terminal
  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      setHistory([
        { id: "init-cmd", type: "command", cmd: "whoami" },
        { id: "init-out", type: "output", cmd: "whoami" }
      ]);
    }
  }, []);

  // Scroll to bottom of terminal when history changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, collapsedItems]);

  const handleCommand = (cmd: string, addToHistory = true) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    if (trimmedCmd === "/clear") {
      setHistory([]);
      setInput("");
      return;
    }

    if (addToHistory) {
      setHistory(prev => [
        ...prev, 
        { id: Date.now().toString() + "-cmd", type: "command", cmd: trimmedCmd },
        { id: Date.now().toString() + "-out", type: "output", cmd: trimmedCmd }
      ]);
      setInput("");
    }
  };

  const renderCommandOutput = (cmd: string): ReactNode => {
    const trimmedCmd = cmd.trim();
    
    switch (trimmedCmd) {
      case "whoami":
      case "/about":
        return <AboutCommand />;
      case "/help":
        return <HelpCommand onCommand={handleCommand} />;
      case "/projects":
        return <ProjectsCommand collapsedItems={collapsedItems} toggleCollapse={toggleCollapse} />;
      case "/jobs":
        return <JobsCommand collapsedItems={collapsedItems} toggleCollapse={toggleCollapse} />;
      case "/skills":
        return <SkillsCommand />;
      default:
        return <NotFoundCommand cmd={trimmedCmd} onCommand={handleCommand} />;
    }
  };

  return (
    <div className="h-screen bg-stone-950 text-stone-400 font-mono flex flex-col overflow-hidden selection:bg-emerald-500 selection:text-stone-950 relative">
      <TerminalHeader onCommand={handleCommand} />

      {/* Main Terminal Area */}
      <div className="flex-1 overflow-y-auto w-full flex flex-col px-4 md:px-8 bg-stone-950 custom-scrollbar">
        
        {/* Terminal History */}
        <div className="flex-1 py-8 flex flex-col w-full max-w-5xl mx-auto">
          {history.map((item, idx) => (
            <div key={item.id} className={`${idx !== 0 && item.type === "command" ? "mt-12" : "mb-2"} flex flex-col`}>
              {item.type === "command" ? (
                <div className="flex items-center text-base mb-2">
                  <span className="text-fuchsia-500 font-bold shrink-0">➜</span> 
                  <span className="text-sky-500 ml-2 shrink-0">~</span> 
                  <span className="text-stone-100 ml-3 font-bold tracking-wide">{item.cmd || item.content}</span>
                </div>
              ) : (
                <div className="pl-0 sm:pl-8 text-sm md:text-base w-full">
                  {item.cmd ? renderCommandOutput(item.cmd) : item.content}
                </div>
              )}
            </div>
          ))}

          {/* Prompt Input */}
          <div className="flex flex-col sm:flex-row sm:items-center mt-8 pt-4 pb-12 w-full max-w-3xl">
            <div className="flex items-center mb-2 sm:mb-0">
               <span className="text-fuchsia-500 font-bold shrink-0">➜</span> 
               <span className="text-sky-500 ml-2 shrink-0">~</span>
            </div>
            <form 
              className="sm:ml-3 flex-1 w-full relative" 
              onSubmit={(e) => { e.preventDefault(); handleCommand(input); }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full bg-transparent outline-none text-stone-100 placeholder-stone-700 caret-emerald-500 font-bold tracking-wide text-base pl-8 sm:pl-0"
                autoFocus
                spellCheck="false"
                autoComplete="off"
                placeholder="Ex: /help"
              />
            </form>
          </div>
          
          <div ref={bottomRef} className="h-8"></div>
        </div>
      </div>
    </div>
  );
}
