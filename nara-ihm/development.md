# IHM Server Development

## Development Notes

1. Organização e modificado o Código da Introdução e removido Environment Select, posto a sub-variável "Intro"
Changes: Store.ts, App.tsx, Intro.tsx, Intro.css, Configuration.tsx

2. Adicionado átomo de ativação de Bateria ||| Falta Adicionar no Menu de Configurações
Changes: Molecule.tsx, Dashboard.tsx

LLMAssitant.tsx, AssistantContextService.ts, VoiceCommandService.ts, VoicePattern.ts, VoiceChat.tsx, AssistantContext; removido environment

## Planos Atuais

- Adição de Funcionalidades:
    Adicionar setting de MaxSpeed no Configuration.tsx

- Mudanças Gerais:
    Desenvolver Posteriormente o tutorial em uma versão mais atualizada da IHM

Verificar a normalização de todos os Poses posiveis no Map.tsx

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
