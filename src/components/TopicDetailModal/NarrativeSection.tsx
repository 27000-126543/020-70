import type { NarrativeAngle } from "@/types";
import { Badge } from "@/components/ui/Badge";

interface NarrativeSectionProps {
  angles: NarrativeAngle[];
}

export function NarrativeSection({ angles }: NarrativeSectionProps) {
  const colors = ["bg-gov-500", "bg-risk-medium", "bg-risk-high", "bg-risk-low"];

  const sortedAngles = [...angles].sort((a, b) => b.ratio - a.ratio);

  return (
    <div className="space-y-4">
      {sortedAngles.map((angle, index) => (
        <div key={angle.id} className="card-base p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Badge variant="primary" size="sm">
                {index + 1}
              </Badge>
              <h4 className="text-sm font-medium text-white">{angle.angle}</h4>
            </div>
            <span className="text-sm font-mono font-semibold text-white">
              {angle.ratio}%
            </span>
          </div>

          <p className="text-sm text-slate-400 mb-3">{angle.description}</p>

          <div className="h-2 bg-deep-900 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${colors[index % colors.length]} transition-all duration-700`}
              style={{ width: `${angle.ratio}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
