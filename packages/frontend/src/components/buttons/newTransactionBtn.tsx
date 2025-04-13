import { useState } from "react";
import { ResponsiveDialog } from "@/components/responsiveDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import TransactionForm from "@/components/forms/transactionForm";
import { contract } from "@cooper/ts-rest/src/contract";
import { ClientInferRequest } from "@ts-rest/core";

export default function NewTransactionButton() {
  const [open, setOpen] = useState<boolean>(false);

  function handleNewTransaction(body: ClientInferRequest<typeof contract.transactions.newTransaction>["body"]) {
    console.log(body);
  }

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
        <TransactionForm onSubmit={handleNewTransaction} />
      </ResponsiveDialog>
    </>
  );
}
