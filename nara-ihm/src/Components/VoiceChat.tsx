import { useEffect, useState } from "react";
import { speechService } from "../services/SpeechService";
import { ROStore, GlobalStore } from "../contexts/Store";
import { executeVoiceCommand } from "../services/VoiceCommandService";
import "./VoiceChat.css";

function createTwist(linearX: number, angularZ: number) {
  return {
    linear: { x: linearX, y: 0.0, z: 0.0 },
    angular: { x: 0.0, y: 0.0, z: angularZ },
  };
}

export default function VoiceChat() {
  const ros = ROStore((state) => state.ros);
  const isConnected = ROStore((state) => state.isConnected);
  const userConfig = GlobalStore((state) => state.userConfig);

  const [listening, setListening] = useState(false);
  const [lastCommand, setLastCommand] = useState("");
  const [response, setResponse] = useState("");
  const [batteryVoltage, setBatteryVoltage] = useState<number | null>(null);

useEffect(() => {
  const subscription = ros.subscribe(
    "/noblenara/battery_status",
    "sensor_msgs/msg/BatteryState",
    (message: unknown) => {
      const battery = message as { voltage?: number };
      if (typeof battery.voltage === "number") {
        setBatteryVoltage(battery.voltage);
      }
    }
  );

  return () => {
    subscription.unsubscribe();
  };
}, [ros]);

  function publishCmdVel(linearX: number, angularZ: number) {
    ros.publish(
      "/noblenara/cmd_vel",
      "geometry_msgs/msg/Twist",
      createTwist(linearX, angularZ)
    );
  }

function interpretCommand(text: string): string {
  const answer = executeVoiceCommand(text, {
    batteryVoltage,
    isConnected,
    environment: userConfig.Environment,
    lastCommand,
    publishCmdVel,
  });

  setLastCommand(text);

  return answer;
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