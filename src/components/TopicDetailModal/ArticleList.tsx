import { FileText, ExternalLink } from "lucide-react";
import type { ArticleSummary } from "@/types";
import { formatDateTime, getSentimentLabel } from "@/utils/format";
import { Badge } from "@/components/ui/Badge";

interface ArticleListProps {
  articles: ArticleSummary[];
}

export function ArticleList({ articles }: ArticleListProps) {
  const getSentimentVariant = (sentiment: number) => {
    if (sentiment > 0.3) return "success";
    if (sentiment < -0.3) return "danger";
    return "default";
  };

  return (
    <div className="space-y-3">
      {articles.map((article) => (
        <div
          key={article.id}
          className="card-base p-4 hover:bg-deep-700/50 transition-colors"
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <h4 className="text-sm font-medium text-white leading-snug flex-1">
              {article.title}
            </h4>
            <Badge variant={getSentimentVariant(article.sentiment) as any} size="sm">
              {getSentimentLabel(article.sentiment)}
            </Badge>
          </div>

          <p className="text-sm text-slate-400 leading-relaxed mb-3 line-clamp-3">
            {article.summary}
          </p>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                {article.source}
              </span>
              <span>{formatDateTime(article.publishTime)}</span>
            </div>
            <a
              href={article.url}
              className="flex items-center gap-1 text-gov-400 hover:text-gov-300 transition-colors"
            >
              查看原文
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
