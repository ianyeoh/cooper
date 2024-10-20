import { Dispatch, ReactNode } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { X } from "lucide-react";

export function ResponsiveDialog({
    open,
    setOpen,
    title,
    description,
    asAlert = false,
    children,
}: {
    open: boolean;
    setOpen: Dispatch<boolean>;
    title?: string;
    description?: string;
    asAlert?: boolean;
    children?: ReactNode;
}) {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    if (isDesktop) {
        if (asAlert) {
            return (
                <AlertDialog open={open} onOpenChange={setOpen}>
                    <AlertDialogContent className="sm:max-w-[425px]">
                        <AlertDialogHeader>
                            <AlertDialogTitle>{title}</AlertDialogTitle>
                            <AlertDialogDescription>
                                {description}
                            </AlertDialogDescription>
                            <Button
                                className="absolute top-2 right-4 p-1 h-8 w-8"
                                variant="ghost"
                                onClick={() => setOpen(false)}
                            >
                                <X size={18} />
                            </Button>
                        </AlertDialogHeader>

                        {children}
                    </AlertDialogContent>
                </AlertDialog>
            );
        } else {
            return (
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{title}</DialogTitle>
                            <DialogDescription>{description}</DialogDescription>
                        </DialogHeader>
                        {children}
                    </DialogContent>
                </Dialog>
            );
        }
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>{title}</DrawerTitle>
                    <DrawerDescription>{description}</DrawerDescription>
                </DrawerHeader>
                {children}
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
