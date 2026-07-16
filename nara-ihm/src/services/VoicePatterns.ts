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

export const HELP_PATTERNS = [
  "comandos disponiveis",
  "listar comandos",
  "o que voce faz",
  "o que voce pode fazer",
  "ajuda",
];

export const NARA_IDENTITY_PATTERNS = [
  "quem e voce",
  "quem voce e",
  "se apresente",
  "o que e a nara",
  "quem criou voce",
  "qual e seu objetivo",
];

export const AUTONOMOUS_NAVIGATION_PATTERNS = [
  "iniciar navegacao",
  "parar navegacao",
  "cancelar destino",
  "cancelar navegacao",
  "modo autonomo",
  "ativar modo autonomo",
];