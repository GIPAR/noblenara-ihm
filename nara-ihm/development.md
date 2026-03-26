# IHM Server Development

## Development Notes

Modificado visualização do App, com a adição de um Dashboard;
    Duas câmeras simultâneas ao qual é possível modificar qual será a principal

Modificado o visual do Teleop Keyboard

Adicionado Visualização da Bateria quando está no ambiente Físico, ao qual lê o tópico BatteryState mandado pela ESP32
    A parte física ainda precisa ser modificada

## Planos Atuais

Adicionar visualização do mapa slam

- Aprimorar o App.tsx
    Aprimorar o frontend do rosapi; Possivelmente colocar no dashboard
    Aprimorar o menu de configurações no Configuration.tsx (Component)
    Adicionar opção de visualizar localização
    Possivelmente adicionar efeitos sonoros

Possivelmente adicionar o manual e o automático do Teleop

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
