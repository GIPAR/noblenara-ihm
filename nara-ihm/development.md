# IHM Server Development

## Development Notes

1. Modificação do Chat.tsx, organização do código e modificação da estrutura;
Changes: Chat.tsx

2. Removido arquivos para utilização apenas da IA para envio e recebimento de comandos
Changes: App.tsx, Configuration.tsx, Molecule.ts
Deleted: CommandRouterService.ts, VoiceCommandService.ts, VoicePattern.ts; VoiceChat.tsx, VoiceChat.css

3. Modificação da frase de contexto
Chabges: AssistantContextService.tsx

Obs: Espera-se que no futuro o assistente de IA possa fazer as funcionalidades removidas e ir além

## Planos Atuais

- Adição de Funcionalidades:
    Adicionar setting de MaxSpeed no Configuration.tsx

- Mudanças Gerais:
    Talvez fazer o mapa SLAM ficar no meio da tela
    Adicionar forma de colocar câmeras ou mapas adicionais na tela

- Adições Gerais:
    Desenvolver Posteriormente o tutorial em uma versão mais atualizada da IHM

## Notas

- Futuramente verificar trocar webvideoserver por:
H.264/H.265 via FFMPEG (ffmpeg_image_transport)
    What it is: Video compression using keyframes with predictive frames encoding only differences between frames; Bandwidth: ~1-5 Mbps typical (configurable via bitrate)
    Use case: Best for teleoperation - high frame rate video over WiFi
        'You need the <video tag: It activates the browser's built-in video player engine (hardware acceleration).'

Correção de Bugs

## Details (ignore)

node --version 24.11.1
nvm --version 0.39.2
npm --version 11.6.2
