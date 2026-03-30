import { Mail, Linkedin, MapPin, Circle } from "lucide-react";

interface Contact {
  email: string;
  linkedin: string;
  location: string;
  availability: string;
}

interface ContactCardProps {
  contact: Contact;
}

export function ContactCard({ contact }: ContactCardProps) {
  return (
    <div className="border border-stone-800 bg-stone-900 p-4 mt-3 font-mono space-y-3">
      <div className="flex items-center gap-3">
        <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
        <a
          href={`mailto:${contact.email}`}
          className="text-stone-300 text-sm hover:text-emerald-400 transition-colors"
        >
          {contact.email}
        </a>
      </div>

      <div className="flex items-center gap-3">
        <Linkedin className="w-4 h-4 text-emerald-500 shrink-0" />
        <span className="text-stone-300 text-sm">{contact.linkedin}</span>
      </div>

      <div className="flex items-center gap-3">
        <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
        <span className="text-stone-300 text-sm">{contact.location}</span>
      </div>

      <div className="flex items-center gap-3">
        <Circle className="w-4 h-4 text-emerald-500 shrink-0" />
        <span className="text-emerald-400 text-sm">{contact.availability}</span>
      </div>
    </div>
  );
}
