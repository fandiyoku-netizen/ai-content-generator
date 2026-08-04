import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY belum terpasang di Vercel' });

  try {
    const { message } = req.body || {};
    if (!message) return res.status(400).json({ error: 'Pesan kosong' });

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(message);
    
    return res.status(200).json({ reply: result.response.text() });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}