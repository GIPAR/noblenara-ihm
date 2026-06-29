# NOBLENARA IHM

Arquivo README para tutorial de instalação da Interface Humano Máquina do repositório "noblenara-ihm", criada inicialmente para a cadeira de rodas autônoma NARA, sendo posteriormente evoluida para os demais projetos do GIPAR.

* **Importante!** Leia com atenção durante a instalação
* O arquivo Tutorial.md apresenta as explicações, descrições e tutoriais da interface

## 1 - Pré-requisitos

É necessário instalar bibliotecas e diferentes dependências para o correto funcionamento das simulações e pacotes, sendo que o projeto está sendo testado e construido no seguinte sistema:

* Ubuntu 24.04
* ROS2 Jazzy

Para a instalação do ROS2 Jazzy, segue-se o tutorial encontrado no seguinte link oficial (https://docs.ros.org/en/jazzy/Installation.html)

### 1.1 - Instalando Dependências Iniciais

Instale as seguintes bibliotecas, sendo o rosbridge necessário para comunicação entre a Interface e o ROS2, enquanto que o web-video-server é próprio para transmissão das imagens

```bash
sudo apt install ros-jazzy-rosbridge-suite && \
    sudo apt install ros-jazzy-web-video-server && \
    sudo apt install npm && \
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

Em um novo terminal, rode o comando:

```bash
nvm install 24.11.1 # Apenas funciona se estiver em um novo terminal!
```

## 2 - Rodando o IHM

Baixe o repositório e copie o arquivo "noblenara-ihm-main" para o local desejado, preferencialmente no home, então, rode os seguintes comandos:

```bash
# Caso o arquivo foi copiado no home do computador, do contrário, troque a pasta de destino a seguir
cd ~/noblenara-ihm-main/nara-ihm && \
    npm install && \
    npm run dev
```
Após o install, pode-se rodar o pacote em qualquer momento com o comando "npm run dev", desde que o terminal esteja diretamente na pasta "nara-ihm"

****Importante! Para logar no site use o usuário "gipar" e senha "usergipar", caso queira a visualização para usuários comuns, utilize "nara" e "usergipar"; são placeholders temporários****

Também é necessário rodar outros comandos para o correto funcionamento da comunicação com o ROS2

```bash
ros2 run rosbridge_server rosbridge_websocket && \
    ros2 run web_video_server web_video_server && \
    ros2 run rosapi rosapi_node 
```

Caso a ***simulação*** da NARA estiver instalada, pode-se rodar este único comando 3 em 1: 

``` bash
ros2 launch smartwheelchair bridgelaunch.xml
```

## 3 - Assistente Inteligente (Gemini)

A IHM da NARA possui integração com o modelo Gemini para consultas em linguagem natural.

### Configuração

Crie um arquivo `.env` na pasta raiz do projeto:

```env
VITE_GEMINI_API_KEY=sua_chave_gemini_aqui
```

A chave pode ser obtida através do Google AI Studio.

### Navegadores

| Navegador     | Suporte  |
| ------------- | -------- |
| Google Chrome | Completo |
| Firefox       | Parcial  |

No Firefox, as funcionalidades baseadas em reconhecimento de voz podem não estar disponíveis devido às limitações da Web Speech API.

## 4 - Regras de Projeto

Para a plena organização e desenvolvimento do projeto, todos os Commits de *novas* contribuições devem ser feitas fora do branch principal:

- Cria uma nova branch do repositório com o nome do seu enfoque no projeto
- Ou faça commit no repositório chamado "Desenvolvimento"
