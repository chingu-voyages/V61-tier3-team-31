import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type AuthCardProps = {
  title: string;
  children: React.ReactNode;
};

export function AuthCard({ title, children }: AuthCardProps) {
  return (
    <main className='flex min-h-screen items-center justify-center'>
      <Card className='w-full sm:max-w-md'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold'>{title}</CardTitle>
        </CardHeader>

        <CardContent>{children}</CardContent>
      </Card>
    </main>
  );
}
