import { useEffect, useState } from "react";
import { askGemini } from "../services/LLMService";
import { executeVoiceCommand } from "../services/VoiceCommandService";
import { isRobotCommand } from "../services/CommandRouterService";
import { speechService } from "../services/SpeechService";
import "./LLMAssistant.css";
import { useStore } from "zustand";
import { ChatStore, GlobalStore, ROStore } from "../contexts/Store";

function createTwist(linearX: number, angularZ: number) {
  return {
    linear: { x: linearX, y: 0.0, z: 0.0 },
    angular: { x: 0.0, y: 0.0, z: angularZ },
  };
}

export default function LLMAssistant() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("Faça uma pergunta para a assistente.");
  const [loading, setLoading] = useState(false);

  const setHistory = useStore(ChatStore, (s) => s.setHistory);

  const ros = useStore(ROStore, (s) => s.ros);
  const isConnected = useStore(ROStore, (s) => s.isConnected);
  const robotData = useStore(ROStore, (s) => s.robotData);
  const batteryData = useStore(ROStore, (s) => s.batteryData);
  const setBatteryData = useStore(ROStore, (s) => s.setbatteryData);
  const userConfig = useStore(GlobalStore, (s) => s.userConfig);

  useEffect(() => {
    if (!isConnected) return;

    const subscription = ros.subscribe(
      robotData.topic_battery,
      "sensor_msgs/msg/BatteryState",
      (message: unknown) => {
        const battery = message as {
          voltage?: number;
          percentage?: number;
        };

        if (typeof battery.voltage === "number") {
          const status =
            battery.voltage >= 25
              ? "Carregada"
              : battery.voltage >= 24.15
              ? "Boa"
              : battery.voltage >= 23.6
              ? "Fraca"
              : battery.voltage > 1
              ? "Depletada"
              : "Desconhecida";

          setBatteryData({
            voltage: battery.voltage,
            percentage: battery.percentage ?? 0,
            status,
          });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [isConnected, ros, robotData.topic_battery, setBatteryData]);

  function publishCmdVel(linearX: number, angularZ: number) {
    ros.publish(
      robotData.topic_cmd_vel,
      "geometry_msgs/msg/Twist",
      createTwist(linearX, angularZ)
    );
  }

  async function askAssistant(userQuestion: string) {
    if (!userQuestion.trim() || loading) return;

    setLoading(true);

    let response: string;

    if (isRobotCommand(userQuestion)) {
      response = executeVoiceCommand(userQuestion, {
        batteryVoltage: batteryData.voltage > 0 ? batteryData.voltage : null,
        isConnected,
        environment: userConfig.Environment,
        lastCommand: question,
        publishCmdVel,
      });
    } else {
      response = await askGemini(userQuestion);
    }

    setHistory("user", userQuestion);
    setHistory("assistant", response);

    setQuestion(userQuestion);
    setAnswer(response);
    setLoading(false);

    speechService.speak(response);
  }

  async function handleAsk() {
    await askAssistant(question);
  }

  function handleVoiceAsk() {
    if (!speechService.supported()) {
      const unsupportedMessage =
        "Reconhecimento de voz não suportado neste navegador.";

      setAnswer(unsupportedMessage);
      speechService.speak(unsupportedMessage);
      return;
    }

    setLoading(true);
    setAnswer("Ouvindo pergunta...");

    speechService.startListening(
      async (text) => {
        setLoading(false);
        await askAssistant(text);
      },
      () => {
        const errorMessage = "Erro ao reconhecer a fala.";

        setLoading(false);
        setAnswer(errorMessage);
        speechService.speak(errorMessage);
      }
    );
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
        placeholder="Digite uma pergunta ou comando"
      />

      <button className="llm-assistant-button" onClick={handleAsk}>
        {loading ? "Processando..." : "Enviar"}
      </button>

      <button
        className="llm-assistant-button"
        onClick={handleVoiceAsk}
        disabled={loading}
      >
        🎤 Falar com a NARA
      </button>

      <div className="llm-assistant-answer">
        {loading ? (
          <p className="llm-assistant-loading">Processando...</p>
        ) : (
          <p>{answer}</p>
        )}
      </div>
    </div>
  );
}