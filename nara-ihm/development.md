<IHM Server Development>

Added Visual Prototype

Added /nara-ihm/services/ROS2Service.ts archive that handles the communication

Added Connection to ROS2 when the App launches, but the connection status is only updated when the app starts!!!










Project Structure
nara-ihm/
├── public/           # Static files (images, icons)
├── src/             # Your React code lives here
│   ├── App.tsx      # Main component - It's the main window of the application
│   ├── main.tsx     # Entry point - It's like the main() funcion in code, it tells the browser to start there
│   └── index.css    # Styles - This control how everythin looks (colors, fonts, spacing)
├── package.json     # Project dependencies
└── vite.config.ts   # Build configuration - It tells Vite how to build and run the app


$ npm run dev        #To start the server

<Dependencieres: Command List (Minimal)
$ sudo apt install ros-jazzy-rosbridge-suite
$ sudo apt install ros-jazzy-web-video-server
$ sudo apt install npm
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
$ nvm install --lts
$ npm create vite@latest nara-ihm -- --template react-ts	#For TypeScript (Has static typping and it runs JavaScripts but the opposite is untrue)
Trocar o Arquivo
$ cd nara-ihm ***
$ npm install
$ npm install ws        #instalar o websocket para comunicação
$ npm install @types/ws --save-dev
$ npm install roslib
>
node --version 22.19.0
nvm --version .39.0
npm --version 0.9.3
VS Code - Extensions: ES7+ React/Redux/React-Native snippets
TypeScript
React
