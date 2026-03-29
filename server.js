const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/generate", async (req, res) => {
  try {
    const { prompt, type } = req.body;

    let systemPrompt = "";

    if (type === "caption") {
      systemPrompt = "Buat caption Instagram yang menarik + hashtag.";
    } else if (type === "artikel") {
      systemPrompt = "Tulis artikel singkat yang informatif.";
    } else {
      systemPrompt = "Jawab seperti asisten AI.";
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
    });

    res.json({
      result: response.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Terjadi error" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server jalan di port " + PORT);
});