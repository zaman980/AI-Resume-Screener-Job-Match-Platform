import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import axios from 'axios';

export default function PostJob() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('Remote');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const { data } = await api.post('/jobs', { title, company, location, description });
      navigate(`/jobs/${data._id}/applicants`);
    } catch (err) {
      const message = axios.isAxiosError(err) ? err.response?.data?.message : null;
      setError(message || 'Failed to post job.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <p className="eyebrow mb-2">Recruiter</p>
      <h1 className="font-display text-2xl font-semibold">Post a job</h1>
      <p className="mt-2 text-sm text-ink-light">
        Paste the full job description — the more detail, the more accurate the AI match scoring will be for applicants.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {error && <p className="rounded-md bg-flag-light px-3 py-2 text-sm text-flag">{error}</p>}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Job title</label>
            <input required value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" placeholder="Senior Backend Engineer" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Company</label>
            <input required value={company} onChange={(e) => setCompany(e.target.value)} className="input-field" placeholder="Acme Inc." />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Location</label>
          <input value={location} onChange={(e) => setLocation(e.target.value)} className="input-field" placeholder="Remote" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Full job description</label>
          <textarea
            required
            rows={10}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field resize-none"
            placeholder="Responsibilities, required skills, qualifications…"
          />
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? 'Posting…' : 'Post job'}
        </button>
      </form>
    </div>
  );
}
