import { useEffect } from 'react';
import { useStore } from 'zustand';
import { useAtom } from 'jotai'
import { ROStore } from '../../contexts/Store';
import { RobotAtom } from '../../contexts/Molecule';
import './Battery.css'

type BatteryMessage = {
    voltage: number;
    percentage: number;
    power_supply_status: number;
    power_supply_health: number;
}

export const BatteryView = () => {
    const isConnected = useStore(ROStore, (s) => s.isConnected)
    const ros = useStore(ROStore, (s) => s.ros)
    const Message = useStore(ROStore, (s) => s.batteryData)
    const setMessage = useStore(ROStore, (s) => s.setbatteryData)
    const [RobotState] = useAtom(RobotAtom)

    // UseEffect para lógica da Bateria para a NARA
    useEffect(() => {
        if(!isConnected || RobotState.robot !== 0) return;

        const HandleStatus = () => {
            if(Message.voltage > 25){
                setMessage({ ...Message, status: 'Carregado' })
            }
            else if(Message.voltage > 24.20){
                setMessage({ ...Message, status: 'Bom' })
            }
            else if(Message.voltage > 23.50){
                setMessage({ ...Message, status: 'Fraco' })
            }
            else if(Message.voltage > 22.80 || Message.voltage > 20){
                setMessage({ ...Message, status: 'Carregue Imediatamente!' })
            }
            else{
                setMessage({ ...Message, status: 'Desconhecido' })
            }
        }

        const Battery_sub = ros.subscribe(
            '/noblenara/battery_status',
            'sensor_msgs/msg/BatteryState',
            (message) => { 
                const battery = message as BatteryMessage
                console.log('Setting voltage to:', battery.voltage);
                setMessage({ ...Message, voltage: battery.voltage });
                HandleStatus() }
        );
        return() => {
            Battery_sub.unsubscribe();
        };
        }, [isConnected, ros, Message, setMessage, RobotState.robot]);

    return (
        <div className='Battery'>
            {isConnected === true ? 
            <>
                {Message.status === 'Carregado' || Message.status === 'Bom' ? <span style={{color: 'rgb(59, 197, 68)'}}><h3>Bateria:  {Message.status} </h3></span> : null}
                {Message.status === 'Fraco' ? <span style={{color: 'rgb(171, 213, 2)'}}><h3>Bateria:  {Message.status} </h3></span> : null}
                {Message.status === 'Carregue Imediatamente!' ? <span style={{color: 'rgb(213, 55, 2)'}}><h3>Bateria:  {Message.status} </h3></span> : null}
                {Message.status === 'Desconhecido' ? <span style={{color: 'rgb(85, 165, 162)'}}><h3>Bateria:  {Message.status} </h3></span> : null}
            </>
            : 
                <span style={{color: 'rgb(85, 165, 162)'}}><h3> Robô: Desconectado </h3></span>
            }
        </div>
    );
}