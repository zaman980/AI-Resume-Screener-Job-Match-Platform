import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';
import type { JobPosting } from '../types';

export default function Jobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get<JobPosting[]>('/jobs')
      .then(({ data }) => setJobs(data))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <Spinner label="Loading open roles" />;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <p className="eyebrow mb-2">Open roles</p>
      <h1 className="font-display text-2xl font-semibold">Browse job postings</h1>

      {jobs.length === 0 ? (
        <div className="card mt-8 text-center">
          <p className="text-sm text-ink-light">No open roles yet. Check back soon.</p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {jobs.map((job) => (
            <div key={job._id} className="card">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display font-semibold">{job.title}</h3>
                  <p className="text-sm text-ink-light">{job.company} · {job.location}</p>
                </div>
                {user?.role === 'jobseeker' && (
                  <Link to={`/upload?jobId=${job._id}`} className="btn-secondary !px-4 !py-1.5 text-sm">
                    Analyze against this
                  </Link>
                )}
              </div>
              <p className="mt-3 line-clamp-3 text-sm text-ink-light">{job.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
