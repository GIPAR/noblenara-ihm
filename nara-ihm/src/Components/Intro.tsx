import { useState, useEffect, useRef, useCallback } from 'react'
import { BatteryView } from './Battery';
import { MessageLog } from './MessageLog';
import './Intro.css'

import { useStore } from 'zustand'
import { GlobalStore, ROStore } from '../contexts/Store'
import { useSetAtom } from 'jotai';
import { LogAtom } from '../contexts/Molecule'

export const Intro = () => {
  const User = useStore(GlobalStore, (s) => s.User)           //Variáveis Globais
  const setUser = useStore(GlobalStore, (s) => s.setUser)
  const userConfig = useStore(GlobalStore, (s) => s.userConfig)
  const setuserConfig = useStore(GlobalStore, (s) => s.setuserConfig)
  const ros = useStore(ROStore, (s) => s.ros)
  const isConnected = useStore(ROStore, (s) => s.isConnected)
  const Battery = useStore(ROStore, (s) => s.batteryData)
  const setLogData = useSetAtom(LogAtom)

  const [isReturning, setIsReturning] = useState(false);      // Flag para detectar retorno
  const [LeaveIntro, setLeaveIntro] = useState(false);        // Flag para detectar saída
  const loginRef = useRef<HTMLDivElement>(null);              // Referência para a div principal
  const introsleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  const [auxType, setauxType] = useState<boolean | null>(null);

  useEffect(() => {  // Efeito para apressar a animação no retorno
    if (!userConfig.Login && isReturning && loginRef.current) {
      loginRef.current.style.setProperty('--anim-duration', '1.5s');
      loginRef.current.style.setProperty('--anim-delay', '0.3s');
      setIsReturning(false);
    }
  }, [userConfig.Login, isReturning]);

  const HandleLogin = useCallback(() => {
    if(User.name == 'gipar' && User.password == 'usergipar'){
      setuserConfig({Login: true, Type: 0, Environment: 0});
      setIsReturning(false);  // Reseta para carregamento inicial
      setLogData({msg: "Login realizado com sucesso!", id: Date.now(), error: false});
    }
    else if(User.name == 'nara' && User.password == 'usergipar'){
      setuserConfig({Login: true, Type: false, Environment: 0}); // Ambiente é realmente settado no "HandleLeave", não aqui
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

  const HandleLeave = async (whichEnv: number) => {
    setLeaveIntro(true);
    await introsleep(3600);
    setuserConfig({...userConfig, Environment: whichEnv});
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

        {userConfig.Login !== true ? ( /* Tela de Login | 1/3 (Desenvolvedor) | 1/2 (Usuário) */

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
          {userConfig.Type === 0 ? ( /* Desenvolvedores: Seleção de Modo 2/3 */
            <>
              <div className="Intro-configbox">
                <h2>Bem vindo, {User.name}!</h2>
                <div className='Intro-second-image'></div>
                
                <div className='Intro-configbox-partial'>
                  <p> Selecione qual é o tipo de exibição desejado, sendo estes: <br/><br/> 
                    <span style={{ display: 'block', color: 'rgba(82, 119, 119, 0.86)', fontSize: '0.8rem', textAlign: 'justify'}}>
                      <strong> ➖ Usuário:</strong> Utilização comum do aplicativo com funcionalidades de controle <br/><br/> 
                      <strong> ➖ Desenvolvedor:</strong> Permite o uso de ferramentas e exibições avançadas <br/> 
                    </span>
                  </p>
                </div>

                <div className='Intro-configbox-partial'>
                  <div className='Intro-select-box'>
                    <div className={`Intro-select ${auxType === false ? 'checked' : ''}`}
                      onClick={() => {if(auxType !== false){setauxType(false)} else{setauxType(null)}} } >
                      { auxType === false ? <div className='Intro-select-image'></div> : null }
                    </div>
                    <h3>Usuário</h3>
                  </div>

                  <div className='Intro-select-box'>
                    <div className={`Intro-select ${auxType === true ? 'checked' : ''}`}
                      onClick={() =>{if(auxType !== true){setauxType(true)} else{setauxType(null)}}}>
                      { auxType === true ? <div className='Intro-select-image'></div> : null }
                    </div>
                    <h3>Desenvolvedor</h3>
                  </div>
                </div>

                <div className='Intro-login-button relocate'
                  onClick={() => {
                    if(auxType !== null){
                      setLogData({msg: `Modo ${auxType === false ? 'Usuário' : 'Desenvolvedor'} selecionado!`, id: Date.now(), error: false});
                      setuserConfig({Login: true, Type: auxType, Environment: 0});
                      setauxType(null);}
                    else{ setLogData({msg: `Selecione o tipo de exibição!`, id: Date.now(), error: true}) }
                  }}>
                  <p>Continuar</p>
                </div>
              </div>

              <div className="Intro-backbutton"
                onClick={() => {
                  setIsReturning(true);  // Marca que estamos retornando
                  setuserConfig({Login: false, Type: 0, Environment: 0});
                  setLogData({msg: "Retornado para a tela inicial", id: Date.now(), error: false});
                }}>
                <p>&laquo;</p>
              </div>
            </>
          ) : (
            <> 
            {userConfig.Type === true ? ( /* Desenvolvedores: Seleção de Ambiente 3/3 */
              <>
              <div className={`Intro-circle`}>
                <h3>Selecione o Ambiente</h3>
                
                <div className={`Intro-rectangle`}>
                  <div className='Intro-rectangle-partial left'
                  onClick={() => {
                    setLogData({msg: "Ambiente físico selecionado!", id: Date.now(), error: false});
                    HandleLeave(1);
                  }}>
                    <span style={{color: 'rgb(72, 201, 176)'}}><h4> Físico </h4></span>
                  </div>

                  <div className='Intro-rectangle-partial right'
                  onClick={() => {
                    setLogData({msg: "Ambiente virtual selecionado!", id: Date.now(), error: false});
                    HandleLeave(2);
                  }}>
                    <span style={{color: 'rgb(132, 196, 240)'}}><h4> Virtual </h4></span>
                  </div>

                  <div className='Intro-lines left'>
                    <h5># Ambiente Real</h5>
                    <p>Interface para o robô e seus sensores físicos</p>
                  </div>

                  <div className='Intro-lines right'>
                    <h5># Ambiente Simulado</h5>
                    <p>Interface para a simulação do robô no Gazebo</p>
                  </div>
                </div>
              </div>

              <div className="Intro-backbutton"
              onClick={() => {
                setIsReturning(true);  // Marca que estamos retornando
                setuserConfig({Login: true, Type: 0, Environment: 0});
                setLogData({msg: "Retornado para a seleção de modos", id: Date.now(), error: false});
              }}>
                <p>&laquo;</p>
              </div>
              </>
            ) : ( /* Usuário Comum: Tela Auxiliar 2/2 */
              <>
                <div className="Intro-configbox">
                  <h2>Bem vindo/a, {User.name}!</h2>
                  <div className='Intro-second-image'></div>
                
                  <div className='Intro-configbox-partial'>
                    <p> {isConnected ? 'Robô conectado! Pressione o botão "continuar" para prosseguir' : 'Primeiramente, conecte-se ao robô antes de continuarmos'} <br/><br/> 
                      <span style={{ display: 'block', color: 'rgba(90, 162, 162, 0.96)', fontSize: '1rem', textAlign: 'justify'}}>
                        <strong> ➖ Conexão com o Robô: </strong> {isConnected === true ? <span style={{ color: 'rgba(48, 233, 150, 0.96)' }}>Online</span> : <span style={{ color: 'rgba(162, 90, 90, 0.96)' }}>Offline</span>} <br/><br/> 
                        <strong> ➖ Estado da Bateria: </strong> {isConnected === true ? Battery.status : 'Conecte ao Robô!'} <br/>
                      </span>
                    </p>
                  </div>

                  <div className='Intro-configbox-partial'>
                    {isConnected === true ?
                    <> 
                      <div className='Intro-login-button relocate'
                        onClick={() => {
                          HandleLeave(1);
                        }}>
                        Continuar
                      </div>
                    </>
                    : 
                      <div className='Intro-login-button relocate'
                        onClick={() => {
                          ros.connect()
                        }}> 
                        Conectar-se ao Robô 
                      </div>
                    }
                  </div>

                </div>

                <div className="Intro-backbutton"
                  onClick={() => {
                    setIsReturning(true);  // Marca que estamos retornando
                    setuserConfig({Login: false, Type: 0, Environment: 0});
                    setLogData({msg: "Retornado para a seleção de modos", id: Date.now(), error: false});
                  }}>
                  <p>&laquo;</p>
                </div>
              </>
            )}
            </>
          )}
          </>
        )}

      </main>
    </div>
  )
}

export default Intro