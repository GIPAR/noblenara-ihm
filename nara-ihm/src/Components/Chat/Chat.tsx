import { useState, useRef, useEffect } from "react";
import { useChatStore } from "../../contexts/chatStore";

export function Chat() {
  const { historico, carregando, enviarMensagem } = useChatStore();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scrolla para o final automaticamente
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [historico]);

  const handleEnviar = async () => {
    if (!input.trim() || carregando) return;
    const texto = input;
    setInput("");
    await enviarMensagem(texto);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>   GIPbot</div>

      <div style={styles.messages}>
        {historico.length === 0 && (
          <div style={styles.empty}>Olá, sou a sua assistente virtual! Como posso te ajudar? </div>
        )}
        {historico.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              background: msg.role === "user" ? "#0f3460" : "#533483",
            }}
          >
            {msg.text || "..."}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div style={styles.inputArea}>
        <input
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleEnviar()}
          placeholder="Digite sua mensagem..."
          disabled={carregando}
        />
        <button
          style={styles.button}
          onClick={handleEnviar}
          disabled={carregando}
        >
          {carregando ? "..." : "Enviar"}
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: "500px",
    height: "600px",
    display: "flex",
    flexDirection: "column",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 0 30px rgba(0,0,0,0.5)",
    background: "#16213e",
  },
  header: {
    background: "#0f3460",
    padding: "16px",
    textAlign: "center",
    color: "white",
    fontSize: "18px",
    fontWeight: "bold",
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  empty: {
    color: "#aaa",
    textAlign: "center",
    marginTop: "20px",
  },
  message: {
    maxWidth: "80%",
    padding: "10px 14px",
    borderRadius: "12px",
    color: "white",
    fontSize: "14px",
    lineHeight: "1.5",
  },
  inputArea: {
    display: "flex",
    padding: "12px",
    gap: "8px",
    background: "#0f3460",
  },
  input: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: "8px",
    border: "none",
    background: "#1a1a2e",
    color: "white",
    fontSize: "14px",
    outline: "none",
  },
  button: {
    padding: "10px 18px",
    background: "#e94560",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  },
};