import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: 'AIzaSyAjuJmNBYG84JEDxk5IofMFPkg90PVM5bA' })

export const requestGemini = async (contents) => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents,
  })
  return response.text
}
