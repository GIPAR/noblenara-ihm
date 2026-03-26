import { useEffect, useState, useRef } from 'react'
import { useStore } from 'zustand'
import { ROStore } from '../contexts/Store';
import { useAtom, useSetAtom } from 'jotai';
import { LogAtom, SpeedAtom, TeleopAtom } from '../contexts/Molecule';
import '../Components/Keyboard.css';

export const KeyboardControl = () => {
    const [linear, setlinear] = useState(0);
    const [angular, setangular] = useState(0);
    const keysRef = useRef<Set<string>>(new Set()); // useRef = No Re-renders

    const ros = useStore(ROStore, (s) => s.ros)
    const isConnected = useStore(ROStore, (s) => s.isConnected)
    const [MaxSpeed] = useAtom(SpeedAtom)
    const setLogData = useSetAtom(LogAtom)
    const setStartTeleop = useSetAtom(TeleopAtom)

    useEffect(() => {
    if(isConnected == false){
      setLogData({msg: "Não há conexão com o ROS!", id: Date.now(), error: true});
      setStartTeleop(false);
      return;
    }

    const HandleKeyDown = (e: KeyboardEvent) => keysRef.current.add(e.key.toLowerCase());
    const HandleKeyUp = (e: KeyboardEvent) => keysRef.current.delete(e.key.toLowerCase());

    window.addEventListener('keydown', HandleKeyDown);
    window.addEventListener('keyup', HandleKeyUp);

    const PeriodicPublisher = setInterval(() => {
      let linear = 0;
      let angular = 0;
      const keys = keysRef.current; // Read from Ref

      if(!keys.has(' ')){
        if(keys.has('w')){linear = MaxSpeed.linear}
        if(keys.has('a')){angular = MaxSpeed.angular}
        if(keys.has('s')){linear = -MaxSpeed.linear}
        if(keys.has('d')){angular = -MaxSpeed.angular}
      } 

      ros.publishVelocity(linear, angular);

      setlinear(prev => (prev !== linear ? linear : prev));
      setangular(prev => (prev !== angular ? angular : prev));
    }, 100);

    return () => {
      window.removeEventListener('keydown', HandleKeyDown);
      window.removeEventListener('keyup', HandleKeyUp);
      clearInterval(PeriodicPublisher);
    };

    },[isConnected, setLogData, MaxSpeed, ros, setStartTeleop]);

    return (
      <div className='Keyboard'>
        <div className='Control'>
          <div className='Control-info'> L: {linear} | A: {angular} </div>
          <div className='Control-tutorial'> Use 'w, a, s, d' para mover </div>
          <div className='Control-tutorial'> Pressione 'Espaço' para parar </div>
        </div>

        <div className='Keyboard-main'>
          <div className='Keyboard-main-key W'>W</div>
          <div className='Keyboard-main-key A'>A</div>
          <div className='Keyboard-main-key S'>S</div>
          <div className='Keyboard-main-key D'>D</div>
        </div>
      </div>
    )
}