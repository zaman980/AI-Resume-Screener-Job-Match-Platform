import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow mb-2">404</p>
      <h1 className="font-display text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-sm text-ink-light">The page you're looking for doesn't exist or was moved.</p>
      <Link to="/" className="btn-primary mt-6">Back to home</Link>
    </div>
  );
}
