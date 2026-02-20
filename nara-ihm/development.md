# IHM Server Development

## Development Notes

Adicionado launch file para: rosbridge, rosapi e web_video_server no nara-sim
Precisa ser rodado no server-side, since o cliente não necessariamente terá o ROS2 instalado;
    Rodar no robô: Opção boa, diminui o total de conexões necessárias
    Cons: web video server pode ser pesado

Criado uma maneira de comunicação com rosapi para vizualisar topicos serviços e nós, sendo esta visualização feita no componente "Rosapi.tsx" que é chamado no "App.tsx"; Um Átomo define se esta janela será ativada ou não, ao qual o usuário pode acionar no Configuration.tsx. Os dados da resposta são salvos em uma variável do ROStore (Zustand) e chamado no componente do api

Adições e Mudanças Gerais para rosapi:
    Adicionados novos States nos dois contextos
    Modificado ROS2Service
    MOdificado Configuration.tsx
    Adicionado useEffect no Configuration.tsx

## Planos Atuais

- Verificar a simplificação e reutilização da variável userConfig.Type para o isAdmin boolean

- Aprimorar o App.tsx
    Aprimorar opção de visualizar os tópicos do ROS
    Adicionar opção de visualizar o estado da bateria
    Adicionar opção de criar uma nova guia com a câmera, em vez de ser usada na tela principal
    Aprimorar o menu de configurações no Configuration.tsx (Component)
    Adicionar opção de visualizar localização

- Possivelmente adicionar efeitos sonoros

- Backend

## Notas

- Futuramente verificar trocar webvideoserver por:
H.264/H.265 via FFMPEG (ffmpeg_image_transport)
    What it is: Video compression using keyframes with predictive frames encoding only differences between frames; Bandwidth: ~1-5 Mbps typical (configurable via bitrate)
    Use case: Best for teleoperation - high frame rate video over WiFi
        'You need the <video tag: It activates the browser's built-in video player engine (hardware acceleration).'

## Details (ignore)

node --version 24.11.1
nvm --version 0.39.2
npm --version 11.6.2
