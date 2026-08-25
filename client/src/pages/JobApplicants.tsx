import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import Spinner from '../components/Spinner';
import ScoreGauge from '../components/ScoreGauge';
import type { ResumeAnalysis } from '../types';
import axios from 'axios';

export default function JobApplicants() {
  const { jobId } = useParams();
  const [analyses, setAnalyses] = useState<ResumeAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<ResumeAnalysis[]>(`/analysis/job/${jobId}`)
      .then(({ data }) => setAnalyses(data))
      .catch((err) => {
        const message = axios.isAxiosError(err) ? err.response?.data?.message : null;
        setError(message || 'Failed to load applicants.');
      })
      .finally(() => setIsLoading(false));
  }, [jobId]);

  if (isLoading) return <Spinner label="Loading ranked applicants" />;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <p className="eyebrow mb-2">Applicant ranking</p>
      <h1 className="font-display text-2xl font-semibold">Candidates for this role</h1>

      {error && <p className="mt-6 rounded-md bg-flag-light px-3 py-2 text-sm text-flag">{error}</p>}

      {!error && analyses.length === 0 && (
        <div className="card mt-8 text-center">
          <p className="text-sm text-ink-light">No one has run a match analysis against this job yet.</p>
        </div>
      )}

      <div className="mt-8 space-y-4">
        {analyses.map((a) => (
          <div key={a._id} className="card flex items-center gap-6">
            <ScoreGauge score={a.matchScore} size={72} />
            <div className="flex-1">
              <p className="font-medium">
                {typeof a.user === 'object' ? a.user.name : 'Applicant'}
              </p>
              <p className="text-xs text-ink-light">
                {typeof a.user === 'object' ? a.user.email : ''}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {a.missingKeywords.slice(0, 4).map((kw, i) => (
                  <span key={i} className="rounded-full bg-flag-light px-2 py-0.5 font-mono text-[11px] text-flag">{kw}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
