function normalizeText(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const robotCommandKeywords = [
  "frente",
  "andar",
  "avancar",
  "avançar",
  "direita",
  "esquerda",
  "parar",
  "pare",
  "para tras",
  "para trás",
  "voltar",
  "re",
  "ré",
  "status da bateria",
  "bateria",
  "status da conexao",
  "status da conexão",
  "conexao",
  "conexão",
  "ambiente atual",
  "ambiente",
  "ultimo comando",
  "último comando",
  "comandos disponiveis",
  "comandos disponíveis",
  "ajuda",
  "ir para",
  "va para",
  "vá para",
  "me leve para",
  "navegar para",
  "modo autonomo",
  "modo autônomo",
  "cancelar navegacao",
  "cancelar navegação",
];

export function isRobotCommand(text: string): boolean {
  const command = normalizeText(text);

  return robotCommandKeywords.some((keyword) =>
    command.includes(normalizeText(keyword))
  );
}