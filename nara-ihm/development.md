# IHM Server Development

## Development Notes

Modificado background do Dashboard

## Planos Atuais

- Aprimorar o App.tsx
    Aprimorar o frontend do rosapi; Possivelmente colocar no dashboard
    Aprimorar o menu de configurações no Configuration.tsx (Component)
    Adicionar visualização do mapa slam
    Adicionar opção de visualizar localização
    Possivelmente adicionar efeitos sonoros

Possivelmente adicionar o manual e o automático do Teleop

Criar um usuário sem privilégios de administrador, enquanto o backend não é criado

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
