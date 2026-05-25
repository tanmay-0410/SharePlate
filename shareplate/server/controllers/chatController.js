import { chatWithGemini } from '../config/gemini.js';

export const sendMessage = async (req, res) => {
  try {
    const { message, context } = req.body;
    if (!message) return res.status(400).json({ message: 'Message is required' });
    const reply = await chatWithGemini(message, context || {});
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
