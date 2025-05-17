import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: 'AIzaSyBB7YVy_LGVWngsvyUvqrPBpoYV5EXM7pk' })

export const requestGemini = async (contents) => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents,
  })
  return response.text
}
