# IHM Server Development

## Development Notes

1. Desenvolvimento da localização: adição de rotação e publicação
Changes: Map.tsx, Store.ts, Configuration.tsx, Map.css

2. Atualização do Tutorial
Changes: Tutorial.md

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
