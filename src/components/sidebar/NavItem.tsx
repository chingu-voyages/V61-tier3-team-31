export function NavItem({
  icon,
  label,
  active = false,
  badge = "",
  onClick,
  isExpanded = true,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: string;
  onClick?: () => void;
  isExpanded?: boolean;
}) {
  return (
    <button
      title={!isExpanded ? label : undefined}
      onClick={onClick}
      className={`w-full flex items-center ${isExpanded ? "justify-between px-3" : "justify-center px-0"} py-2.5 rounded-xl transition-colors cursor-pointer relative ${
        active
          ? "bg-white/10 text-white font-medium"
          : "text-muted-foreground hover:text-foreground hover:bg-white/5"
      }`}
    >
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
      )}
      <div className={`flex items-center ${isExpanded ? "gap-3" : ""}`}>
        {icon}
        {isExpanded && <span className="text-sm">{label}</span>}
      </div>
      {isExpanded && badge && (
        <span
          className={`text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full ${
            active ? "bg-primary/20 text-primary" : "bg-white/10 text-muted-foreground"
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
}
