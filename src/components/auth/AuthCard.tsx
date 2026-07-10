import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NexusLogo } from "../nexus-logo";

type AuthCardProps = {
  title: string;
  descr: string;
  children: React.ReactNode;
};

export function AuthCard({ title, descr, children }: AuthCardProps) {
  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader className="flex flex-col justify-center items-center gap-2 border-b border-border text-center">
        <div className="w-16 h-16 rounded-2xl bg-nexus-dark flex items-center justify-center mb-4 shadow-sm">
          <NexusLogo className="w-8 h-8" />
        </div>
        <CardTitle className="text-2xl font-outfit font-bold">{title}</CardTitle>
        <CardDescription>{descr}</CardDescription>
      </CardHeader>

      <CardContent>{children}</CardContent>
    </Card>
  );
}
