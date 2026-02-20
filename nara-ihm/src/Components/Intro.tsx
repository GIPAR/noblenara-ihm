import { useState, useEffect, useRef, useCallback } from 'react'
import { MessageLog } from './MessageLog';
import './Intro.css'

import { useStore } from 'zustand'
import { GlobalStore } from '../contexts/Store'
import { useAtom, useSetAtom } from 'jotai';
import { isAdminAtom, LogAtom } from '../contexts/Molecule'

export const Intro = () => {
  const [isReturning, setIsReturning] = useState(false);      // Flag para detectar retorno
  const [LeaveIntro, setLeaveIntro] = useState(false);        // Flag para detectar saída
  const loginRef = useRef<HTMLDivElement>(null);              // Referência para a div principal
  const introsleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const User = useStore(GlobalStore, (s) => s.User)           //Globais
  const setUser = useStore(GlobalStore, (s) => s.setUser)
  const userConfig = useStore(GlobalStore, (s) => s.userConfig)
  const setuserConfig = useStore(GlobalStore, (s) => s.setuserConfig)
  const [isAdmin, setisAdmin] = useAtom(isAdminAtom)
  const setLogData = useSetAtom(LogAtom)

  useEffect(() => {  // Efeito para apressar a animação no retorno
    if (!userConfig.Login && isReturning && loginRef.current) {
      loginRef.current.style.setProperty('--anim-duration', '1.5s');
      loginRef.current.style.setProperty('--anim-delay', '0.3s');
      setIsReturning(false);
    }
  }, [userConfig.Login, isReturning]);

  const HandleLogin = useCallback(() => {
    if(User.name == 'gipar' && User.password == 'usergipar'){
      setuserConfig({Login: true, Type: false, Environment: 0});
      setIsReturning(false);  // Reseta para carregamento inicial
      setLogData({msg: "Login realizado com sucesso!", id: Date.now(), error: false});
    }
    else{
      setLogData({msg: "Usuário ou senha inválida", id: Date.now(), error: true});
      setuserConfig({Login: false, Type: false, Environment: 0});
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
    setuserConfig({Login: true, Type: true, Environment: whichEnv});
  }

  return (
    <div className={`Intro ${LeaveIntro ? 'disappear' : 'start'}`}>
      <main>
        <div className="Intro-title">
          <h1>GIPAR</h1>
        </div>

        <MessageLog/>

        {userConfig.Login !== true ? ( /* Tela de Login 1/3 */

          <div className="Intro-login" ref={loginRef}>
            <div className='Intro-login-headerbar'>
              <p>Faça seu Login</p>
            </div>

            <div className='Intro-image'></div>

            <label htmlFor="username">Usuário:</label>
            <input 
              type="text" 
              placeholder="Digite o seu nome de usuário" 
              value={User.name}
              onChange={(e) => setUser({...User, name: e.target.value})}
              className="Intro-login-bar"
            />

            <label htmlFor="password">Senha:</label>
            <input 
              type="password" 
              placeholder="Digite sua senha" 
              value={User.password}
              onChange={(e) => setUser({...User, password: e.target.value})}
              className="Intro-login-bar"
            />

            <div className='Intro-login-button'
              onClick={() => {HandleLogin()}}>
              <p>Entrar</p>
            </div>
          </div>
        ) : (
          <>
          {userConfig.Type !== true ? ( /* Seleção de Modo 2/3 */
            <>
              <div className="Intro-configbox">
                <h2>Bem vindo, {User.name}!</h2>
                <div className='Intro-second-image'></div>
                
                <div className='Intro-configbox-partial'>
                  <p> Selecione qual é o tipo de exibição desejado, sendo estes: <br/><br/> 
                    <span style={{ display: 'block', color: 'rgba(82, 119, 119, 0.86)', fontSize: '0.8rem', textAlign: 'justify'}}>
                      <strong> ➖ Usuário:</strong> Utilização comum do aplicativo com funcionalidades de controle <br/><br/> 
                      <strong> ➖ Desenvolvedor:</strong> Permite o uso de ferramentas e exibições avançadas (Pending) <br/> 
                    </span>
                  </p>
                </div>

                <div className='Intro-configbox-partial'>
                  <div className='Intro-select-box'>
                    <div className={`Intro-select ${isAdmin === false ? 'checked' : ''}`}
                      onClick={() => {if(isAdmin !== false){setisAdmin(false)} else{setisAdmin(null)}} } >
                      { isAdmin === false ? <div className='Intro-select-image'></div> : null }
                    </div>
                    <h3>Usuário</h3>
                  </div>

                  <div className='Intro-select-box'>
                    <div className={`Intro-select ${isAdmin === true ? 'checked' : ''}`}
                      onClick={() =>{if(isAdmin !== true){setisAdmin(true)} else{setisAdmin(null)}}}>
                      { isAdmin === true ? <div className='Intro-select-image'></div> : null }
                    </div>
                    <h3>Desenvolvedor</h3>
                  </div>
                </div>

                <div className='Intro-login-button relocate'
                  onClick={() => {
                    if(isAdmin !== null){
                      setLogData({msg: `Modo ${isAdmin === false ? 'Usuário' : 'Desenvolvedor'} selecionado!`, id: Date.now(), error: false});
                      setuserConfig({Login: true, Type: true, Environment: 0});
                      setisAdmin(null);}
                    else{ setLogData({msg: `Selecione o tipo de exibição!`, id: Date.now(), error: true}) }
                  }}>
                  <p>Continuar</p>
                </div>
              </div>

              <div className="Intro-backbutton"
                onClick={() => {
                  setIsReturning(true);  // Marca que estamos retornando
                  setuserConfig({Login: false, Type: false, Environment: 0});
                  setLogData({msg: "Retornado para a tela inicial", id: Date.now(), error: false});
                }}>
                <p>&laquo;</p>
              </div>
            </>
          ) : ( /* Seleção de Ambiente 3/3 ---> No futuro retire a seleção para usuário comum, por enquanto necessário para desenvolvimento */
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
                  setuserConfig({Login: true, Type: false, Environment: 0});
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