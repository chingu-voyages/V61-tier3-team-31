type MessageFromProps = {
  message?: string | null;
};

export function MessageForm({ message }: MessageFromProps) {
  if (!message) return null;

  return (
    <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
      {message}
    </div>
  );
}
