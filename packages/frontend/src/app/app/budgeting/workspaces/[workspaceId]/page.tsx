

export default async function WorkspaceDashboard({ params }: { params: Promise<{ workspaceId: string }> }) {
  const { workspaceId } = await params;
  return <div>WorkspaceId: {workspaceId}</div>;
}
