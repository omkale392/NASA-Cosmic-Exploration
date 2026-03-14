import { Router, Request, Response, NextFunction } from 'express';
import axios, { AxiosError } from 'axios';

const router = Router();

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

// ── Types ─────────────────────────────────────────────────────────────────────
interface BriefingRequestBody {
  title: string;
  date: string;
  explanation: string;
  mediaType?: string;
}

interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

// ── System & User Prompts ─────────────────────────────────────────────────────
const SYSTEM_PROMPT =
  'You are a NASA Mission Control AI analyst. Generate structured mission briefings in markdown. ' +
  'Be scientific, precise, and engaging. Use relevant emojis for section headers.';

function buildUserPrompt(body: BriefingRequestBody): string {
  return (
    `Generate a mission briefing for NASA APOD — ` +
    `Title: ${body.title}, Date: ${body.date}, Description: ${body.explanation}. ` +
    `Sections: Mission Overview, Key Data Points, Scientific Significance, ` +
    `Environmental Assessment, Risk & Strategic Assessment, Final Mission Directive.`
  );
}

// ── POST /api/ai/briefing ─────────────────────────────────────────────────────
router.post(
  '/briefing',
  async (req: Request<object, object, BriefingRequestBody>, res: Response, next: NextFunction) => {
    try {
      const { title, date, explanation, mediaType } = req.body;

      if (!title || !date || !explanation) {
        return res.status(400).json({
          error: true,
          message: 'Request body must include title, date, and explanation.',
        });
      }

      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) {
        return res.status(503).json({
          error: true,
          message: 'AI briefing service is not configured. Please add a GROQ_API_KEY.',
        });
      }

      const messages: GroqMessage[] = [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildUserPrompt({ title, date, explanation, mediaType }) },
      ];

      const groqRes = await axios.post<GroqResponse>(
        GROQ_API_URL,
        {
          model: GROQ_MODEL,
          messages,
          max_tokens: 1024,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const content = groqRes.data.choices?.[0]?.message?.content;

      if (!content) {
        return res.status(502).json({
          error: true,
          message: 'AI service returned an empty response. Please try again.',
        });
      }

      return res.json({ briefing: content });
    } catch (err) {
      const axiosErr = err as AxiosError<{ error?: { message?: string } }>;

      if (axiosErr.response) {
        const status = axiosErr.response.status;
        const groqMsg =
          axiosErr.response.data?.error?.message ||
          'Groq API returned an error.';

        // Return a graceful fallback instead of crashing
        if (status === 401 || status === 403) {
          return res.status(503).json({
            error: true,
            message: 'AI service authentication failed. Check your GROQ_API_KEY.',
          });
        }

        return res.status(502).json({
          error: true,
          message: `AI service error: ${groqMsg}`,
        });
      }

      return next(err);
    }
  }
);

export default router;
