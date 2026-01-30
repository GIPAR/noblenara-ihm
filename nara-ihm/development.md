# IHM Server Development

## Development Notes

- Adicionado inicialmente dois contextos com seus hooks: 'ConfigContext', que possui a função de guardar as variáveis desejadas globalmente e 'ROSContext' que é o provedor de certas funções especificas do ROS e das funções encontradas no ROS2Service.ts: *Ver as Notas*

--ReCodado os contextos globais, sendo agora escritos por intermédio do Jotai e do Zustand; Excluiu-se os contextos anteriores juntamente com seus hooks
    Jotai: Átomos que funcionam de forma global mas que possuem framework mais eficiente que o React Padrão
    Zustand: Uma "Loja" que funciona fora do React, que também possúi framework eficientizado ao qual a Loja pode funcionar de forma seletiva pelo 'selector', evitando a renderização desnecessária
        Jotai -> Molecule.ts    Zustand -> Store.ts (Com duas lojas, uma geral e outra do ROS - 24/01/2026)

- Modificado ROS2Service.ts e Recriado o KeyboardService (trocado a lógica para uma mais simples e possivelmente eficiente)

- Modificado o App.tsx
    Pontos Principais: Adicionado Menu de Configurações, Modificado Código de Imagem

- Modificado Organização:
[Contextos -> Molecule.ts & Store.ts]
[Main.tsx -> App.tsx]           Os componentes agora se encontram na pasta "Components"
|___Components
    [Intro, Camera, Config, MessageLog]

- Feito a introdução do IHM, além de ser grandemente aprimorado posteriormente, possuindo este três partes diferentes: Login, Seleção de Modo e Seleção de Ambiente.
    1. Login -> Frontend do Login sem o Backend, é possivel entrar com o username: "gipar" e senha: "usergipar"
    2. Seleção de Modo: Seleciona o tipo de exibição do website, sendo estes a exibição para usuários comuns e a exibição propriamente para desenvolvedores ou técnicos
    3. Seleção de Ambiente: Selecionar se o ambiente utilizado é o físico, com o robô real ou o ambiente simulado no Gazebo Harmonic.

## Planos Atuais
- Aprimorar o App.tsx
    Adicionar opção de vizualisar os tópicos do ROS
    Adicionar opção de criar uma nova guia com a câmera, em vez de ser usada na tela principal
    Aprimorar o menu de configurações no Configuration.tsx (Component)

- Possivelmente adicionar efeitos sonoros

- Adicionar um backend com os usuários do site verificando as melhores formas de implementação e aprimoramento do código atual || Obs: o Código da Introdução Atual atualiza a variável global diretamente (30/01/2026)

## Notas

- Um contexto principal tem o problema de causar uma re renderização em toda a aplicação que usa o contexto diretamente, mesmo que os componentes peguem apenas uma parte do contexto; Por isso, há duas opções principais que foram encontradas de substituição:
    Jotai -> semelhante ao useState, ele possui variáveis *indepedentes* que funcionam facilmente de forma global
    Zustand -> Uma "Loja" semelhante ao contexto que roda fora do React, mas que diferente do Contexto, ela é separada em várias sessões, ao qual não causam a renderização repetida desnecessária; Além de, comparado ao Jotai, possuir uma estrutura firma e menos "espalhada" que o Jotai, necessitando de menos atenção na organização do código

- Futuramente verificar trocar webvideoserver por:
H.264/H.265 via FFMPEG (ffmpeg_image_transport)
    What it is: Video compression using keyframes with predictive frames encoding only differences between frames; Bandwidth: ~1-5 Mbps typical (configurable via bitrate)
    Use case: Best for teleoperation - high frame rate video over WiFi
        --- Change: <img> to <video>
        'You need the <video> tag: It activates the browser's built-in video player engine (hardware acceleration).'

## Details (ignore)

$ npm run dev        #To start the server

Dependencieres: Command List (Minimal)
```
bash
$ sudo apt install ros-jazzy-rosbridge-suite
$ sudo apt install ros-jazzy-web-video-server
$ sudo apt install npm
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
$ nvm install 24.11.1
$ npm create vite@latest nara-ihm -- --template react-ts	#For TypeScript
Trocar o Arquivo
$ cd nara-ihm ***
$ npm install
$ npm install ws        #instalar o websocket para comunicação 'Obs: e'
$ npm install @types/ws --save-dev 
$ npm install roslib
$ npm install zustand
$ npm install jotai
```
node --version 24.11.1  
nvm --version 0.39.2  
npm --version 11.6.2  
VS Code - Extensions: ES7+ React/Redux/React-Native snippets  
TypeScript  
React
