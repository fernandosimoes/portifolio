interface Skills {
  proficient: string[];
  intermediate: string[];
  knowledge: string[];
}

interface SkillTagsProps {
  skills: Skills;
}

export function SkillTags({ skills }: SkillTagsProps) {
  return (
    <div className="space-y-4 mt-3 font-mono">
      <SkillSection
        label="Proficient"
        labelColor="text-emerald-400"
        skills={skills.proficient}
        tagBorder="border-emerald-700"
        tagText="text-emerald-300"
      />
      <SkillSection
        label="Intermediate"
        labelColor="text-sky-400"
        skills={skills.intermediate}
        tagBorder="border-sky-800"
        tagText="text-sky-300"
      />
      <SkillSection
        label="Familiar"
        labelColor="text-stone-400"
        skills={skills.knowledge}
        tagBorder="border-stone-700"
        tagText="text-stone-400"
      />
    </div>
  );
}

function SkillSection({
  label,
  labelColor,
  skills,
  tagBorder,
  tagText,
}: {
  label: string;
  labelColor: string;
  skills: string[];
  tagBorder: string;
  tagText: string;
}) {
  return (
    <div>
      <p className={`text-xs font-bold mb-1.5 uppercase tracking-wider ${labelColor}`}>
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {skills.map((skill) => (
          <span
            key={skill}
            className={`text-xs px-2 py-0.5 border ${tagBorder} ${tagText}`}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
