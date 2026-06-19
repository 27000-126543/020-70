import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "danger";
  size?: "sm" | "md";
}

export function Badge({ children, variant = "default", size = "sm" }: BadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
  };

  const variantClasses = {
    default: "bg-deep-700 text-slate-300 border border-deep-600",
    primary: "bg-gov-600/20 text-gov-400 border border-gov-500/30",
    success: "bg-risk-low/10 text-risk-low border border-risk-low/30",
    warning: "bg-risk-medium/10 text-risk-medium border border-risk-medium/30",
    danger: "bg-risk-high/10 text-risk-high border border-risk-high/30",
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-sm ${sizeClasses[size]} ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}
