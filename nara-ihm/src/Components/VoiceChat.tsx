import { useEffect, useState } from "react";
import { speechService } from "../services/SpeechService";
import { ROStore, GlobalStore } from "../contexts/Store";
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

  function getEnvironmentName() {
  const environment = userConfig.Environment;

  switch (environment) {
    case 1:
      return "cadeira real";

    case 2:
      return "cadeira virtual";

    default:
      return "ambiente ainda não selecionado";
  }
  }

  function getAvailableCommands() {
  return [
    "frente",
    "direita",
    "esquerda",
    "parar",
    "para trás",
    "voltar",
    "status da bateria",
    "status da conexão",
    "último comando",
    "ambiente atual",
    "comandos disponíveis",
  ].join(", ");
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

  if (
    command.includes("bateria") ||
    command.includes("status da bateria") ||
    command.includes("nivel da bateria")
  ) {
    if (batteryVoltage === null) {
      return "Ainda não recebi informações da bateria.";
    }

    return `A tensão atual da bateria é de ${batteryVoltage.toFixed(1)} volts.`;
  }

  if (
    command.includes("ultimo comando") ||
    command.includes("ultimo comando executado")
  ) {
    return `O último comando foi ${lastCommand}`;
  }

  if (
    command.includes("status da conexao") ||
    command.includes("conexao") ||
    command.includes("bridge") ||
    command.includes("ros")
  ) {
    return isConnected
      ? "A conexão com o ROS está ativa."
      : "A conexão com o ROS está offline.";
  }

  if (
    command.includes("ambiente") ||
    command.includes("cadeira real") ||
    command.includes("cadeira virtual")
  ) {
    return `Você está utilizando a ${getEnvironmentName()}.`;
  }

  if (
    command.includes("comandos disponiveis") ||
    command.includes("listar comandos") ||
    command.includes("o que voce faz") ||
    command.includes("ajuda")
  ) {
    return `Os comandos disponíveis são: ${getAvailableCommands()}.`;
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