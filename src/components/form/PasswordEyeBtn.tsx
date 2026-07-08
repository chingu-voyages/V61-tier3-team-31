import { Eye, EyeOff } from "lucide-react";

type PasswordEyeProps = {
  show: boolean;
  onToggle: () => void;
};

export function PasswordEyeBtn({ show, onToggle }: PasswordEyeProps) {
  return (
    <button
      type="button"
      aria-label={show ? "Hide password" : "Show password"}
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
    >
      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  );
}
