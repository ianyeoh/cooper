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
import { contract } from '@cooper/ts-rest/src/contract';
import { z } from 'zod';
import { cn } from '@/lib/utils';

const signupSchema = contract.public.auth.signup.body
  .extend({
    confirmPassword: z.string().min(2),
  })
  .superRefine((val, ctx) => {
    if (val.password !== val.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      });
    }
  });
type SignupType = z.infer<typeof signupSchema>;

export function SignupForm({
  onSubmit,
  buttonText,
  buttonAlign = 'end',
  initialValues,
}: {
  onSubmit: (values: SignupType) => void;
  buttonText?: string;
  buttonAlign?: 'start' | 'end' | 'full';
  initialValues?: SignupType;
}) {
  const form = useForm<SignupType>({
    resolver: zodResolver(signupSchema),
    defaultValues: initialValues ?? {
      username: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
    },
  });

  const submitButtonText = buttonText ?? 'Sign up';
  let submitButtonAlignment;
  switch (buttonAlign) {
    case 'start':
      submitButtonAlignment = 'justify-start';
      break;
    case 'end':
      submitButtonAlignment = 'justify-end';
      break;
  }

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
            name='firstName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input
                    placeholder='First name'
                    {...field}
                    data-cy='firstName'
                  />
                </FormControl>
                <FormMessage data-cy='firstNameFeedback' />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='lastName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Last name'
                    {...field}
                    data-cy='lastName'
                  />
                </FormControl>
                <FormMessage data-cy='lastNameFeedback' />
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

          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Confirm password'
                    type='password'
                    {...field}
                    data-cy='confirmPassword'
                  />
                </FormControl>
                <FormMessage data-cy='confirmPasswordFeedback' />
              </FormItem>
            )}
          />

          <div className={cn('w-full flex', submitButtonAlignment)}>
            <Button
              type='submit'
              className={cn(buttonAlign === 'full' ? 'grow' : '')}
              disabled={form.formState.isSubmitting}
              data-cy='submit'
            >
              {form.formState.isSubmitting ? (
                <Spinner size='small' />
              ) : (
                submitButtonText
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
