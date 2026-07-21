type MessageFormProps = {
  type: "error" | "success";
  message?: string | null;
};

export function MessageForm({ type, message }: MessageFormProps) {
  if (!message) return null;

  const styles = {
    error: "bg-destructive/10 border-destructive/20 text-destructive",
    success: "bg-primary/10 border-primary/20 text-primary",
  };

  return (
    <div className={`rounded-xl border p-3 mb-6 text-sm text-center ${styles[type]}`}>
      {message}
    </div>
  );
}
