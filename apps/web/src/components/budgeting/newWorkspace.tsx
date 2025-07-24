'use client';

import { Dispatch, ReactNode, SetStateAction, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ResponsiveDialog } from '@/components/ui/responsiveDialog';
import { Button, ButtonProps } from '@/components/ui/button';
import { WorkspaceForm } from '@/components/forms/workspaceForm';
import { tsr } from '@/lib/tsrQuery';
import { ClientInferRequest } from '@ts-rest/core';
import { contract } from '@cooper/ts-rest/src/contract';
import { toast } from 'sonner';
import { parseError } from '@cooper/ts-rest/src/utils';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

type NewWorkspaceButtonProps = {
  children?: ReactNode;
  open?: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
} & (({ as: 'button' } & ButtonProps) | { as: 'card' } | { as: 'no-trigger' });

export default function NewWorkspace({
  as,
  children,
  open,
  setOpen,
  ...props
}: NewWorkspaceButtonProps) {
  const router = useRouter();
  const [unmanagedOpen, setUnmanagedOpen] = useState<boolean>(false);
  const queryClient = tsr.useQueryClient();
  const { mutate } =
    tsr.protected.budgeting.workspaces.newWorkspace.useMutation();

  const isControlled = open !== undefined && setOpen !== undefined;
  const internalValue = isControlled ? open : unmanagedOpen;
  const setInternalValue = isControlled ? setOpen : setUnmanagedOpen;

  function handleCreateWorkspace(
    body: ClientInferRequest<
      typeof contract.protected.budgeting.workspaces.newWorkspace
    >['body'],
  ) {
    return new Promise<void>((resolve, reject) => {
      mutate(
        { body },
        {
          onSuccess: async ({ body }) => {
            queryClient.invalidateQueries({
              queryKey: ['workspaces'],
            });
            router.push(
              `/app/budgeting/workspaces/${body.workspace.workspaceId}`,
            );
            setInternalValue(false);
            toast.success('Your new workspace was created successfully.');
            resolve();
          },
          onError: async (e) => {
            let errMsg =
              'Failed to create new workspace, please try again later.';

            const error = parseError(e);
            if (error.isKnownError) {
              errMsg = `${error.errMsg}`;
            } else {
              console.log(`Unknown error: ${JSON.stringify(e)}`);
            }

            toast.error(errMsg);
            reject(error);
          },
        },
      );
    });
  }

  let buttonElem;
  const buttonText = children ?? 'Create new workspace';

  switch (as) {
    case 'button':
      buttonElem = (
        <Button
          onClick={() => {
            setInternalValue(true);
          }}
          {...(props as ButtonProps)}
        >
          {buttonText}
        </Button>
      );
      break;
    case 'card':
      buttonElem = null;
      break;
    case 'no-trigger':
      buttonElem = null;
      break;
  }

  return (
    <>
      {buttonElem}
      {as === 'card' ? (
        <Card className='w-[350px]'>
          <CardHeader>
            <CardTitle>Create your first workspace</CardTitle>
            <CardDescription>
              A workspace is a collaborative area where you can invite others to
              view and edit your budgets.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WorkspaceForm onSubmit={handleCreateWorkspace} />
          </CardContent>
        </Card>
      ) : (
        <ResponsiveDialog
          open={internalValue}
          setOpen={setInternalValue}
          title='Create workspace'
          description='A workspace is a collaborative area where you can invite others to view and edit your budgets.'
        >
          <WorkspaceForm onSubmit={handleCreateWorkspace} buttonAlign='full' />
        </ResponsiveDialog>
      )}
    </>
  );
}
