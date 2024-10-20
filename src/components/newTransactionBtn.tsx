import { useState } from "react";
import { ResponsiveDialog } from "@/components/responsiveDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { NewTransactionForm } from "@/components/forms/newTransactionForm";

export default function NewTransactionButton() {
    const [open, setOpen] = useState<boolean>(false);

    function onSubmit() {}

    return (
        <>
            <Button
                variant="outline"
                onClick={() => {
                    setOpen(true);
                }}
                className="gap-1 px-0 w-9 sm:px-3 sm:w-auto"
            >
                <Plus size={13} />
                <span className="sm:inline hidden">New transaction</span>
            </Button>
            <ResponsiveDialog
                open={open}
                setOpen={setOpen}
                title="Create new transaction"
                description="Manually enter a new transaction"
            >
                <NewTransactionForm onSubmit={onSubmit} />
            </ResponsiveDialog>
        </>
    );
}
