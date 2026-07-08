type MessageFormProps = {
  type: "error" | "success";
  message?: string | null;
};

export function MessageForm({ type, message }: MessageFormProps) {
  if (!message) return null;

  const styles = {
    error: "bg-destructive/10 border-destructive/20 text-destructive",
    success: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600",
  };

  return <div className={`rounded-xl border p-3 text-sm ${styles[type]}`}>{message}</div>;
}
