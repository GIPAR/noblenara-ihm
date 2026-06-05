# IHM Server Development

## Development Notes

1. Modificado menu de configurações
Changes: Configuration.tsx e Configuration.css

## Planos Atuais

- Adição de FUncionalidades:
    Adicionar localização do slam;
    Adicionar forma de mudar manualmente os tópicos

- Mudanças Gerais:
    Adicionar mudanças do mehrere (múltiplos robôs)
    Adicionar forma de advertise e unadvertise, que permite trocar as políticas de durabilidade e reabilidade de publicações (não precisa ter callback no unadvertise)

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
