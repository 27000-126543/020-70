import { Users, Hash, TrendingUp } from "lucide-react";
import type { SpreadAccount } from "@/types";
import { formatFollowers } from "@/utils/format";

interface AccountListProps {
  accounts: SpreadAccount[];
}

export function AccountList({ accounts }: AccountListProps) {
  const sortedAccounts = [...accounts].sort((a, b) => b.influence - a.influence);

  return (
    <div className="space-y-3">
      {sortedAccounts.map((account, index) => (
        <div
          key={account.id}
          className="card-base p-4 flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-full bg-deep-600 flex items-center justify-center text-white font-bold">
            {index + 1}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-sm font-medium text-white truncate">
                {account.name}
              </h4>
              <span className="text-xs text-slate-500">{account.platform}</span>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {formatFollowers(account.followers)}
              </span>
              <span className="flex items-center gap-1">
                <Hash className="w-3.5 h-3.5" />
                {account.postCount}篇
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1 text-risk-low">
              <TrendingUp className="w-4 h-4" />
              <span className="font-mono font-semibold">{account.influence}</span>
            </div>
            <p className="text-xs text-slate-500">影响力</p>
          </div>
        </div>
      ))}
    </div>
  );
}
