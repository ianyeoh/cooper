'use client';

import { useRouter } from 'next/navigation';
import { Button, ButtonProps } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
  DropdownMenuItem,
  DropdownMenuItemProps,
} from '@/components/ui/dropdown-menu';
import { tsr } from '@/lib/tsrQuery';
import { ReactNode } from 'react';

type LogoutButtonType = ButtonProps & { as: 'button' };

type LogoutDropdownType = DropdownMenuItemProps & { as: 'dropdownMenuItem' };

type LogoutButtonProps = {
  children?: ReactNode;
} & (LogoutButtonType | LogoutDropdownType);

export default function LogoutButton({
  as,
  children,
  ...props
}: LogoutButtonProps) {
  const router = useRouter();
  const queryClient = tsr.useQueryClient();
  const { mutate, isPending } = tsr.public.auth.logout.useMutation({
    onSuccess: () => {
      router.push('/login');
    },
    onError: () => {
      router.push('/login');
    },
  });

  function handleLogout() {
    mutate({ body: {} });
    queryClient.clear();
  }

  const buttonText = children ?? 'Log out';

  switch (as) {
    case 'button':
      return (
        <Button
          onClick={handleLogout}
          disabled={isPending}
          {...(props as ButtonProps)}
        >
          {isPending ? <Spinner size='small' /> : buttonText}
        </Button>
      );
    case 'dropdownMenuItem':
      return (
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isPending}
          {...(props as DropdownMenuItemProps)}
        >
          {isPending ? <Spinner size='small' /> : buttonText}
        </DropdownMenuItem>
      );
  }
}
