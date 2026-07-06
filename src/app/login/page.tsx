'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/schemas/login.schema';

import { Button } from '@/components/ui/button';
import { InputForm } from '@/components/form/InputForm';
import { AuthCard } from '@/components/auth/AuthCard';

export default function Login() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, setError } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',

    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(formData: LoginFormData) {
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setError('email', {
          type: 'server',
          message: 'Invalid email or password',
        });

        setError('password', {
          type: 'server',
          message: 'Invalid email or password',
        });

        return;
      }

      router.replace('/');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard title='Log In'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-4'
      >
        <InputForm
          name='email'
          control={control}
          label='Email'
          placeholder='Enter your email'
          autoComplete='email'
        />

        <InputForm
          name='password'
          control={control}
          label='Password'
          type='password'
          placeholder='Enter your password'
          autoComplete='current-password'
        />

        <Button
          type='submit'
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Login'}
        </Button>
        <Link
          href='/register'
          className='text-sm text-center underline'
        >
          Don't have an account? Register
        </Link>
      </form>
    </AuthCard>
  );
}
