import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import ScoreGauge from '../components/ScoreGauge';
import type { ResumeAnalysis, JobPosting } from '../types';

export default function Dashboard() {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState<ResumeAnalysis[]>([]);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        if (user?.role === 'jobseeker' || user?.role === 'admin') {
          const { data } = await api.get<ResumeAnalysis[]>('/analysis/mine');
          setAnalyses(data);
        }
        if (user?.role === 'recruiter' || user?.role === 'admin') {
          const { data } = await api.get<JobPosting[]>('/jobs', { params: { mine: true } });
          setJobs(data);
        }
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [user]);

  if (isLoading) return <Spinner label="Loading your dashboard" />;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <p className="eyebrow mb-2">Dashboard</p>
      <h1 className="font-display text-2xl font-semibold">Welcome back, {user?.name?.split(' ')[0]}</h1>

      {(user?.role === 'jobseeker' || user?.role === 'admin') && (
        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Your resume scans</h2>
            <Link to="/upload" className="btn-primary !px-4 !py-2 text-sm">New analysis</Link>
          </div>

          {analyses.length === 0 ? (
            <div className="card text-center">
              <p className="text-sm text-ink-light">No scans yet. Upload a resume against a job posting to see your match score.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {analyses.map((a) => (
                <div key={a._id} className="card flex items-center gap-4">
                  <ScoreGauge score={a.matchScore} size={72} />
                  <div>
                    <p className="font-medium">
                      {typeof a.job === 'object' ? a.job.title : 'Job posting'}
                    </p>
                    <p className="text-xs text-ink-light">
                      {typeof a.job === 'object' ? a.job.company : ''}
                    </p>
                    <p className="mt-1 font-mono text-[11px] text-ink-light">
                      {new Date(a.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {(user?.role === 'recruiter' || user?.role === 'admin') && (
        <section className="mt-12">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Your job postings</h2>
            <Link to="/post-job" className="btn-primary !px-4 !py-2 text-sm">Post a job</Link>
          </div>

          {jobs.length === 0 ? (
            <div className="card text-center">
              <p className="text-sm text-ink-light">You haven't posted any jobs yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => (
                <Link
                  key={job._id}
                  to={`/jobs/${job._id}/applicants`}
                  className="card flex items-center justify-between transition-colors hover:border-signal"
                >
                  <div>
                    <p className="font-medium">{job.title}</p>
                    <p className="text-xs text-ink-light">{job.company} · {job.location}</p>
                  </div>
                  <span className="eyebrow">View applicants →</span>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
