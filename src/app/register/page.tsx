'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  registerSchema,
  type RegisterFormData,
} from '@/schemas/register.schema';
import Link from 'next/link';

import { timezones } from '@/constants/timezones';
import { Button } from '@/components/ui/button';
import { AuthCard } from '@/components/auth/AuthCard';
import { InputForm } from '@/components/form/InputForm';
import { SelectForm } from '@/components/form/SelectForm';

export default function Register() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',

    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      timezone: '',
    },
  });

  async function onSubmit(formData: RegisterFormData) {
    setLoading(true);
    setSuccessMessage('');

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            timezone: formData.timezone,
          },
        },
      });

      if (error) {
        setError('root', {
          type: 'server',
          message: 'Unable to create your account. Please try again.',
        });

        return;
      }

      if (data.user?.identities?.length === 0) {
        setError('email', {
          type: 'server',
          message: 'This email is already registered.',
        });

        return;
      }

      setSuccessMessage(
        '✓ Registration successful! Please check your email to verify your account before signing in.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title='Create account'
      descr='Join Cohorix and start your journey'
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-4'
      >
        <InputForm
          name='name'
          control={control}
          label='Full Name'
          placeholder='Enter your name'
          autoComplete='name'
        />
        <InputForm
          name='email'
          control={control}
          label='Email address'
          placeholder='Enter your email'
          autoComplete='email'
        />
        <InputForm
          name='password'
          control={control}
          label='Password'
          type='password'
          placeholder='Enter your password'
          autoComplete='new-password'
        />
        <InputForm
          name='confirmPassword'
          control={control}
          label='Confirm password'
          type='password'
          placeholder='Repeat password'
        />
        <SelectForm
          name='timezone'
          control={control}
          label='Time zone'
          options={timezones}
        />
        {errors.root && (
          <div className='rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700'>
            {errors.root.message}
          </div>
        )}
        {successMessage && (
          <div className='rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700'>
            {successMessage}
          </div>
        )}
        <Button
          type='submit'
          disabled={loading}
        >
          {loading ? 'Creating account...' : 'Create account'}
        </Button>
        <p className='text-center'>
          Already have an account?
          <Link
            href='/login'
            className='text-sm text-center text-ring font-semibold ml-1'
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
