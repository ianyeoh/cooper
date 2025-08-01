// // import { headers } from "next/headers";
// import TransactionsTable from "@/components/budgeting/transactionsTable";
// import { fetch } from "@/lib/ts-rest-server";
// import { redirect } from "next/navigation";
// import { contract } from "@cooper/ts-rest/src/contract";
// import { ClientInferResponseBody } from "@ts-rest/core";

// async function getTransactionData(): Promise<
//   ClientInferResponseBody<
//     typeof contract.protected.budgeting.workspaces.byId.transactions.getTransactions,
//     200
//   >["transactions"]
// > {
//   const response = await fetch.transactions.getTransactions();

//   if (response.status === 200) {
//     return response.body.records;
//   } else {
//     redirect("/login");
//   }
// }

// export default async function TransactionsPage({
//   searchParams, // next.js URL search params
// }: {
//   searchParams?: { [key: string]: string | string[] | undefined };
// }) {
//   // const headersList = headers();

//   const transactions = await getTransactionData();

//   return (
//     <div className="mt-2 w-full">
//       <TransactionsTable
//         initialTransactions={transactions}
//         initialDateFilter={undefined}
//         initialAccountFilter={undefined}
//       />
//     </div>
//   );
// }

'use client';

export default function TransactionsPage() {
  return <div>Transactions</div>;
}
