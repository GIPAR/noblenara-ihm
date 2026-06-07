import { create } from "zustand";

interface Mensagem {
  role: "user" | "assistant";
  content: string;
  text: string;
}

interface ChatStore {
  historico: Mensagem[];
  carregando: boolean;
  enviarMensagem: (mensagem: string) => Promise<void>;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  historico: [],
  carregando: false,

  enviarMensagem: async (mensagem: string) => {
    const historico = get().historico;

    set({
      historico: [...historico, { role: "user", content: mensagem, text: mensagem }],
      carregando: true,
    });

    set((state) => ({
      historico: [...state.historico, { role: "assistant", content: "", text: "" }],
    }));

    const response = await fetch("http://localhost:3001/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mensagem,
        historico: historico.map((h) => ({
          role: h.role,
          content: h.content,
        })),
      }),
    });

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const linhas = chunk.split("\n\n").filter(Boolean);

      for (const linha of linhas) {
        try {
          const dados = JSON.parse(linha.replace("data: ", ""));
          if (dados.fim) {
            set({ carregando: false });
          }
          if (dados.texto) {
            set((state) => {
              const hist = [...state.historico];
              const ultima = { ...hist[hist.length - 1] };
              ultima.text += dados.texto;
              ultima.content += dados.texto;
              hist[hist.length - 1] = ultima;
              return { historico: hist };
            });
          }
        } catch {
          // ignora
        }
      }
    }
  },
}));