import { useRef, useState } from "react";
import { speechService } from "../services/SpeechService";
import { executeVoiceCommand } from "../services/VoiceCommandService";
import { ROStore } from "../contexts/Store";
import "./VoiceChat.css";

type HistoryItem = {
  user: string;
  assistant: string;
};

function createTwist(linearX: number, angularZ: number) {
  return {
    linear: { x: linearX, y: 0.0, z: 0.0 },
    angular: { x: 0.0, y: 0.0, z: angularZ },
  };
}

export default function VoiceChat() {
  const ros = ROStore((state) => state.ros);
  const isConnected = ROStore((state) => state.isConnected);
  const robotData = ROStore((state) => state.robotData);
  const batteryData = ROStore((state) => state.batteryData);

  const [listening, setListening] = useState(false);
  const [lastCommand, setLastCommand] = useState("");
  const [response, setResponse] = useState("");
  const historyRef = useRef<HistoryItem[]>([]);

  function publishCmdVel(linearX: number, angularZ: number) {
    ros.publish(
      robotData.topic_cmd_vel,
      "geometry_msgs/msg/Twist",
      createTwist(linearX, angularZ)
    );
  }

  function interpretCommand(text: string): string {
    const answer = executeVoiceCommand(text, {
      batteryVoltage: batteryData.voltage > 0 ? batteryData.voltage : null,
      isConnected,
      lastCommand,
      publishCmdVel,
    });

    setLastCommand(text);

    return answer;
  }

  function registerInteraction(user: string, assistant: string) {
  historyRef.current = [
    ...historyRef.current,
    {
      user,
      assistant,
    },
  ];
}

  function handleListen() {
    if (!speechService.supported()) {
      const unsupportedMessage =
        "Reconhecimento de voz não suportado neste navegador.";

      setResponse(unsupportedMessage);
      registerInteraction("Sistema", unsupportedMessage);
      return;
    }

    setListening(true);

    speechService.startListening(
      (text) => {
        setListening(false);

        const answer = interpretCommand(text);

        setResponse(answer);
        registerInteraction(text, answer);

        speechService.speak(answer);
      },
      () => {
        const errorMessage = "Erro ao reconhecer a fala.";

        setListening(false);
        setResponse(errorMessage);
        registerInteraction("Sistema", errorMessage);
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
          <span className="voice-chat-status">
            {response || "Aguardando comando"}
          </span>
        </p>
      </div>
    </div>
  );
}