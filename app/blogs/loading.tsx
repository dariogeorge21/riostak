export default function BlogsLoading() {
  return (
    <main className="flex min-h-screen w-full flex-col justify-between bg-cream pt-20 text-primary">
      <div className="mx-auto flex w-full max-w-screen-2xl flex-1 flex-col px-margin py-space-2xl lg:px-margin-desktop lg:py-space-3xl animate-pulse">
        <div className="h-5 w-64 bg-primary/10 mb-space-xl" />
        <div className="h-20 w-full max-w-xl bg-primary/10 mb-space-md" />
        <div className="h-10 w-full max-w-md bg-primary/10 mb-space-2xl" />
        <div className="h-64 w-full bg-primary/5" />
      </div>
    </main>
  );
}
