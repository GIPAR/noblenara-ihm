import { useState, useEffect, useRef, useCallback } from 'react'
import { BatteryView } from './Battery';
import { MessageLog } from './MessageLog';
import './Intro.css'

import { useStore } from 'zustand'
import { GlobalStore, ROStore } from '../contexts/Store'
import { useAtom, useSetAtom } from 'jotai';
import { LogAtom, ShowBatteryAtom } from '../contexts/Molecule'

export const Intro = () => {
  const User = useStore(GlobalStore, (s) => s.User)           //Variáveis Globais
  const setUser = useStore(GlobalStore, (s) => s.setUser)
  const userConfig = useStore(GlobalStore, (s) => s.userConfig)
  const setuserConfig = useStore(GlobalStore, (s) => s.setuserConfig)
  const ros = useStore(ROStore, (s) => s.ros)
  const isConnected = useStore(ROStore, (s) => s.isConnected)
  const Battery = useStore(ROStore, (s) => s.batteryData)
  const [ShowBattery, setShowBattery] = useAtom(ShowBatteryAtom)
  const setLogData = useSetAtom(LogAtom)

  const [isReturning, setIsReturning] = useState(false);      // Flag para detectar retorno
  const [LeaveIntro, setLeaveIntro] = useState(false);        // Flag para detectar saída
  const loginRef = useRef<HTMLDivElement>(null);              // Referência para a div principal
  const introsleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {  // Efeito para apressar a animação no retorno
    if (!userConfig.Login && isReturning && loginRef.current) {
      loginRef.current.style.setProperty('--anim-duration', '1.5s');
      loginRef.current.style.setProperty('--anim-delay', '0.3s');
      setIsReturning(false);
    }
  }, [userConfig.Login, isReturning]);

  const HandleLogin = useCallback(() => {
    if(User.name == 'gipar' && User.password == 'usergipar'){
      setuserConfig({Login: true, isAdmin: true, Intro: true});
      setIsReturning(false);  // Reseta para carregamento inicial
      setLogData({msg: "Login realizado com sucesso!", id: Date.now(), error: false});
    }
    else if(User.name == 'nara' && User.password == 'usergipar'){
      setuserConfig({Login: true, isAdmin: false, Intro: true}); // Ambiente é realmente settado no "HandleLeave", não aqui
      setIsReturning(false);
      setLogData({msg: "Login realizado com sucesso!", id: Date.now(), error: false});
    }
    else{
      setLogData({msg: "Usuário ou senha inválida", id: Date.now(), error: true});
    };
  }, [User, setuserConfig, setLogData]);

  useEffect(() => {
    if (userConfig.Login === true){return}

    const HandleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter'){HandleLogin();}
    }
    window.addEventListener('keydown', HandleKey);
    return () => {window.removeEventListener('keydown', HandleKey);};
  }, [userConfig.Login, HandleLogin]);

  const HandleLeave = async () => {
    setLeaveIntro(true);
    await introsleep(3600);
    setuserConfig({...userConfig, Intro: false});
  }

  return (
    <div className={`Intro ${LeaveIntro ? 'disappear' : 'start'}`}>
      <main>
        <div className="Intro-title">
          <h1>GIPAR</h1>
        </div>

        <MessageLog/>

        {isConnected ? 
          <div className='Intro-Battery'>
            <BatteryView/>
          </div>
        : (null)}

        {userConfig.Login !== true ? ( /* Tela de Login */

          <div className="Intro-login" ref={loginRef}>
            <div className='Intro-login-headerbar'>
              <p>Faça seu Login</p>
            </div>

            <div className='Intro-image'></div>

            <div className='Intro-login-wrapper'>
              <div className='Intro-login-label'>
                <h6>Usuário:</h6>
              </div>
              <input 
                type="text" 
                placeholder="Digite o seu nome de usuário" 
                value={User.name}
                onChange={(e) => setUser({...User, name: e.target.value})}
                className="Intro-login-bar"
              />
            </div>  

            <div className='Intro-login-wrapper'>
              <div className='Intro-login-label'>
                <h6>Senha:</h6>
              </div>
              <input 
                type="password" 
                placeholder="Digite sua senha" 
                value={User.password}
                onChange={(e) => setUser({...User, password: e.target.value})}
                className="Intro-login-bar"
              />
            </div>

            <div className='Intro-login-button'
              onClick={() => {HandleLogin()}}>
              <p>Entrar</p>
            </div>
          </div>
        ) : (
          <>
          {userConfig.isAdmin === true ? ( /* Desenvolvedores: Seleção de Configurações Iniciais */
            <>
              <div className="Intro-configbox">
                <div className='Intro-configbox-headerbar'>
                  <h2>Bem vindo/a, {User.name}!</h2>
                </div>
                
                <div className='Intro-second-image'></div>
              
                <h3>Selecione as Configurações Iniciais, pressione o botão "Continuar" quando finalizado <br/><br/></h3>

                <div className='Intro-configbox-textwrapper'>
                  <p> <span> <strong> ➖ Mostrar Estado da Bateria: </strong></span></p>

                  <div className={`Intro-configbox-slider ${ShowBattery ? 'active' : null }`} onClick={() => setShowBattery(!ShowBattery)}>
                    <div className={`Intro-configbox-slider-dot ${ShowBattery ? 'active' : null }`}></div>
                  </div>
                </div>

                <span><br/></span>

                <div className='Intro-configbox-textwrapper'>
                  <p> <span> <strong> ➖ Visualização de Usuário: </strong></span></p>
                  
                  <div className={`Intro-configbox-slider ${userConfig.isAdmin ? null : 'active' }`} 
                    onClick={() => {setuserConfig({...userConfig, isAdmin: !userConfig.isAdmin}); setLogData({msg: "Desativado temporariamente os privilégios de Pesquisador!", id: Date.now(), error: false});}}>
                    <div className={`Intro-configbox-slider-dot ${userConfig.isAdmin ? null : userConfig.isAdmin }`}></div>
                  </div>
                </div>

                <div className='Intro-login-button'
                 onClick={() => {
                   HandleLeave();
                 }}>
                 Continuar
                </div>
              </div>

              <div className="Intro-backbutton"
                  onClick={() => {
                    setIsReturning(true);  // Marca que estamos retornando
                    setuserConfig({Login: false, isAdmin: false, Intro: true});
                    setLogData({msg: "Retornado para a tela inicial", id: Date.now(), error: false});
                  }}>
                  <p>&laquo;</p>
              </div>
            </>
          ) : ( /* Usuário Comum: Tela Auxiliar */
            <> 
              <div className="Intro-configbox">
                <div className='Intro-configbox-headerbar'>
                  <h2>Bem vindo/a, {User.name}!</h2>
                </div>

                <div className='Intro-second-image'></div>
              
                <h3>{isConnected ? 'Robô conectado! Pressione o botão "continuar" para prosseguir' : 'Primeiramente, conecte-se ao robô antes de continuarmos'} <br/> <br/></h3>

                <div className='Intro-configbox-textwrapper'>
                  <p> <span> <strong> ➖ Conexão com o Robô: </strong> {isConnected === true ? <span style={{ color: 'rgba(48, 233, 150, 0.96)' }}>Online</span> : <span style={{ color: 'rgba(162, 90, 90, 0.96)' }}>Offline</span>} </span></p>
                </div>

                <span><br/></span>

                <div className='Intro-configbox-textwrapper'>
                  <p> <span> <strong> ➖ Estado da Bateria: </strong> {isConnected === true ? Battery.status : 'Conecte ao Robô!'} </span></p>
                </div>


                {isConnected === true ?
                <> 
                  <div className='Intro-login-button'
                    onClick={() => {
                      HandleLeave();
                    }}>
                    Continuar
                  </div>
                </>
                : 
                  <div className='Intro-login-button'
                    onClick={() => {
                      ros.connect()
                    }}> 
                    Conectar-se ao Robô 
                  </div>
                }
              </div>

              <div className="Intro-backbutton"
                onClick={() => {
                  setIsReturning(true);  // Marca que estamos retornando
                  setuserConfig({Login: false, isAdmin: false, Intro: true});
                  setLogData({msg: "Retornado para a seleção de modos", id: Date.now(), error: false});
                }}>
                <p>&laquo;</p>
              </div>
            </>
          )}
          </>
        )}

      </main>
    </div>
  )
}

export default Intro