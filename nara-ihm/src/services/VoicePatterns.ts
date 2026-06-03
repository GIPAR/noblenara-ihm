export function matchesAny(command: string, patterns: string[]) {
  return patterns.some((pattern) => command.includes(pattern));
}

export const BATTERY_PATTERNS = [
  "status da bateria",
  "como esta a bateria",
  "nivel da bateria",
  "bateria",
];

export const CONNECTION_PATTERNS = [
  "status da conexao",
  "como esta a conexao",
  "a cadeira esta conectada",
  "estamos conectados",
  "conexao",
  "bridge",
  "ros",
];

export const ENVIRONMENT_PATTERNS = [
  "ambiente atual",
  "qual ambiente",
  "onde estou",
  "cadeira real",
  "cadeira virtual",
  "simulacao",
  "virtual",
  "real",
];

export const HELP_PATTERNS = [
  "comandos disponiveis",
  "listar comandos",
  "o que voce faz",
  "o que voce pode fazer",
  "ajuda",
];