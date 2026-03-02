import { Terminal } from "lucide-react";

interface TerminalHeaderProps {
  onCommand: (cmd: string) => void;
}

export const TerminalHeader = ({ onCommand }: TerminalHeaderProps) => {
  return (
    <header className="bg-stone-950 border-b border-stone-800 p-4 sticky top-0 z-20 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center text-stone-400 font-bold text-sm tracking-widest uppercase">
          <Terminal className="w-4 h-4 mr-2" />
          FERNANDO_SIMOES.exe
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
         <button onClick={() => onCommand("/about")} className="px-3 h-8 bg-stone-900 hover:bg-stone-800 border border-stone-800 text-xs font-bold text-stone-300 transition-colors uppercase tracking-wider">
           Profile
         </button>
         <button onClick={() => onCommand("/jobs")} className="px-3 h-8 bg-stone-900 hover:bg-stone-800 border border-stone-800 text-xs font-bold text-stone-300 transition-colors uppercase tracking-wider">
           Experience
         </button>
         <button onClick={() => onCommand("/projects")} className="px-3 h-8 bg-stone-900 hover:bg-stone-800 border border-stone-800 text-xs font-bold text-stone-300 transition-colors uppercase tracking-wider">
           Projects
         </button>
         <button onClick={() => onCommand("/skills")} className="px-3 h-8 bg-stone-900 hover:bg-stone-800 border border-stone-800 text-xs font-bold text-stone-300 transition-colors uppercase tracking-wider hidden sm:block">
           Stack
         </button>
      </div>
    </header>
  );
};
