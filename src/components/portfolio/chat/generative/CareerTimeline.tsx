interface ExperienceEntry {
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
}

interface CareerTimelineProps {
  experience: ExperienceEntry[];
}

export function CareerTimeline({ experience }: CareerTimelineProps) {
  return (
    <div className="border-l-2 border-stone-700 pl-4 space-y-6 mt-3">
      {experience.map((entry) => (
        <div key={`${entry.company}-${entry.period}`} className="font-mono">
          <h3 className="text-emerald-400 font-bold text-sm">
            {entry.company}
          </h3>
          <p className="text-stone-300 text-sm">{entry.role}</p>
          <p className="text-stone-600 text-xs mt-0.5">
            {entry.period} · {entry.location}
          </p>
          <p className="text-stone-400 text-sm mt-2 leading-relaxed">
            {entry.description}
          </p>
        </div>
      ))}
    </div>
  );
}
