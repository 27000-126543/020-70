import { Newspaper, MessageCircle, Building2 } from "lucide-react";
import type { TimelineEvent } from "@/types";
import { formatDate } from "@/utils/format";

interface TimelineSectionProps {
  events: TimelineEvent[];
}

export function TimelineSection({ events }: TimelineSectionProps) {
  const typeIcons = {
    media: <Newspaper className="w-4 h-4" />,
    social: <MessageCircle className="w-4 h-4" />,
    official: <Building2 className="w-4 h-4" />,
  };

  const typeColors = {
    media: "bg-gov-500/20 text-gov-400 border-gov-500/30",
    social: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    official: "bg-risk-low/20 text-risk-low border-risk-low/30",
  };

  const typeLabels = {
    media: "媒体报道",
    social: "社交热议",
    official: "官方动态",
  };

  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
  );

  return (
    <div className="relative pl-6">
      <div className="absolute left-2 top-2 bottom-2 w-px bg-deep-600" />

      <div className="space-y-4">
        {sortedEvents.map((event) => (
          <div key={event.id} className="relative">
            <div
              className={`absolute -left-6 w-4 h-4 rounded-full border-2 ${typeColors[event.type]} flex items-center justify-center`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  event.type === "media"
                    ? "bg-gov-400"
                    : event.type === "social"
                    ? "bg-purple-400"
                    : "bg-risk-low"
                }`}
              />
            </div>

            <div className="card-base p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-slate-500 font-mono">
                  {formatDate(event.time)}
                </span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-sm ${typeColors[event.type]}`}
                >
                  {typeLabels[event.type]}
                </span>
              </div>
              <p className="text-sm text-slate-200">{event.event}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
