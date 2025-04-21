import { redirect } from "next/navigation";

export default async function BudgetingRoot() {
  redirect(`/app/budgeting/workspaces`);
}
