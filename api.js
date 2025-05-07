// --- BACKEND (Node.js + Express) ---
// Save this as server.js or api.js in your project root

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import { OpenAI } from 'openai';

config();

const app = express();
const port = process.env.PORT || 3001;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors());
app.use(bodyParser.json());

app.post('/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required.' });

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are MusicVerse Assistant, a customer support bot that helps with information about vinyls, CDs, and the store. Keep responses short and friendly.',
        },
        {
          role: 'user',
          content: message,
        },
      ],
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content;
    res.json({ reply });
  } catch (error) {
    console.error('OpenAI error:', error);
    res.status(500).json({ error: 'Failed to fetch response from assistant.' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
