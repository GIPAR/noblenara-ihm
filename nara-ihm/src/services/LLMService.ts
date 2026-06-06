import { GoogleGenAI } from "@google/genai";

export function isGeminiConfigured(): boolean {
  return Boolean(import.meta.env.VITE_GEMINI_API_KEY);
}

export async function askGemini(prompt: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    return "A chave da API Gemini não está configurada neste ambiente.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
      Você é a assistente virtual da NARA, uma cadeira de rodas autônoma.
      Responda sempre em português do Brasil.
      Seja objetiva e responda em no máximo 4 frases.
      Não gere textos longos, listas extensas ou formatação em Markdown.

      Pergunta do usuário: ${prompt}
      `,
    });

    return response.text ?? "Não consegui gerar uma resposta.";
  } catch (error) {
    console.error("Erro Gemini:", error);
    return "Ocorreu um erro ao consultar o Gemini.";
  }
}