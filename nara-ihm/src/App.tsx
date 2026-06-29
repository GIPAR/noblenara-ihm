import VoiceChat from "./Components/VoiceChat";
import LLMAssistant from "./Components/LLMAssistant";
import { useEffect, useRef } from 'react'
import { Intro } from './Components/Intro';
import { ConfigurationMenu } from './Components/Configuration';
import { MessageLog } from './Components/MessageLog';
import { Dashboard } from './Components/Dashboard/Dashboard';
import './App.css';

import { useStore } from 'zustand'
import { GlobalStore, ROStore } from './contexts/Store'
import { useAtom } from 'jotai';
import { ThemeAtom, VoiceChatAtom, ShowAssistantAtom } from './contexts/Molecule';

function App() {
  const connectionAttemptedRef = useRef(false);
  const userConfig = useStore(GlobalStore, (s) => s.userConfig)
  const isConnected = useStore(ROStore, (s) => s.isConnected)
  const ros = useStore(ROStore, (s) => s.ros)
  const robotData = useStore(ROStore, (state) => state.robotData)
  const [Theme] = useAtom(ThemeAtom)
  const [ShowVoiceChat] = useAtom(VoiceChatAtom)
  const [ShowAssistant] = useAtom(ShowAssistantAtom)

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

// setCameraURL({link: 'http://localhost:8080/stream?topic=/zed/zed_node/rgb/color/rect/image&type=mjpeg', user: 'http://localhost:8080/stream?topic=/noblenara/camera_usuario&type=mjpeg'});

  if(userConfig.Environment === 0){ //Renderiza a Introdução enquanto a variável === 0
    return <Intro />;
  }

  return (
    <div className={`App ${Theme}`}>
      <main>
        <MessageLog/>

        {ShowVoiceChat ? <VoiceChat /> : null}

        {ShowAssistant ? <LLMAssistant /> : null}

        <div className='App-header'> <h1>
          {robotData.project === "noblenara" ? ( "NARA - Robot HMI"  ):( null )}
          {robotData.project === "RoboticsLLM" ? ( "RoboticsLLM - HMI"  ):( null )}
        </h1></div>

        <ConfigurationMenu/>

        <Dashboard/>
      </main>
    </div>
  )
}

export default App