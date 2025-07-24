'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { z } from 'zod';
import { contract } from '@cooper/ts-rest/src/contract';

const loginSchema = contract.public.auth.login.body;
type LoginType = z.infer<typeof loginSchema>;

export function LoginForm({
  onSubmit,
}: {
  onSubmit: (values: LoginType) => void;
}) {
  const form = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  return (
    <Form {...form}>
      <form className='mt-2' onSubmit={form.handleSubmit(onSubmit)}>
        <div className='space-y-3'>
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder='Username' {...field} data-cy='username' />
                </FormControl>
                <FormMessage data-cy='usernameFeedback' />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Password'
                    type='password'
                    {...field}
                    data-cy='password'
                  />
                </FormControl>
                <FormMessage data-cy='passwordFeedback' />
              </FormItem>
            )}
          />

          <Button
            type='submit'
            className='w-full'
            disabled={form.formState.isSubmitting}
            data-cy='submit'
          >
            {form.formState.isSubmitting ? <Spinner size='small' /> : 'Sign in'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
