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
A seguir, copie o arquivo nara-ihm no seu computador

### 2 - Rodando o IHM

Baixe o repositório e copie o arquivo "nara-ihm" para o local desejado; mova-se para este **mesmo** arquivo e rode os seguintes comandos:
```
bash
$ cd nara-ihm
$ npm install
$ npm run dev
```
Após o install, pode-se rodar o pacote em qualquer momento com o comando "npm run dev", desde que o terminal esteja diretamente na pasta base do projeto

****Importante! Para logar no site use o usuário "gipar" e senha "usergipar", são placeholders temporários****

Também é necessário rodar outros comandos para o correto funcionamento da comunicação ROS2-IHM
```
bash
$ ros2 run rosbridge_server rosbridge_websocket
$ ros2 run web_video_server web_video_server
ros2 run rosapi rosapi_node 
```
Caso a ***simulação*** da NARA estiver instalada, pode-se rodar este único comando 3 em 1: 
```
bash
$ ros2 launch smartwheelchair bridgelaunch.xml
```