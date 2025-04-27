import { toast } from "sonner";

const activeToasts: { [key: string]: string | number } = {};
let connectionErrorToast: string | number | undefined;

export function showErrorToast(errorKey: string, status: number, description?: string | unknown): void {
  if (!(errorKey in activeToasts)) {
    const toastId = toast.error(status, {
      description:
        typeof description === "string" ? description : `Failed to fetch ${errorKey} data. Please try again later.`,
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

export function showConnectionError(): void {
  if (!connectionErrorToast) {
    connectionErrorToast = toast.error("Lost connection", {
      description: "We failed to fetch your data. Please check your internet connection.",
      duration: Infinity,
      closeButton: true,
      dismissible: true,
      onDismiss: (t) => {
        if (connectionErrorToast === t.id) {
          connectionErrorToast = undefined;
        }
      },
    });
  }
}
