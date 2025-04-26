import { toast } from "sonner";

const activeToasts: { [key: string]: string | number } = {};

export function showErrorToast(errorKey: string, status: number, description?: string): void {
  if (!(errorKey in activeToasts)) {
    const toastId = toast.error(status, {
      description: description ?? `Failed to fetch ${errorKey} data. Please try again later.`,
      duration: Infinity,
      closeButton: true,
      dismissible: true,
      onDismiss: (t) => {
        if (activeToasts[errorKey] === t.id) {
          delete activeToasts[errorKey];
        }
      },
    });

    activeToasts[errorKey] = toastId;
  }
}
