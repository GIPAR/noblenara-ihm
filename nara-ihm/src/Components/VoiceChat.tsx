import { useState } from "react";
import { speechService } from "../services/SpeechService";
import { ROStore } from "../contexts/Store";
import "./VoiceChat.css";

function normalizeText(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function createTwist(linearX: number, angularZ: number) {
  return {
    linear: { x: linearX, y: 0.0, z: 0.0 },
    angular: { x: 0.0, y: 0.0, z: angularZ },
  };
}

export default function VoiceChat() {
  const ros = ROStore((state) => state.ros);

  const [listening, setListening] = useState(false);
  const [lastCommand, setLastCommand] = useState("");
  const [response, setResponse] = useState("");

  function publishCmdVel(linearX: number, angularZ: number) {
    ros.publish(
      "/noblenara/cmd_vel",
      "geometry_msgs/msg/Twist",
      createTwist(linearX, angularZ)
    );
  }

function executeVoiceCommand(command: string): string {
  if (command.includes("parar") || command.includes("pare")) {
    publishCmdVel(0.0, 0.0);
    return "Comando recebido. Parando a cadeira.";
  }

  if (command.includes("direita")) {
    publishCmdVel(0.0, -0.8);
    return "Comando recebido. Girando para a direita.";
  }

  if (command.includes("esquerda")) {
    publishCmdVel(0.0, 0.8);
    return "Comando recebido. Girando para a esquerda.";
  }

  if (command.includes("frente") || command.includes("andar")) {
    publishCmdVel(0.5, 0.0);
    return "Comando recebido. Movendo para frente.";
  }

  if (
    command.includes("para tras") ||
    command.includes("voltar") ||
    command === "re"
  ) {
    publishCmdVel(-0.3, 0.0);
    return "Comando recebido. Movendo para trás.";
  }

  return "Comando não reconhecido.";
}

function interpretCommand(text: string): string {
  const command = normalizeText(text);

  setLastCommand(text);

  return executeVoiceCommand(command);
}

  function handleListen() {
    if (!speechService.supported()) {
      setResponse("Reconhecimento de voz não suportado neste navegador.");
      return;
    }

    setListening(true);

    speechService.startListening(
      (text) => {
        setListening(false);
        const answer = interpretCommand(text);
        setResponse(answer);
        speechService.speak(answer);
      },
      () => {
        setListening(false);
        setResponse("Erro ao reconhecer a fala.");
      }
    );
  }

  return (
  <div className="voice-chat-panel">
    <h3 className="voice-chat-title">Controle por Voz</h3>

    <button className="voice-chat-button" onClick={handleListen}>
      {listening ? "Ouvindo..." : "🎤 Falar comando"}
    </button>

    <div className="voice-chat-info">
      <p>
        <strong>Último comando:</strong>{" "}
        <span className="voice-chat-status">{lastCommand || "Nenhum"}</span>
      </p>

      <p>
        <strong>Resposta:</strong>{" "}
        <span className="voice-chat-status">{response || "Aguardando comando"}</span>
      </p>
    </div>
  </div>
  );
}