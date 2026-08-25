export type Role = 'jobseeker' | 'recruiter' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface JobPosting {
  _id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  isActive: boolean;
  recruiter: { _id: string; name: string; email: string } | string;
  createdAt: string;
}

export interface ResumeAnalysis {
  _id: string;
  user: string | { _id: string; name: string; email: string };
  job: string | { _id: string; title: string; company: string };
  resumeText: string;
  matchScore: number;
  missingKeywords: string[];
  strengths: string[];
  suggestions: string[];
  createdAt: string;
}

export interface ApiError {
  message: string;
}
