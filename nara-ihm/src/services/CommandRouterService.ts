function normalizeText(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const robotCommandKeywords = [
  // movimento para frente
  "frente",
  "andar",
  "avancar",
  "avance",
  "seguir em frente",
  "ir para frente",
  "mover para frente",
  "mova para frente",
  "pode avancar",
  "pode andar",
  "siga em frente",

  // ré
  "para tras",
  "voltar",
  "re",
  "mover para tras",
  "mova para tras",
  "andar para tras",
  "dar re",
  "retornar",

  // direita
  "direita",
  "virar para direita",
  "vire para direita",
  "girar para direita",
  "gire para direita",
  "dobrar para direita",

  // esquerda
  "esquerda",
  "virar para esquerda",
  "vire para esquerda",
  "girar para esquerda",
  "gire para esquerda",
  "dobrar para esquerda",

  // parar
  "parar",
  "pare",
  "parar agora",
  "pare agora",
  "interromper",
  "interrompa",
  "cancelar movimento",
  "parar movimento",
  "ficar parado",

  // consultas
  "status da bateria",
  "bateria",
  "nivel da bateria",
  "carga da bateria",
  "status da conexao",
  "conexao",
  "ambiente atual",
  "ambiente",
  "ultimo comando",
  "comandos disponiveis",
  "ajuda",

  // navegação futura
  "ir para",
  "va para",
  "me leve para",
  "navegar para",
  "modo autonomo",
  "cancelar navegacao",
];

export function isRobotCommand(text: string): boolean {
  const command = normalizeText(text);

  return robotCommandKeywords.some((keyword) =>
    command.includes(normalizeText(keyword))
  );
}