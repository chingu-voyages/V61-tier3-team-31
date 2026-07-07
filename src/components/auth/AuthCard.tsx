import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type AuthCardProps = {
  title: string;
  descr: string;
  children: React.ReactNode;
};

export function AuthCard({ title, descr, children }: AuthCardProps) {
  return (
    <main className='flex min-h-screen items-center justify-center'>
      <Card className='w-full sm:max-w-md'>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl font-bold'>{title}</CardTitle>
          <CardDescription>{descr}</CardDescription>
        </CardHeader>
        <Separator />

        <CardContent>{children}</CardContent>
      </Card>
    </main>
  );
}
