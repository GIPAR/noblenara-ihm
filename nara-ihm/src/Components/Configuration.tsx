import { useState, useEffect } from 'react'
import './Configuration.css'

import { useStore } from 'zustand'
import { GlobalStore, ROStore } from '../contexts/Store'
import { useAtom, useSetAtom } from 'jotai'
import { LogAtom, MenuAtom, TeleopAtom, RosapiAtom, RobotAtom } from '../contexts/Molecule'

export const ConfigurationMenu = () => {
    const [ConfigOption, setConfigOption] = useState(1)

    const ros = useStore(ROStore, (s) => s.ros)
    const isConnected = useStore(ROStore, (s) => s.isConnected)
    const userConfig = useStore(GlobalStore, (s) => s.userConfig)
    const logout = useStore(GlobalStore, (state) => state.logout)
    const [ShowMenu, setShowMenu]= useAtom(MenuAtom)
    const [ShowRosapi, setShowRosapi] = useAtom(RosapiAtom)
    const [StartTeleop, setStartTeleop]= useAtom(TeleopAtom)
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

            <div className='configuration-options'>
              <div className='configuration-options-button' onClick={() => setConfigOption(1)}>Principal</div>
              <div className='configuration-options-button' onClick={() => setConfigOption(2)}>Ferramentas</div>
              <div className='configuration-options-button' onClick={() => setConfigOption(3)}>Aparência</div>
              <div className='configuration-options-button' onClick={() => setConfigOption(4)}>Avançado</div>
            </div>

            {ConfigOption === 1 ?
            <>
            <div className='configuration-box'>
              <div className={'configuration-box-switch'} onClick={() => ros.connect()}>
                <div className={`configuration-switch-slider ${isConnected ? 'active' : ''}`}></div>
              </div>
              <div className='configuration-box-text'> {isConnected ? 'Conectado ao ROS2!' : 'Conectar-se ao ROS2'} </div>
            </div>

            <div className='configuration-box'>
              <div className={'configuration-box-switch'} onClick={() => {if(isConnected == false){setLogData({msg: "Primeiramente conecte ao ROS!", id: Date.now(), error: true});} else{setStartTeleop(!StartTeleop)}}}>
                <div className={`configuration-switch-slider ${StartTeleop ? 'active' : ''}`}></div>
              </div>
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
              <div className={'configuration-box-switch'} onClick={() => {if(isConnected == false){setLogData({msg: "Primeiramente conecte ao ROS!", id: Date.now(), error: true});} else{setShowRosapi(!ShowRosapi)}}}>
                <div className={`configuration-switch-slider ${ShowRosapi ? 'active' : ''}`}></div>
              </div>
              <div className='configuration-box-text'> {ShowRosapi ? 'Desativar Menu ROS' : 'Ativar Menu ROS'} </div>
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