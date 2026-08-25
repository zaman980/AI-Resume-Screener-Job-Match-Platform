import { FormEvent, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import Spinner from '../components/Spinner';
import ScoreGauge from '../components/ScoreGauge';
import type { JobPosting, ResumeAnalysis } from '../types';
import axios from 'axios';

export default function UploadResume() {
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [jobId, setJobId] = useState(searchParams.get('jobId') || '');
  const [resumeText, setResumeText] = useState('');
  const [result, setResult] = useState<ResumeAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    api
      .get<JobPosting[]>('/jobs')
      .then(({ data }) => setJobs(data))
      .finally(() => setIsLoadingJobs(false));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setIsAnalyzing(true);
    try {
      const { data } = await api.post<ResumeAnalysis>('/analysis', { resumeText, jobId });
      setResult(data);
    } catch (err) {
      const message = axios.isAxiosError(err) ? err.response?.data?.message : null;
      setError(message || 'Analysis failed. Please try again in a moment.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <p className="eyebrow mb-2">Resume scanner</p>
      <h1 className="font-display text-2xl font-semibold">Check your match score</h1>
      <p className="mt-2 text-sm text-ink-light">
        Paste your resume text and pick a job posting. The AI reads both the way an ATS keyword
        scanner would, then scores the match and tells you what's missing.
      </p>

      {isLoadingJobs ? (
        <Spinner />
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && <p className="rounded-md bg-flag-light px-3 py-2 text-sm text-flag">{error}</p>}

          <div>
            <label className="mb-1.5 block text-sm font-medium">Job posting</label>
            <select required value={jobId} onChange={(e) => setJobId(e.target.value)} className="input-field">
              <option value="" disabled>Select a job…</option>
              {jobs.map((job) => (
                <option key={job._id} value={job._id}>{job.title} — {job.company}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Resume text</label>
            <textarea
              required
              rows={12}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="input-field resize-none font-mono text-xs"
              placeholder="Paste your resume content here…"
            />
          </div>

          <button type="submit" disabled={isAnalyzing} className="btn-primary w-full">
            {isAnalyzing ? 'Scanning…' : 'Run analysis'}
          </button>
        </form>
      )}

      {isAnalyzing && <Spinner label="Reading resume against job description" />}

      {result && (
        <div className="card mt-8">
          <div className="flex items-center gap-6 border-b border-ink/10 pb-6">
            <ScoreGauge score={result.matchScore} />
            <div>
              <h2 className="font-display text-lg font-semibold">Scan complete</h2>
              <p className="text-sm text-ink-light">Here's how your resume stacks up against this role.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-medium text-signal">Strengths</p>
              <ul className="space-y-1.5 text-sm text-ink-light">
                {result.strengths.length > 0 ? result.strengths.map((s, i) => <li key={i}>• {s}</li>) : <li>No standout strengths detected.</li>}
              </ul>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-flag">Missing keywords</p>
              <div className="flex flex-wrap gap-1.5">
                {result.missingKeywords.length > 0 ? (
                  result.missingKeywords.map((kw, i) => (
                    <span key={i} className="rounded-full bg-flag-light px-2.5 py-0.5 font-mono text-xs text-flag">{kw}</span>
                  ))
                ) : (
                  <span className="text-sm text-ink-light">None — good keyword coverage.</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-2 text-xs font-medium text-clay">Suggestions</p>
            <ul className="space-y-1.5 text-sm text-ink-light">
              {result.suggestions.map((s, i) => <li key={i}>• {s}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
