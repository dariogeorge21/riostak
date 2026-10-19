export default function LoginLoading() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-cream pt-20 text-primary">
      <div className="w-full max-w-md p-space-xl border border-primary/10 bg-white animate-pulse">
        <div className="h-6 w-32 bg-primary/10 mb-space-sm" />
        <div className="h-10 w-full bg-primary/5 mb-space-md" />
        <div className="h-10 w-full bg-primary/5" />
      </div>
    </main>
  );
}
