export type VoiceCommandContext = {
  batteryVoltage: number | null;
  isConnected: boolean;
  environment: number;
  lastCommand: string;
  publishCmdVel: (linearX: number, angularZ: number) => void;
};

import {
  BATTERY_PATTERNS,
  CONNECTION_PATTERNS,
  ENVIRONMENT_PATTERNS,
  HELP_PATTERNS,
  matchesAny,
} from "./VoicePatterns";

function normalizeText(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getEnvironmentName(environment: number) {
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
    "ajuda",
    "ir para recepção",
    "ir para laboratório",
    "quem é você",
    "o que você pode fazer",
    "que horas são",
    "qual a data de hoje",
  ].join(", ");
}

function getNavigationDestination(command: string): string | null {
  const destinations = [
    "recepcao",
    "laboratorio",
    "sala",
    "entrada",
    "museu",
  ];

  for (const destination of destinations) {
    if (
      command.includes(`ir para ${destination}`) ||
      command.includes(`va para ${destination}`) ||
      command.includes(`me leve para ${destination}`) ||
      command.includes(`navegar para ${destination}`)
    ) {
      return destination;
    }
  }

  return null;
}

export function executeVoiceCommand(
  text: string,
  context: VoiceCommandContext
): string {
  const command = normalizeText(text);

  if (command.includes("parar") || command.includes("pare")) {
    context.publishCmdVel(0.0, 0.0);
    return "Comando recebido. Parando a cadeira.";
  }

  if (command.includes("direita")) {
    context.publishCmdVel(0.0, -0.8);
    return "Comando recebido. Girando para a direita.";
  }

  if (command.includes("esquerda")) {
    context.publishCmdVel(0.0, 0.8);
    return "Comando recebido. Girando para a esquerda.";
  }

  if (command.includes("frente") || command.includes("andar")) {
    context.publishCmdVel(0.5, 0.0);
    return "Comando recebido. Movendo para frente.";
  }

  if (
    command.includes("para tras") ||
    command.includes("voltar") ||
    command === "re"
  ) {
    context.publishCmdVel(-0.3, 0.0);
    return "Comando recebido. Movendo para trás.";
  }

  if (matchesAny(command, BATTERY_PATTERNS)) {
    if (context.batteryVoltage === null) {
      return "Ainda não recebi informações da bateria.";
    }

    return `A tensão atual da bateria é de ${context.batteryVoltage.toFixed(
      1
    )} volts.`;
  }

  if (matchesAny(command, CONNECTION_PATTERNS)) {
    return context.isConnected
      ? "A conexão com o ROS está ativa."
      : "A conexão com o ROS está offline.";
  }

  if (
    command.includes("ultimo comando") ||
    command.includes("ultimo comando executado")
  ) {
    return context.lastCommand
      ? `O último comando foi ${context.lastCommand}.`
      : "Nenhum comando foi executado ainda.";
  }

  if (matchesAny(command, ENVIRONMENT_PATTERNS)) {
    return `Você está utilizando a ${getEnvironmentName(context.environment)}.`;
  }

  if (matchesAny(command, HELP_PATTERNS)) {
    return `Os comandos disponíveis são: ${getAvailableCommands()}.`;
  }

  const destination = getNavigationDestination(command);

  if (destination) {
    return `Destino ${destination} solicitado. A navegação autônoma ainda será integrada.`;
  }

  if (
  command.includes("quem e voce") ||
  command.includes("quem voce e") ||
  command.includes("se apresente")
  ) {
    return "Eu sou a assistente virtual da NARA.";
  }

  if (
    command.includes("o que voce pode fazer") ||
    command.includes("o que voce faz") ||
    command.includes("suas funcoes")
  ) {
    return "Posso controlar a cadeira, informar o status do sistema e auxiliar na navegação.";
  }

  if (
  command.includes("que horas sao") ||
  command.includes("qual a hora") ||
  command.includes("horario")
  ) {
    const now = new Date();

    return `Agora são ${now.getHours()} horas e ${now.getMinutes()} minutos.`;
  }

  if (
    command.includes("data de hoje") ||
    command.includes("que dia e hoje") ||
    command.includes("dia de hoje")
  ) {
    const today = new Date();

    return `Hoje é ${today.toLocaleDateString("pt-BR")}.`;
  }

  return "Comando não reconhecido. Tente dizer ajuda para ouvir os comandos disponíveis.";
}