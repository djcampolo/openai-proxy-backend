import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/check', async (req, res) => {
  const { medicine } = req.body;

  if (!medicine) {
    return res.status(400).json({ error: 'Medicine name is required.' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful assistant specialized in medicine and dietary restrictions.' },
        { role: 'user', content: `List dietary restrictions and foods to avoid with the medicine: ${medicine}` }
      ],
      max_tokens: 300,
    });

    const result = completion.choices[0].message.content;
    res.json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'OpenAI request failed.' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
