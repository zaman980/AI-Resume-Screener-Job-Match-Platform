import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid items-center gap-16 md:grid-cols-2">
        <div>
          <p className="eyebrow mb-4">AI-powered resume screening</p>
          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            Know your match score
            <br />
            <span className="text-signal">before you apply.</span>
          </h1>
          <p className="mt-6 max-w-md text-ink-light">
            Most resumes never reach a human — filtered out by ATS keyword scans first.
            Signal reads your resume the way the screener does, scores it against a real
            job description, and tells you exactly what to fix.
          </p>
          <div className="mt-8 flex gap-4">
            <Link to="/register" className="btn-primary">Analyze my resume</Link>
            <Link to="/login" className="btn-secondary">I already have an account</Link>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between border-b border-ink/10 pb-4">
            <span className="eyebrow">Sample scan</span>
            <span className="rounded-full bg-signal-light px-3 py-1 font-mono text-xs text-signal">82% match</span>
          </div>
          <div className="mt-4 space-y-3">
            <div>
              <p className="text-xs font-medium text-ink-light">Strengths</p>
              <p className="text-sm">Led cross-functional team of 6, shipped feature used by 40k users</p>
            </div>
            <div>
              <p className="text-xs font-medium text-flag">Missing keywords</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {['Kubernetes', 'CI/CD', 'GraphQL'].map((kw) => (
                  <span key={kw} className="rounded-full bg-flag-light px-2.5 py-0.5 font-mono text-xs text-flag">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-24 grid gap-8 border-t border-ink/10 pt-16 md:grid-cols-3">
        {[
          { title: 'For job seekers', body: 'Upload a resume, paste any job description, get a match score and a concrete fix list — not vague advice.' },
          { title: 'For recruiters', body: 'Post a role, see every applicant ranked by match score with strengths and gaps surfaced automatically.' },
          { title: 'Built on real ATS logic', body: 'Scoring runs on Gemini, prompted to reason the way keyword-matching applicant tracking systems actually work.' },
        ].map((f) => (
          <div key={f.title}>
            <h3 className="font-display font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-ink-light">{f.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
