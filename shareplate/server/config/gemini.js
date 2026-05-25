import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'demo';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export async function analyzeFood(imageBase64) {
  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [
            { text: 'Analyze this food image. Return JSON: { "foodName": string, "freshnessHours": number, "isSafe": boolean, "spoilageRisk": "low"|"medium"|"high", "category": "veg"|"non-veg", "description": string }' },
            { inline_data: { mime_type: 'image/jpeg', data: imageBase64 } }
          ]
        }]
      }
    );
    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
  } catch (error) {
    console.error('Gemini API error:', error.message);
    return null;
  }
}

export async function chatWithGemini(message, context) {
  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{ text: `You are SharePlate AI assistant. Context: ${JSON.stringify(context)}. User: ${message}` }]
        }]
      }
    );
    return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not process that.';
  } catch (error) {
    console.error('Gemini Chat error:', error.message);
    return 'AI service is currently unavailable. Please try again later.';
  }
}
