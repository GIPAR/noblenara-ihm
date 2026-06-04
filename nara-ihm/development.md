# IHM Server Development

## Development Notes

Modificado background do Dashboard

1. Merge e pequenas modificações da branch de Luiz
2. Trocado forma de conexão com ws para permitir que tablets e celulares utilizem o ROS2 por meio de um host e pequenas mudanças de lógica

### Arquivos Principais Modificados - Controle de Voz

```text
src/Components/VoiceChat.tsx
src/Components/VoiceChat.css
src/services/SpeechService.ts
src/services/VoiceCommandService.ts
src/services/VoicePatterns.ts
src/contexts/Molecule.ts
src/App.tsx
src/Components/Configuration.tsx
```

## Planos Atuais

- Aprimorar o App.tsx
    Aprimorar o frontend do rosapi; Possivelmente colocar no dashboard
    Aprimorar o menu de configurações no Configuration.tsx (Component)
    Adicionar visualização do mapa slam
    Adicionar opção de visualizar localização
    Possivelmente adicionar efeitos sonoros

Possivelmente adicionar o manual e o automático do Teleop

Criar um usuário sem privilégios de administrador, enquanto o backend não é criado

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
