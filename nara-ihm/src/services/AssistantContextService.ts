import { ChatStore, GlobalStore, ROStore } from "../contexts/Store";

function getEnvironmentName(environment: number) {
  if (environment === 1) return "ambiente real";
  if (environment === 2) return "ambiente virtual";
  return "ambiente não identificado";
}

export function getNARAContext() {
  const rosState = ROStore.getState();
  const globalState = GlobalStore.getState();

  return {
    rosConnected: rosState.isConnected,
    robotProject: rosState.robotData.project,
    robotPrefix: rosState.robotData.prefix || "sem namespace",
    cmdVelTopic: rosState.robotData.topic_cmd_vel,
    batteryTopic: rosState.robotData.topic_battery,
    batteryVoltage: rosState.batteryData.voltage,
    batteryPercentage: rosState.batteryData.percentage,
    batteryStatus: rosState.batteryData.status,
    environment: getEnvironmentName(globalState.userConfig.Environment),
  };
}

function getConversationHistory() {
  const history = ChatStore.getState().History;

  return history
    .slice(-6)
    .map((message) => {
      const role =
        message.role === "user" ? "Usuário" : "Assistente";

      return `${role}: ${message.content}`;
    })
    .join("\n");
}

export function buildNARAContextPrompt(question: string) {
  const context = getNARAContext();
  const conversationHistory = getConversationHistory();

  return `
Você é a assistente virtual da NARA, uma cadeira de rodas autônoma.

Use o contexto atual da IHM e do ROS2 para responder quando a pergunta estiver relacionada ao estado da cadeira.

Contexto atual:
- Conexão com ROS2: ${context.rosConnected ? "conectada" : "desconectada"}
- Robô selecionado: ${context.robotProject}
- Namespace/prefixo do robô: ${context.robotPrefix}
- Ambiente atual: ${context.environment}
- Tópico de velocidade: ${context.cmdVelTopic}
- Tópico de bateria: ${context.batteryTopic}
- Tensão da bateria: ${context.batteryVoltage > 0 ? `${context.batteryVoltage} V` : "sem informação"}
- Percentual da bateria: ${context.batteryPercentage > 0 ? `${context.batteryPercentage}%` : "sem informação"}
- Estado da bateria: ${context.batteryStatus}

Regras:
- Responda sempre em português do Brasil.
- Seja objetiva.
- Responda em no máximo 4 frases.
- Não use Markdown.
- Se a pergunta for sobre bateria, conexão, ambiente, robô selecionado ou tópicos, use o contexto acima.
- Se a informação não estiver disponível, diga isso com clareza.

Histórico recente da conversa:
${conversationHistory || "Sem histórico anterior."}

Pergunta do usuário:
${question}
`;
}