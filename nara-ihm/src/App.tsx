import { useEffect, useRef } from 'react'
import { Intro } from './Components/Intro';
import { ConfigurationMenu } from './Components/Configuration';
import { CameraComponent } from './Components/Camera';
import { MessageLog } from './Components/MessageLog';

import './App.css';

import { useStore } from 'zustand'
import { GlobalStore, ROStore } from './contexts/Store'
import { useSetAtom } from 'jotai';
import { LocationAtom, SpeedAtom } from './contexts/Molecule';

function App() {
  const connectionAttemptedRef = useRef(false);
  const userConfig = useStore(GlobalStore, (s) => s.userConfig)
  const isConnected = useStore(ROStore, (s) => s.isConnected)
  const ros = useStore(ROStore, (s) => s.ros)
  const setCameraURL = useSetAtom(LocationAtom)
  const setMaxSpeed = useSetAtom(SpeedAtom)

  useEffect(() => {                                           // Verificar se ainda é necessário!
    if (!connectionAttemptedRef.current) {
      connectionAttemptedRef.current = true;
      ros.connect();
    }
    return () => {
      connectionAttemptedRef.current = true;
  
      if (isConnected) {
        ros.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
      if (userConfig.Environment === 2) { // 2 é para o ambiente virtual
        setCameraURL({link: 'http://localhost:8080/stream?topic=/noblenara/camera_link/image&type=mjpeg', user: 'http://localhost:8080/stream?topic=/noblenara/camera_user&type=mjpeg'});
        setMaxSpeed({linear: -1.5, angular: 0.5});
      }
      else if (userConfig.Environment === 1) { // 1 é para o ambiente real -> Atualizar o endereço
        setCameraURL({link: '', user: ''});
        setMaxSpeed({linear: 1.5, angular: 0.5});
      }}, [userConfig.Environment, setCameraURL, setMaxSpeed]);

  if(userConfig.Environment === 0){ //Renderiza a Introdução enquanto a variável === 0
    return <Intro />;
  }

  return (
    <div className="App">
      <main>
        <MessageLog/>

        <div className='App-header'> <h1>NARA - Robot HMI</h1> </div>
      
        <ConfigurationMenu/>

        <CameraComponent/>
      </main>
    </div>
  )
}

export default App