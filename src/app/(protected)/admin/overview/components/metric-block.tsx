type MetricBlockProps = {
  icon: React.ReactNode;
  color: {
    bg: string;
    text: string;
  };
  value: string;
  label: string;
  subtext: string;
};

export function MetricBlock({ icon, color, value, label, subtext }: MetricBlockProps) {
  return (
    <div className="flex items-center gap-3 p-3">
      <div className={`size-9 rounded-full flex items-center justify-center shrink-0 ${color.bg}`}>
        <span className={`size-4 ${color.text}`}>{icon}</span>
      </div>
      <div className="min-w-0">
        <div className="font-outfit text-xl font-bold text-foreground dark:text-foreground leading-none">
          {value}
        </div>
        <div className="text-[11px] font-semibold text-muted-foreground dark:text-foreground/70 leading-tight truncate">
          {label}
        </div>
        <div className="text-[10px] text-muted-foreground/70 font-medium mt-0.5">{subtext}</div>
      </div>
    </div>
  );
}
