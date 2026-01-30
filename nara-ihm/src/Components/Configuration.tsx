import { useState } from 'react'
import './Configuration.css'

import { useStore } from 'zustand'
import { GlobalStore, ROStore } from '../contexts/Store'
import { useAtom, useSetAtom } from 'jotai'
import { LogAtom, MenuAtom, TeleopAtom } from '../contexts/Molecule'

export const ConfigurationMenu = () => {
    const [ConfigOption, setConfigOption] = useState(1)

    const ros = useStore(ROStore, (s) => s.ros)
    const isConnected = useStore(ROStore, (s) => s.isConnected)
    const logout = useStore(GlobalStore, (state) => state.logout)
    const [ShowMenu, setShowMenu]= useAtom(MenuAtom)
    const [StartTeleop, setStartTeleop]= useAtom(TeleopAtom)
    const setLogData = useSetAtom(LogAtom)

    return (
        <div className='Configuration'>
          <div className={`configuration-button ${ShowMenu ? 'enabled' : 'disabled'}`} onClick={() => setShowMenu(!ShowMenu)}>{"<"}</div>

          <div className={`configuration-panel ${ShowMenu ? 'show' : 'hide'}`}>

            <div className='configuration-options'>
              <div className='configuration-options-button' onClick={() => setConfigOption(1)}>Principal</div>
              <div className='configuration-options-button' onClick={() => setConfigOption(2)}>Option Two</div>
              <div className='configuration-options-button' onClick={() => setConfigOption(3)}>Option Three</div>
              <div className='configuration-options-button' onClick={() => setConfigOption(4)}>Option Four</div>
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
              <div className='configuration-box-button' onClick={() => { logout(); setShowMenu(false); setLogData({msg: "Retornado a tela Inicial", id: Date.now(), error: false}); }}> </div>
              <div className='configuration-box-text'> Deslogar </div>
            </div>
            </>
            : null}

          </div>
        </div>
    );
}