import { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

interface AccordionItemProps {
  id: string;
  title: string;
  subtitle?: string;
  status?: string;
  meta?: string;
  children: ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
}

export const AccordionItem = ({ 
  id, 
  title, 
  subtitle, 
  status,
  meta,
  children,
  isExpanded,
  onToggle
}: AccordionItemProps) => {
  return (
    <div className="border border-stone-800 bg-stone-950 overflow-hidden transition-colors hover:border-stone-700">
      <button 
        onClick={onToggle}
        className="w-full text-left px-4 py-3 flex items-center justify-between bg-stone-900/40 hover:bg-stone-800/50 transition-colors group focus:outline-none"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className={`text-stone-500 transition-transform duration-200 shrink-0 ${isExpanded ? 'rotate-90 text-stone-300' : 'group-hover:text-stone-400'}`}>
            <ChevronRight className="w-5 h-5" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 truncate">
            <span className="font-bold text-stone-200 text-base">{title}</span>
            {subtitle && <span className="text-stone-500 text-sm truncate">{subtitle}</span>}
            {status && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-stone-800 text-stone-400 rounded-sm inline-block w-fit mt-1 sm:mt-0">{status}</span>}
          </div>
        </div>
        {meta && <span className="text-stone-600 text-xs shrink-0 pl-4">{meta}</span>}
      </button>
      
      {isExpanded && (
        <div className="p-4 md:p-6 border-t border-stone-800 bg-stone-900/10 animate-in slide-in-from-top-2 fade-in duration-200">
          {children}
        </div>
      )}
    </div>
  );
};
