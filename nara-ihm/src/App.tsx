import { useEffect, useRef } from 'react'
import { Intro } from './Components/Intro';
import { ConfigurationMenu } from './Components/Configuration';
import { RosapiMenu } from './Components/Rosapi';
import { MessageLog } from './Components/MessageLog';
import { Dashboard } from './Components/Dashboard/Dashboard';
import { BatteryView } from './Components/Battery/Battery';
import './App.css';

import { useStore } from 'zustand'
import { GlobalStore, ROStore } from './contexts/Store'
import { useSetAtom, useAtom } from 'jotai';
import { LocationAtom, SpeedAtom, RobotAtom } from './contexts/Molecule';

function App() {
  const connectionAttemptedRef = useRef(false);
  const userConfig = useStore(GlobalStore, (s) => s.userConfig)
  const isConnected = useStore(ROStore, (s) => s.isConnected)
  const ros = useStore(ROStore, (s) => s.ros)
  const setCameraURL = useSetAtom(LocationAtom)
  const setMaxSpeed = useSetAtom(SpeedAtom)
  const [Robot] = useAtom(RobotAtom)

  useEffect(() => {
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
        setMaxSpeed({linear: 1, angular: 2});
      }
      else if (userConfig.Environment === 1) { // 1 é para o ambiente real -> Atualizar o endereço
        setCameraURL({link: 'http://localhost:8080/stream?topic=/zed/zed_node/rgb/color/rect/image&type=mjpeg', user: ''});
        setMaxSpeed({linear: 1, angular: 2});
      }}, [userConfig.Environment, setCameraURL, setMaxSpeed]);

  if(userConfig.Environment === 0){ //Renderiza a Introdução enquanto a variável === 0
    return <Intro />;
  }

  return (
    <div className="App">
      <main>
        <MessageLog/>

        <div className='App-header'> <h1>
                {Robot.robot === 0 ? ( "NARA - Robot HMI"  ):( null )}
                {Robot.robot === 1 ? ( "NARINHA - Robot HMI"  ):( null )}
                {Robot.robot === 2 ? ( "GIPIZINHO - Robot HMI"  ):( null )}
        </h1></div>

        <ConfigurationMenu/>

        <Dashboard/>

        <RosapiMenu/>

        {userConfig.Environment === 1 ? <BatteryView/> : null}
      </main>
    </div>
  )
}

export default App