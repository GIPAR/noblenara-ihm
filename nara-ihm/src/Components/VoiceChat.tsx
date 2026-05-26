import { useState } from "react";
import { speechService } from "../services/SpeechService";
import { ROStore } from "../contexts/Store";

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

  function interpretCommand(text: string) {
    const command = text.toLowerCase();
    setLastCommand(text);

    if (command.includes("frente") || command.includes("andar")) {
      publishCmdVel(0.5, 0.0);
      return "Movendo para frente.";
    }

    if (command.includes("trás") || command.includes("ré")) {
      publishCmdVel(-0.3, 0.0);
      return "Movendo para trás.";
    }

    if (command.includes("esquerda")) {
      publishCmdVel(0.0, 0.8);
      return "Girando para a esquerda.";
    }

    if (command.includes("direita")) {
      publishCmdVel(0.0, -0.8);
      return "Girando para a direita.";
    }

    if (command.includes("parar") || command.includes("pare")) {
      publishCmdVel(0.0, 0.0);
      return "Parando a cadeira.";
    }

    return "Comando não reconhecido.";
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
    <div
  style={{
    position: "absolute",
    top: "10px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 9999,
    background: "white",
    padding: "12px",
    border: "1px solid #444",
    borderRadius: "8px",
    pointerEvents: "auto",
  }}
>
      <h3>Controle por Voz</h3>

      <button onClick={handleListen}>
        {listening ? "Ouvindo..." : "Falar comando"}
      </button>

      <p><strong>Último comando:</strong> {lastCommand || "Nenhum"}</p>
      <p><strong>Resposta:</strong> {response || "Aguardando comando"}</p>
    </div>
  );
}