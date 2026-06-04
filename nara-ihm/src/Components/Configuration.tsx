import { useState, useEffect } from 'react'
import './Configuration.css'

import { useStore } from 'zustand'
import { GlobalStore, ROStore } from '../contexts/Store'
import { useAtom, useSetAtom } from 'jotai'
import { LogAtom, MenuAtom, TeleopAtom, RosapiAtom, RobotAtom, ThemeAtom, MapAtom, VoiceChatAtom } from '../contexts/Molecule'

export const ConfigurationMenu = () => {
    const [ConfigOption, setConfigOption] = useState(1)

    const ros = useStore(ROStore, (s) => s.ros)
    const isConnected = useStore(ROStore, (s) => s.isConnected)
    const userConfig = useStore(GlobalStore, (s) => s.userConfig)
    const logout = useStore(GlobalStore, (state) => state.logout)
    const [ShowMenu, setShowMenu]= useAtom(MenuAtom)
    const [ShowRosapi, setShowRosapi] = useAtom(RosapiAtom)
    const [StartTeleop, setStartTeleop] = useAtom(TeleopAtom)
    const [Theme, setTheme] = useAtom(ThemeAtom)
    const [ShowMap, setShowMap] = useAtom(MapAtom)
    const [ShowVoiceChat, setShowVoiceChat] = useAtom(VoiceChatAtom)
    const setRobotConfig = useSetAtom(RobotAtom)
    const setLogData = useSetAtom(LogAtom)

    useEffect(() => {
        if(isConnected === false){
            setShowRosapi(false);
        }
    }, [isConnected, setShowRosapi]);

    return (
        <div className='Configuration'>
          <div className={`configuration-button ${ShowMenu ? 'enabled' : 'disabled'}`} onClick={() => setShowMenu(!ShowMenu)}>{"<"}</div>

          <div className={`configuration-panel ${ShowMenu ? 'show' : 'hide'}`}>

            <div className={`configuration-panel-background ${Theme === 'light' ? 'light' : 'dark'}`}></div>

            <div className='configuration-options'>
              <div className='configuration-options-button' onClick={() => setConfigOption(1)}>Principal</div>
              <div className='configuration-options-button' onClick={() => setConfigOption(2)}>Ferramentas</div>
              <div className='configuration-options-button' onClick={() => setConfigOption(3)}>Aparência</div>
              <div className='configuration-options-button' onClick={() => setConfigOption(4)}>Avançado</div>
            </div>

            {ConfigOption === 1 ?
            <>
            <div className='configuration-box'>
              <div className={`configuration-box-button ${isConnected ? 'active' : ''} `} onClick={() => ros.connect()}> </div>
              <div className='configuration-box-text'> {isConnected ? 'Conectado ao ROS2!' : 'Conectar-se ao ROS2'} </div>
            </div>

            <div className='configuration-box'>
              <div className={`configuration-box-button ${StartTeleop ? 'active' : ''} `} onClick={() => {if(isConnected == false){setLogData({msg: "Primeiramente conecte ao ROS!", id: Date.now(), error: true});} else{setStartTeleop(!StartTeleop)}}}> </div>
              <div className='configuration-box-text'> {StartTeleop ? 'Desativar Teclado' : 'Ativar Teclado'} </div>
            </div>

            <div className='configuration-box'>
              <div className='configuration-box-button' onClick={ros.stopRobot}> </div>
              <div className='configuration-box-text'> Parar Robô </div>
            </div>

            <div className='configuration-box'>
              <div className='configuration-box-button' onClick={ros.disconnect}> </div>
              <div className='configuration-box-text'> Desconectar Robô </div>
            </div>

            <div className='configuration-box'>
              <div className='configuration-box-button' onClick={() => { 
                logout(); setShowMenu(false); setShowRosapi(false); setLogData({msg: "Retornado a tela Inicial", id: Date.now(), error: false}); }}> </div>
              <div className='configuration-box-text'> Deslogar </div>
            </div>
            </>
            : null}

            {ConfigOption === 2 && userConfig.Type === true ?
            <>
            <div className='configuration-box'>
              <div className={`configuration-box-button ${ShowRosapi ? 'active' : ''} `} onClick={() => {if(isConnected == false){setLogData({msg: "Primeiramente conecte ao ROS!", id: Date.now(), error: true});} else{setShowRosapi(!ShowRosapi)}}}> </div>
              <div className='configuration-box-text'> {ShowRosapi ? 'Desativar Menu ROS' : 'Ativar Menu ROS'} </div>
            </div>

            <div className='configuration-box'>
              <div className={`configuration-box-button ${ShowMap ? 'active' : ''} `} onClick={() => {if(isConnected == false && ShowMap == false){setLogData({msg: "Primeiramente conecte ao ROS!", id: Date.now(), error: true});} else{setShowMap(!ShowMap)}}}> </div>
              <div className='configuration-box-text'> {ShowMap ? 'Desativar Mapa SLAM' : 'Ativar Mapa Slam'} </div>
            </div>
            </>
            : null}

            {ConfigOption === 2 ?
            <>
            <div className='configuration-box'>
              <div className={`configuration-box-button ${ShowVoiceChat ? 'active' : ''}`} onClick={() => setShowVoiceChat(!ShowVoiceChat)}> </div>
              <div className='configuration-box-text'> {ShowVoiceChat ? 'Desativar Controle por Voz' : 'Ativar Controle por Voz'} </div>
            </div>
            </>
            : null}

            {ConfigOption === 3 === true ?
            <>
            <div className='configuration-box'>
              <div className={`configuration-box-button ${Theme === 'light' ? 'active' : ''} `} onClick={() => { if(Theme === 'light'){ setTheme('dark') } else{ setTheme('light') }}}> </div>
              <div className='configuration-box-text'> {Theme === 'light' ? 'Ativar Tema Escuro' : 'Ativar Tema Claro'} </div>
            </div>
            </>
            : null}

            {ConfigOption === 4 && userConfig.Type === true ?
            <>
            <div className='configuration-box'>
              <div className='configuration-box-button' onClick={() => {setRobotConfig({ robot: 0, topic: '/noblenara/cmd_vel' }); setLogData({msg: "'NARA' selecionado!", id: Date.now(), error: false});}}> </div>
              <div className='configuration-box-text'> NOBLENARA </div>
            </div>

            <div className='configuration-box'>
              <div className='configuration-box-button' onClick={ () => {setRobotConfig({robot: 1, topic: '/RoboticsLLM/cmd_vel'}); setLogData({msg: "'NARINHA' Selecionado!", id: Date.now(), error: false});}}> </div>
              <div className='configuration-box-text'> NARINHA </div>
            </div>

            <div className='configuration-box'>
              <div className='configuration-box-button' onClick={() => {setRobotConfig({ robot: 2, topic: '/RoboticsLLM/cmd_vel' }); setLogData({msg: "'GIPZINHO' selecionado!", id: Date.now(), error: false});}}> </div>
              <div className='configuration-box-text'> GIPZINHO </div>
            </div>
            </>
            : null}

          </div>
        </div>
    );
}