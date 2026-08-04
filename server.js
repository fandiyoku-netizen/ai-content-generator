import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/chat', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY belum dikonfigurasi di Cloud Run' });

  try {
    const { message } = req.body || {};
    if (!message) return res.status(400).json({ error: 'Pesan tidak boleh kosong' });

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction: 'Kamu adalah AI Assistant spesialis Technical Marketing Engineering dan AdTech.'
    });
    
    const result = await model.generateContent(message);
    return res.json({ reply: result.response.text() });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server GCP Cloud Run aktif di port ${PORT}`));
