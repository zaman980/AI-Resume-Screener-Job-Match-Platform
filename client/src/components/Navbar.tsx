import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="border-b border-ink/10 bg-paper/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-signal text-paper">
            <svg width="14" height="14" viewBox="0 0 32 32" fill="none">
              <path d="M6 10V6h4M22 6h4v4M26 22v4h-4M10 26H6v-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="6" y1="16" x2="26" y2="16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">Signal</span>
        </Link>

        <div className="flex items-center gap-6 text-sm">
          {user ? (
            <>
              <Link to="/dashboard" className="text-ink-light hover:text-ink">Dashboard</Link>
              <Link to="/jobs" className="text-ink-light hover:text-ink">Jobs</Link>
              {user.role === 'jobseeker' && (
                <Link to="/upload" className="text-ink-light hover:text-ink">Analyze Resume</Link>
              )}
              {(user.role === 'recruiter' || user.role === 'admin') && (
                <Link to="/post-job" className="text-ink-light hover:text-ink">Post a Job</Link>
              )}
              <span className="eyebrow hidden sm:inline">{user.role}</span>
              <button onClick={handleLogout} className="btn-secondary !px-4 !py-1.5">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-ink-light hover:text-ink">Log in</Link>
              <Link to="/register" className="btn-primary !px-4 !py-1.5">Get started</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
