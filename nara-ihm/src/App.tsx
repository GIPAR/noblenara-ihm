import { useState, useEffect, useRef } from 'react'
import './App.css'
import { ros2Service } from './services/ROS2Service';
import { KeyboardControl } from './services/KeyboardControl';

function App() {                                              // OBS: No vite é necessário o uso de useState para que haja atualização instant
  const [isConnected, setIsConnected] = useState(false);      // Seta o estado de conexão do ROS2, OBS: não há atualização automatica (14/10/25)
  const [cameraActive, setCameraActive] = useState(false);    // Seta o estado da camera, no código se for falso ele coloca um placeholder
  const connectionAttemptedRef = useRef(false);               // Variável necessária para não dar problema com o Restrict Mode do React

  const [camerasettings, setcamerasettings] = useState(0);    // Variável int para a lógica da câmera de acordo com a escolha do usuário
  const [cameraurl, setcameraurl] = useState('');             // Strings para o caminho da camera de acordo com seleção do usuário
  const [cameralink, setcameralink] = useState('http://localhost:8080/stream?topic=/noblenara/camera_link/image&type=mjpeg');

  
  const [maxLinearSpeed, setMaxLinearSpeed] = useState(-1.5); //Variáveis para mudar a velocidade máxima
  const [maxAngularSpeed, setMaxAngularSpeed] = useState(0.5);

  useEffect(() => {                                           // Só conecta se ainda não tentou conectar devido ao RestrictMode
    if (!connectionAttemptedRef.current) {                    // Conecta ao ROS2 na abertura do site
      connectionAttemptedRef.current = true;
      connectToROS2();
    }
    return () => {                                            // Cleanup:
      console.log('🧹 Cleaning up ROS2 connection...'); 
      connectionAttemptedRef.current = false;                 // Reset flag para permitir reconexão futura se necessário
  
      if (isConnected) {
        ros2Service.disconnect();
      }
    };
  }, []);

  const connectToROS2 = () => {                               // Conecta ao ROS2 quando requisitado
    console.log('🔄 Attempting to connect to ROS2...')
    
    ros2Service.connect()
      .then(() => {
        console.log('✅ ROS2 Connected successfully')
        setIsConnected(true)
      })
      .catch((error) => {
        console.error('❌ Failed to connect to ROS2:', error)
        setIsConnected(false)
      })
  }

  const toggleCamera = () => {                                // Seta o estado da câmera quando requisitado
    if (!isConnected) {
      console.log('❌ Cannot start camera: ROS2 not connected')
      return
    }
    if (!cameraActive) {
      console.log('📹 Starting camera stream...')
      setCameraActive(true)
    } else {
      console.log('📹 Stopping camera stream...')
      setCameraActive(false)
    }
  }

  const FloatingPanel = () => {                               // Painel com as opções
  return (
    <div className="floating-panel">
      {/* Alguns são placeholders temporários, adicionaremos reais com o desenvolvimento */}
      <div 
          className="panel-item" 
          onClick={connectToROS2}
          style={{ 
            background: isConnected 
              ? 'rgba(74, 222, 128, 0.3)' // Green when connected
              : 'rgba(239, 68, 68, 0.2)', // Red when disconnected
            cursor: 'pointer'
          }}
          title={isConnected ? 'ROS2 Connected - Click to reconnect' : 'Connect to ROS2'}
        >
          {isConnected ? '🔧' : '🔌'}
        </div>
      
      <div 
          className="panel-item" 
          onClick={toggleCamera}
          style={{ 
            background: cameraActive 
              ? 'rgba(74, 222, 128, 0.3)' 
              : 'rgba(0, 184, 230, 0.068)',
            cursor: isConnected ? 'pointer' : 'not-allowed',
            opacity: isConnected ? 1 : 0.5
          }}
        >
          📹
      </div>

      <div 
          className="panel-item" 
          onClick={() =>{
            setcameralink(cameralink === 'http://localhost:8080/stream?topic=/noblenara/camera_link/image&type=mjpeg' ? 'http://localhost:8080/stream?topic=/zed/zed_node/rgb/color/rect/image&type=mjpeg' : 'http://localhost:8080/stream?topic=/noblenara/camera_link/image&type=mjpeg');
            //setMaxAngularSpeed(maxAngularSpeed === 1.0 ? -1.0 : 1.0); //Verificar se é necessário mudar o sinal deste!
            setMaxLinearSpeed(maxLinearSpeed === -1.5 ? 1.5 : -1.5);
          }}
          style={{ 
            background: cameraActive 
              ? 'rgba(74, 222, 128, 0.3)' 
              : 'rgba(0, 184, 230, 0.068)',
            cursor: isConnected ? 'pointer' : 'not-allowed',
            opacity: isConnected ? 1 : 0.5
          }}
          title={"Switch: Simulação <-> Física"}
        >
          ⚙️
      </div>

      <div
          className="panel-item"
          onClick={ros2Service.stopRobot}
          style={{
            background: isConnected
              ? 'rgba(74, 222, 128, 0.3)'
              : 'rgba(0, 184, 230, 0.068)',
            cursor: isConnected ? 'pointer' : 'not-allowed',
            opacity: isConnected ? 1 : 0.5
          }}
          title="Parada de Emergência"
        >
          🛑
        </div>

    </div>
    );
  };

  const whichCamera = () => {  
    switch(camerasettings) {
      case 0:
        return <div>No camera</div>;
      case 1:
        return whichCameraCODE();
      case 2:
        return whichCameraCODE();
      case 3:
        return whichCameraCODE();
      default:
        return <div>No camera</div>;
   }
  };

  const whichCameraCODE = () => {
          return (                                       /* Código para a lógica da câmera com variável string em lugar do endereço */
          <div className={`camera-stream-container ${cameraActive ? 'online' : 'offline'}`}>
              {cameraActive ? (
                <>
                  <img 
                    src={cameraurl}                     /* Variável State para endereço que pegará a câmera */
                    alt="Robot Camera Feed"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(_e) => {                  /* _e indica que é uma variavel intencionalmente não usada mas que possivel irá no futuro */
                      console.log('❌ Camera stream error')
                      setCameraActive(false)
                    }}
                    onLoad={() => console.log('✅ Camera stream loaded')}
                  />
                  {camerasettings === 3 &&              /* Mostra o camera user em conjunto com o camera link apenas quando a variavel settings é = 3 */
                  <img 
                    src="http://localhost:8080/stream?topic=/noblenara/camera_user&type=mjpeg"
                    alt="Robot Camera Feed"
                    style={{
                      right: '10px',
                      position: 'absolute',             /* posição absoluta em relação á primeira */
                      width: '25%',
                      height: '25%',
                      objectFit: 'cover',
                      border: '2px solid white'
                    }}
                    onError={(_e) => {
                      console.log('❌ Camera stream error')
                      setCameraActive(false)
                    }}
                    onLoad={() => console.log('✅ Camera stream loaded')}
                  />
                  }
                  <div className="camera-status online">LIVE</div>
                </>
              ) : (
                <>
                  <div className="camera-placeholder">
                    Camera Stream Ready<br/>
                    <small>Click 📹 to start</small>
                  </div>
                  <div className="camera-status offline">OFFLINE</div>
                </>
              )}

              {/* Keyboard Control Bar - always visible */}
              <KeyboardControl 
                isConnected={isConnected}
                maxAngularSpeed={maxAngularSpeed}
                maxLinearSpeed={maxLinearSpeed}
              />
          </div>
        );
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>NARA - Robot HMI</h1>
        <p style={{ color: isConnected ? '#4ade80' : '#0000008a' }}>
          Bridge Status: {isConnected ? 'Connected' : 'Disconnected'} 
        </p>
      </header>
      
      <FloatingPanel />

      <main>
        <div className="dashboard">
          <div className="camera-panel">
            {whichCamera()}
          </div>

          <div className="settings-panel">
            <div className="settings-item"
              onClick={() => setcamerasettings(0)}>💤
            </div>

            <div className="settings-item" 
              onClick={() => {
                setcameraurl('http://localhost:8080/stream?topic=/noblenara/camera_user&type=mjpeg');
                setcamerasettings(1);
                }}>👤
            </div>

            <div className="settings-item" 
              onClick={() => {
                setcameraurl(cameralink);
                setcamerasettings(2);
                }}>📹
            </div>
            
            <div className="settings-item" 
              onClick={() => {
                setcameraurl(cameralink);
                setcamerasettings(3);
                }}>
                <span style={{fontSize: '0.9rem'}}>👤📹</span>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}

export default App
