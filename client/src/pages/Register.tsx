import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types';
import axios from 'axios';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('jobseeker');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await register(name, email, password, role);
      navigate('/dashboard');
    } catch (err) {
      const message = axios.isAxiosError(err) ? err.response?.data?.message : null;
      setError(message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-6">
      <p className="eyebrow mb-2">Get started</p>
      <h1 className="font-display text-2xl font-semibold">Create your account</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {error && <p className="rounded-md bg-flag-light px-3 py-2 text-sm text-flag">{error}</p>}

        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium">Full name</label>
          <input id="name" required value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Jane Doe" />
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="you@example.com" />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium">Password</label>
          <input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" placeholder="At least 6 characters" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">I am a…</label>
          <div className="grid grid-cols-2 gap-3">
            {(['jobseeker', 'recruiter'] as Role[]).map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => setRole(r)}
                className={`rounded-md border px-4 py-2.5 text-sm font-medium transition-colors ${
                  role === r ? 'border-signal bg-signal-light text-signal' : 'border-ink/15 text-ink-light hover:border-ink/30'
                }`}
              >
                {r === 'jobseeker' ? 'Job seeker' : 'Recruiter'}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-light">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-signal">Log in</Link>
      </p>
    </div>
  );
}
