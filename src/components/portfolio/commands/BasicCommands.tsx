import { RESUME_DATA } from "@/data/resume";
import { ReactNode } from "react";

const ClickableCmd = ({ cmdText, label, onCommand }: { cmdText: string, label?: string, onCommand: (cmd: string) => void }) => (
  <span 
    className="text-sky-400 hover:text-sky-300 hover:bg-sky-950/50 cursor-pointer transition-all border-b border-sky-400/30 font-bold px-1 rounded-sm inline-block"
    onClick={() => onCommand(cmdText)}
  >
    {label || cmdText}
  </span>
);

export const AboutCommand = () => {
  return (
    <div className="mt-2 w-full max-w-5xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-16 h-16 bg-stone-800 border-2 border-stone-700 flex items-center justify-center overflow-hidden shrink-0">
          <span className="text-2xl font-black text-stone-600">FS</span>
        </div>
        <div>
          <div className="text-emerald-400 text-2xl font-black tracking-tight">{RESUME_DATA.name}</div>
          <div className="text-stone-400 font-mono text-sm">{'/*'} {RESUME_DATA.role} {'*/'}</div>
        </div>
      </div>
      
      <div className="border-l-2 border-stone-800 pl-4 py-2 mt-4 text-stone-300 leading-relaxed">
        <p className="mb-4">{RESUME_DATA.summary}</p>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-xs font-bold text-stone-500 mt-4 bg-stone-900/50 p-3 rounded-sm border border-stone-800">
          <div className="flex gap-2 items-center">
            <span className="text-emerald-500 uppercase tracking-widest text-[10px]">Location:</span> {RESUME_DATA.location}
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-emerald-500 uppercase tracking-widest text-[10px]">Email:</span> 
            <a href={`mailto:${RESUME_DATA.contact.email}`} className="text-sky-400 hover:text-sky-300 transition-colors">{RESUME_DATA.contact.email}</a>
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-emerald-500 uppercase tracking-widest text-[10px]">Network:</span> 
            <a href={`https://${RESUME_DATA.contact.linkedin}`} target="_blank" rel="noreferrer" className="text-sky-400 hover:text-sky-300 transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export const HelpCommand = ({ onCommand }: { onCommand: (cmd: string) => void }) => {
  return (
    <div className="mt-2 text-sm max-w-2xl border-l border-stone-800 pl-4 text-stone-400">
      <div className="mb-4">System commands available:</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div><ClickableCmd cmdText="/about" onCommand={onCommand} /> - Profile & Contact</div>
        <div><ClickableCmd cmdText="/projects" onCommand={onCommand} /> - Shipped Codebases</div>
        <div><ClickableCmd cmdText="/jobs" onCommand={onCommand} /> - Career History</div>
        <div><ClickableCmd cmdText="/skills" onCommand={onCommand} /> - Tech Stack</div>
        <div><ClickableCmd cmdText="/clear" onCommand={onCommand} /> - Clear Terminal</div>
      </div>
    </div>
  );
};

export const SkillsCommand = () => {
  return (
    <div className="mt-4 w-full max-w-5xl">
       <div className="text-stone-500 font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-fuchsia-500 inline-block"></span>
        System Modules
      </div>
       <div className="flex flex-wrap gap-2">
        {RESUME_DATA.skills.proficient.map(skill => (
          <span key={skill} className="px-3 py-1.5 bg-stone-900 border border-stone-800 text-stone-200 text-sm hover:border-fuchsia-500/50 transition-colors cursor-default">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

export const NotFoundCommand = ({ cmd, onCommand }: { cmd: string, onCommand: (cmd: string) => void }) => {
  return (
    <div className="text-rose-400 mt-2">
      zsh: command not found: {cmd}. Try <ClickableCmd cmdText="/help" onCommand={onCommand} />.
    </div>
  );
};
