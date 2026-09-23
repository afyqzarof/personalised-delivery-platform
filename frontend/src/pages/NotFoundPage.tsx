export function NotFoundPage() {
  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <div
        className="flex flex-col items-center gap-3 text-center text-card-text"
        role="alert"
      >
        <p className="text-xl font-bold text-primary">Page not found</p>
        <p className="text-sm">
          Open your welcome page at{" "}
          <code className="rounded bg-black/5 px-1.5 py-0.5 font-mono text-sm">
            /welcome/:userId
          </code>
          .
        </p>
      </div>
    </main>
  );
}
