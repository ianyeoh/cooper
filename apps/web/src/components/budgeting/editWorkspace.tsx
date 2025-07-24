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
import { Skeleton } from '@/components/ui/skeleton';
import { showConnectionError, showErrorToast } from '@/lib/errorToast';
import { isFetchError } from '@ts-rest/react-query/v5';
import { Budgeting$Workspace } from '@cooper/ts-rest/src/types';

type EditWorkspaceButtonProps = {
  workspaceId: string;
  children?: ReactNode;
  open?: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
} & (({ as: 'button' } & ButtonProps) | { as: 'card' } | { as: 'no-trigger' });

export default function EditWorkspace({
  workspaceId,
  as,
  children,
  open,
  setOpen,
  ...props
}: EditWorkspaceButtonProps) {
  const router = useRouter();
  const { isPending, data, error } =
    tsr.protected.budgeting.workspaces.getWorkspaces.useQuery({
      queryKey: ['workspaces'],
    });

  const [unmanagedOpen, setUnmanagedOpen] = useState<boolean>(false);
  const queryClient = tsr.useQueryClient();
  const { mutate } =
    tsr.protected.budgeting.workspaces.byId.updateWorkspace.useMutation();

  const isControlled = open !== undefined && setOpen !== undefined;
  const internalValue = isControlled ? open : unmanagedOpen;
  const setInternalValue = isControlled ? setOpen : setUnmanagedOpen;

  if (error) {
    if (isFetchError(error)) {
      showConnectionError();
    } else if (error.status === 401) {
      showErrorToast('user', 401, error.body);
      router.push('/login');
    } else {
      showErrorToast('user', error.status, error.body);
    }
  }

  const workspaces: Budgeting$Workspace[] =
    data == null ? [] : data.body.workspaces;
  const workspace = workspaces.find(
    (workspace) => String(workspace.workspaceId) === workspaceId,
  );

  function handleCreateWorkspace(
    body: ClientInferRequest<
      typeof contract.protected.budgeting.workspaces.byId.updateWorkspace
    >['body'],
  ) {
    return new Promise<void>((resolve, reject) => {
      mutate(
        {
          params: {
            workspaceId,
          },
          body,
        },
        {
          onSuccess: async () => {
            queryClient.invalidateQueries({
              queryKey: ['workspaces'],
            });
            setInternalValue(false);
            toast.success('Your workspace was updated successfully.');
            resolve();
          },
          onError: async (e) => {
            let errMsg = 'Failed to update workspace, please try again later.';

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

  // TODO: Change workspace form to new edit workspace form to support adding/removing members
  return (
    <>
      {buttonElem}
      {as === 'card' ? (
        <Card className='w-[350px]'>
          <CardHeader>
            <CardTitle>Update workspace</CardTitle>
            <CardDescription>
              A workspace is a collaborative area where you can invite others to
              view and edit your budgets.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isPending || error ? (
              <Skeleton className='h-10 w-10 rounded-full' />
            ) : (
              <WorkspaceForm
                onSubmit={handleCreateWorkspace}
                buttonText='Update'
                initialValues={workspace}
              />
            )}
          </CardContent>
        </Card>
      ) : (
        <ResponsiveDialog
          open={internalValue}
          setOpen={setInternalValue}
          title='Update workspace'
          description='A workspace is a collaborative area where you can invite others to view and edit your budgets.'
        >
          {isPending || error ? (
            <Skeleton className='h-10 w-10 rounded-full' />
          ) : (
            <WorkspaceForm
              onSubmit={handleCreateWorkspace}
              buttonText='Update'
              buttonAlign='full'
              initialValues={workspace}
            />
          )}
        </ResponsiveDialog>
      )}
    </>
  );
}
