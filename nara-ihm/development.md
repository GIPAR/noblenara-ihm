# IHM Server Development

## Development Notes

Trocado forma de conexão com ws para permitir que tablets e celulares sem ROS se conectem
Changes: ROS2Service

## Planos Atuais

- Aprimorar o App.tsx
    Adicionar localização do slam; espera-se adicioná-lo após a navegação autônoma estiver em funcionamento

- Personalização:
    Possivelmente colocar seleção de color theme na introdução, não somente no menu de configurações, contudo, preferencialmente ser salvo a opção via Backend

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
