# NOBLENARA IHM
Interface Humano-Máquina propriamente para o ROS2.

## 1 - Pré-requisitos
É necessário instalar bibliotecas e diferentes dependências para o correto funcionamento das simulações e pacotes, sendo que o projeto está sendo testado e construido no seguinte sistema:
* Ubuntu 24.04
* ROS2 Jazzy

Para a instalação do ROS2 Jazzy, segue-se o tutorial encontrado no seguinte link (https://docs.ros.org/en/jazzy/Installation.html)

### 1.1 - Instalando Dependências Iniciais
Instale as seguintes bibliotecas, sendo o rosbridge necessário para comunicação IHM-ROS2 e o web-video-server próprio para transmissão da imagem pelo ROS2-IHM
```
bash
$ sudo apt install ros-jazzy-rosbridge-suite
$ sudo apt install ros-jazzy-web-video-server
$ sudo apt install npm
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
$ nvm install 24.11.1 #abra um novo terminal pra conseguir usar o comando!
```

## 2 - Rodando o IHM

Baixe o repositório e copie o arquivo "noblenara-ihm-main" para o local desejado, preferencialmente no home, então, mova-se para este **mesmo** arquivo pelo terminal e rode os seguintes comandos:
```
bash
$ cd ~/noblenara-ihm-main/nara-ihm #Caso o arquivo foi copiado na área de trabalho do computador
$ npm install
$ npm run dev
```
Após o install, pode-se rodar o pacote em qualquer momento com o comando "npm run dev", desde que o terminal esteja diretamente na pasta base do projeto

****Importante! Para logar no site use o usuário "gipar" e senha "usergipar", caso queira a visualização para usuários comuns, utilize "nara" e "usergipar"; são placeholders temporários****

Também é necessário rodar outros comandos para o correto funcionamento da comunicação ROS2-IHM
```
bash
$ ros2 run rosbridge_server rosbridge_websocket
$ ros2 run web_video_server web_video_server
$ ros2 run rosapi rosapi_node 
```
Caso a ***simulação*** da NARA estiver instalada, pode-se rodar este único comando 3 em 1: 
```
bash
$ ros2 launch smartwheelchair bridgelaunch.xml
```

## 3 - Controle por Voz - Branch `voz-chatbot`

Esta branch adiciona à IHM da NARA um módulo inicial de interação por voz, integrado ao ROS2 por meio do `rosbridge`.

### Funcionalidades implementadas

* Reconhecimento de voz em português;
* Resposta por voz usando Text-to-Speech;
* Publicação de comandos no tópico `/noblenara/cmd_vel`;
* Consulta de status da bateria;
* Consulta de status da conexão com ROS2;
* Identificação do ambiente atual: cadeira real ou virtual;
* Consulta do último comando executado;
* Comando de ajuda com lista de comandos disponíveis;
* Comandos conversacionais básicos;
* Estrutura inicial para navegação futura;
* Separação da lógica em `VoiceCommandService` e `VoicePatterns`.

### Como executar

Em terminais separados, execute:

```bash
source /opt/ros/jazzy/setup.bash
source ~/NARA/noblenara/install/setup.bash
ros2 run rosbridge_server rosbridge_websocket
```

```bash
source /opt/ros/jazzy/setup.bash
source ~/NARA/noblenara/install/setup.bash
ros2 run web_video_server web_video_server
```

```bash
cd ~/NARA/noblenara-ihm/nara-ihm
npm run dev
```

Acesse a IHM pelo Google Chrome:

```text
http://localhost:5173
```

### Observação importante

O reconhecimento de voz foi testado no Google Chrome. Navegadores como Firefox podem não oferecer suporte adequado à Web Speech API.

### Comandos de voz disponíveis

Controle da cadeira:

* frente
* direita
* esquerda
* parar
* para trás
* voltar

Consultas:

* status da bateria
* status da conexão
* ambiente atual
* último comando
* comandos disponíveis
* ajuda
* que horas são
* qual a data de hoje

Comandos conversacionais:

* quem é você
* o que é a NARA
* qual é seu objetivo
* o que você pode fazer

Navegação futura:

* ir para recepção
* ir para laboratório
* ir para sala
* ir para entrada
* ir para museu
* modo autônomo
* cancelar navegação

### Teste de bateria em ambiente virtual

Caso a cadeira real esteja desligada, é possível simular a bateria com:

```bash
ros2 topic pub /noblenara/battery_status sensor_msgs/msg/BatteryState "{voltage: 24.6}"
```

Depois, na IHM, diga:

```text
status da bateria
```

### Arquivos principais modificados/criados

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

### Regras de Projeto 🚀📋

Para a plena organização e desenvolvimento do projeto, todos os Commits de *novas* contribuições devem ser feitas fora do branch principal:

- Cria uma nova branch do repositório com o nome do seu enfoque no projeto
- Ou faça commit no repositório chamado "Desenvolvimento"
