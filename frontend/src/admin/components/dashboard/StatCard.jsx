import { TrendingUp, TrendingDown } from "lucide-react";

export const StatCard = ({ icon: Icon, label, value, sub, trend, color = "primary" }) => {
  const colorMap = {
    primary: "bg-primary/10 text-primary",
    green: "bg-emerald-500/10 text-emerald-500",
    yellow: "bg-yellow-500/10 text-yellow-500",
    red: "bg-destructive/10 text-destructive",
    blue: "bg-blue-500/10 text-blue-500",
  };

  return (
    <div className="card-base p-5 flex items-start gap-4 hover:border-primary/40 transition-colors">
      <div className={`w-11 h-11 rounded-md flex items-center justify-center shrink-0 ${colorMap[color] || colorMap.primary}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-ui text-xs text-muted-foreground tracking-widest uppercase mb-1">{label}</p>
        <p className="font-display text-foreground text-2xl tracking-wide leading-none">{value}</p>
        {sub && (
          <p className="text-muted-foreground text-xs mt-1 flex items-center gap-1">
            {trend === "up" && <TrendingUp className="w-3 h-3 text-emerald-500" />}
            {trend === "down" && <TrendingDown className="w-3 h-3 text-destructive" />}
            {sub}
          </p>
        )}
      </div>
    </div>
  );
};
