export default function ManageLoading() {
  return (
    <div className="min-h-screen w-full bg-background pt-20 text-primary">
      <div className="mx-auto flex w-full max-w-screen-2xl flex-1 flex-col p-space-xl animate-pulse">
        <div className="h-8 w-48 bg-primary/10 mb-space-md" />
        <div className="h-64 w-full bg-primary/5" />
      </div>
    </div>
  );
}
