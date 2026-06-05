import { useState } from "react";
import { askGemini } from "../services/LLMService";
import "./LLMAssistant.css";

export default function LLMAssistant() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("Faça uma pergunta para a assistente.");
  const [loading, setLoading] = useState(false);

  async function handleAsk() {
    if (!question.trim() || loading) return;

    setLoading(true);

    const response = await askGemini(question);

    setAnswer(response);
    setLoading(false);
  }

  return (
    <div className="llm-assistant-panel">
      <h3 className="llm-assistant-title">Assistente IA</h3>

      <input
        className="llm-assistant-input"
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleAsk();
          }
        }}
        placeholder="Digite uma pergunta"
      />

      <button className="llm-assistant-button" onClick={handleAsk}>
        {loading ? "Consultando..." : "Perguntar"}
      </button>

      <div className="llm-assistant-answer">
        {loading ? (
          <p className="llm-assistant-loading">Consultando Gemini...</p>
        ) : (
          <p>{answer}</p>
        )}
      </div>
    </div>
  );
}