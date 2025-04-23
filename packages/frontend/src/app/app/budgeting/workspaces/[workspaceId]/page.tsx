import BudgetingDashboard from "@/components/budgeting/dashboard";

export default async function WorkspaceDashboard({ params }: { params: Promise<{ workspaceId: string }> }) {
  const { workspaceId } = await params;

  return (
    <div>
      <BudgetingDashboard workspaceId={workspaceId} />
    </div>
  );
}
