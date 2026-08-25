import { GoogleGenAI } from '@google/genai';

let ai;
const getClient = () => {
  if (!ai) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return ai;
};

const cleanJson = (text) => text.replace(/```json/gi, '').replace(/```/g, '').trim();

export async function analyzeResume(resumeText, jobDescription) {
  const client = getClient();
  const modelName = (process.env.GEMINI_MODEL || 'gemini-3.6-flash').replace(/['"]/g, '').trim();

  const prompt = `You are an ATS (Applicant Tracking System) resume analyzer.
Compare the RESUME to the JOB DESCRIPTION below and evaluate the match.
Return ONLY strict JSON, no markdown formatting, no commentary, in exactly this shape:
{
  "matchScore": <number 0-100>,
  "missingKeywords": [<string>, ...],
  "strengths": [<string>, ...],
  "suggestions": [<string>, ...]
}
RESUME:
"""
${resumeText}
"""
JOB DESCRIPTION:
"""
${jobDescription}
"""`;

  const response = await client.models.generateContent({
    model: modelName,
    contents: prompt,
  });

  const rawText = response.text;

  let parsed;
  try {
    parsed = JSON.parse(cleanJson(rawText));
  } catch (err) {
    throw new Error('AI response could not be parsed as JSON. Please try again.');
  }

  return {
    matchScore: typeof parsed.matchScore === 'number' ? Math.max(0, Math.min(100, parsed.matchScore)) : 0,
    missingKeywords: Array.isArray(parsed.missingKeywords) ? parsed.missingKeywords : [],
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
    suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
  };
}