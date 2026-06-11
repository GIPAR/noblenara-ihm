# IHM Server Development

## Development Notes

1. Desenvolvimento do Menu de Configurações com Customização do Projeto e Prefixos de Tópicos

0 - Desenvolvimento da localização (Não terminado)
Changes: Map.tsx

0 - Desenvolvimento de método de advertise e unadvertise no cmd_vel
Changes: ROS2Service.ts, TeleopService.tsx

Lembrar de modificar o VoiceChat para integrar com a IHM na parte da Bateria

## Planos Atuais

- Adição de Funcionalidades:
    Adicionar localização do slam;

- Mudanças Gerais:
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
