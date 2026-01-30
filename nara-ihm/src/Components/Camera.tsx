import { useState, useRef } from 'react';
import './Camera.css'
import { KeyboardControl } from '../services/KeyboardService';

import { useAtom, useSetAtom } from 'jotai';
import { LocationAtom, LogAtom, TeleopAtom } from '../contexts/Molecule';

export const CameraComponent = () => {
    const cameraLoadedRef = useRef<{ main: boolean | null; minor: boolean | null }>({  main: null,  minor: null }); //Na abertura será "null", desta forma o código segue da forma desejada no ScreenCode()
    const [CameraSettings, setCameraSettings] = useState(0);    // Variável int para a lógica da câmera de acordo com a escolha do usuário

    const [StartTeleop] = useAtom(TeleopAtom)
    const [CameraURL] = useAtom(LocationAtom)
    const setLogData = useSetAtom(LogAtom)

    const ScreenCode = () => {
        return (
          <div className={`camera-screen ${cameraLoadedRef.current.main ? 'online' : 'offline'}`}>
            <img src={CameraSettings === 2 ? CameraURL.user : CameraURL.link} 
              alt={cameraLoadedRef.current.main === false ? "Verifique a conexão da Câmera" : ""}
              onError={() => {
                if(cameraLoadedRef.current.main !== false){
                  cameraLoadedRef.current.main = false;
                  setLogData({msg: "Erro ao carregar a câmera. Verifique a conexão.", id: Date.now(), error: true});}}}
              onLoad={() => {
                if (cameraLoadedRef.current.main !== true){
                  cameraLoadedRef.current.main = true;
                  setLogData({msg: "Camera Carregada com sucesso.", id: Date.now(), error: false})}}}/>
                
              {CameraSettings === 3 ?
                <div className='camera-screen-minor'>  
                  <img src={CameraURL.user}
                    alt={cameraLoadedRef.current.minor === false ? "Offline" : ""}
                  onError={() => {
                    if(cameraLoadedRef.current.minor !== false){
                    cameraLoadedRef.current.minor = false
                    setLogData({msg: "Erro ao carregar a câmera do usuário. Verifique a conexão.", id: Date.now(), error: true})
                  }}}
                  onLoad={() => {
                    if (cameraLoadedRef.current.minor !== true){
                      cameraLoadedRef.current.minor = true
                      setLogData({msg: "Camera do Usuário Ativa!", id: Date.now(), error: false})}}}
                  />
                </div>
              : null}
    
            {StartTeleop ? <KeyboardControl/> : null}
    
          </div>
        );
      };

    return (
        <div className='Camera'>
            {CameraSettings === 0 ? null : ScreenCode()}

            <div className="settings-panel">
                <div className="settings-item"  onClick={() =>  setCameraSettings(0)}>💤    </div>
                <div className="settings-item"  onClick={() => {setCameraSettings(1)}}>👤  </div>
                <div className="settings-item"  onClick={() => {setCameraSettings(2)}}>📹  </div>
                <div className="settings-item"  onClick={() => {setCameraSettings(3)}}>
                  <span style={{fontSize: '0.9rem'}}>👤📹</span>
                </div>
            </div>
        </div>
    );
}