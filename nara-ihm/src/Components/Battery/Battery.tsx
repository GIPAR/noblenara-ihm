import { useEffect, useState } from 'react';
import { useStore } from 'zustand';
import { ROStore } from '../../contexts/Store';
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
    const [Message, setMessage] = useState({voltage: 0})

    useEffect(() => {
        if(!isConnected) return;

        const Battery_sub = ros.subscribe(
            '/noblenara/battery_status',
            'sensor_msgs/msg/BatteryState',
            (message) => { 
                const battery = message as BatteryMessage
                console.log('Setting voltage to:', battery.voltage);
                setMessage({voltage: battery.voltage}) }
        );
        return() => {
            Battery_sub.unsubscribe();
        };
        }, [isConnected, ros, Message, setMessage]);

    return (
        <div className='Battery'>
            {isConnected === true ? 
            <h3>Bateria: {Message.voltage}V</h3>
            : 
            <span style={{color: 'rgb(66, 87, 70)'}}><h3> Bridge: Offline </h3></span>}
        </div>
    );
}