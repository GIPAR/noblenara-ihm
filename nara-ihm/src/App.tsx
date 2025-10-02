import { useState, useEffect, useRef } from 'react'
import './App.css'
import { ros2Service } from './services/ROS2Service';
import { KeyboardControl } from './services/KeyboardControl';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const connectionAttemptedRef = useRef(false);

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
          {isConnected ? '⚙️' : '🔌'}
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

      <div className="panel-item">🔧</div>
    </div>
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>NARA - Robot HMI</h1>
        <p style={{ color: isConnected ? '#4ade80' : '#0000008a' }}>
          Robot Status: {isConnected ? 'Connected' : 'Disconnected'}
        </p>
      </header>
      
      <FloatingPanel />

      <main>
        <div className="dashboard">
          <div className="camera-panel">
            <div className={`camera-stream-container ${cameraActive ? 'online' : 'offline'}`}>
              {cameraActive ? (
                <>
                  <img 
                    src="http://localhost:8080/stream?topic=/noblenara/camera_link/image&type=mjpeg"
                    alt="Robot Camera Feed"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      console.log('❌ Camera stream error')
                      setCameraActive(false)
                    }}
                    onLoad={() => console.log('✅ Camera stream loaded')}
                  />
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
                maxLinearSpeed={-5}
                maxAngularSpeed={0.8}
              />

            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
