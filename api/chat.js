const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const user_msg = req.body.message;

    if (!user_msg) {
      return res.status(400).json({ error: 'Pesan tidak boleh kosong' });
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!geminiApiKey || geminiApiKey === 'PASTE_GEMINI_API_KEY_DI_SINI') {
      return res.status(400).json({ error: 'Gemini API Key belum dimasukkan di lingkungan Vercel!' });
    }

    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const systemInstruction = "Kamu adalah AI Assistant spesialis Technical Marketing Engineering dan AdTech. Bantu pengguna menyusun ad copy, menganalisis data iklan, strategi optimasi campaign, dan checklist SEO. Berikan respon yang terstruktur, jelas, dan lugas dalam Bahasa Indonesia.";

    try {
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: systemInstruction + "\nUser: " + user_msg }] }],
        generationConfig: { temperature: 0.7 },
      });

      const response = await result.response;
      const reply = response.text();

      return res.status(200).json({ reply });
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      return res.status(500).json({ error: `Terjadi kesalahan saat memanggil Gemini API: ${error.message}` });
    }
  } else {
    return res.status(405).json({ error: 'Metode tidak diizinkan' });
  }
};
