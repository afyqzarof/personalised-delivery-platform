import { useParams } from "react-router-dom";
import { DeliveryCard } from "../components/DeliveryCard";
import { useDelivery } from "../hooks/useDelivery";

function errorCopy(status: number): string {
  switch (status) {
    case 404:
      return "We couldn't find that account.";
    case 400:
      return "That account link doesn't look right.";
    default:
      return "Something went wrong while loading your delivery.";
  }
}

export function WelcomePage() {
  const { userId } = useParams<{ userId: string }>();
  const query = useDelivery(userId);

  // A missing userId never reaches the backend (the query stays disabled), so
  // treat it as a bad link — same 400 the API returns for a malformed id.
  const showError = !userId || query.isError;
  const errorStatus = query.error?.status ?? 400;

  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      {userId && query.isPending && (
        <div
          className="flex flex-col items-center gap-3 text-center text-card-text"
          role="status"
          aria-live="polite"
        >
          <span
            className="size-9 animate-spin rounded-full border-4 border-primary/20 border-t-primary motion-reduce:animate-none"
            aria-hidden="true"
          />
          <p>Loading your next delivery…</p>
        </div>
      )}

      {showError && (
        <div
          className="flex flex-col items-center gap-3 text-center text-card-text"
          role="alert"
        >
          <p className="text-xl font-bold text-primary">
            {errorCopy(errorStatus)}
          </p>
          <p className="text-sm">Please check the link or try again later.</p>
        </div>
      )}

      {query.isSuccess && <DeliveryCard delivery={query.data} />}
    </main>
  );
}
