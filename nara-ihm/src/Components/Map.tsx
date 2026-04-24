import { useRef, useEffect } from 'react'
import './Map.css'
import { useStore } from 'zustand'
import { ROStore } from '../contexts/Store'

type MapMessage = {
    data: Int8Array;
    info: { width: number, height: number, resolution: number, origin: { position: { x: number, y: number, z: number } } };
}

export const Map = () => {
    const isConnected = useStore(ROStore, (s) => s.isConnected)
    const ros = useStore(ROStore, (s) => s.ros)

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const occupancyRef = useRef<Int8Array | null>(null);
    const infoRef = useRef<MapMessage['info'] | null>(null);
    const lastUpdated = useRef({ time: 0 });

    const Paint = () => {
        const data = occupancyRef.current;
        const info = infoRef.current;
        const canvas = canvasRef.current;
        if(!canvas || !info || !data) return;

        const ctx = canvas.getContext('2d');
        if(!ctx) return;

        const imageData = ctx.createImageData(info.width, info.height)

        for (let i = 0; i < data.length; i++){

            const color = data[i] === 100 ? 0 : data[i] === 0 ? 255 : 127

            imageData.data[4*i + 0] = color;
            imageData.data[4*i + 1] = color;
            imageData.data[4*i + 2] = color;
            imageData.data[4*i + 3] = 255;

        }

        ctx.putImageData(imageData, 0, 0)

    }

    useEffect(() => {
        if(!isConnected) return;

        const Map_sub = ros.subscribe(
            '/map',
            'nav_msgs/msg/OccupancyGrid',
            (message) => { 
                const Map = message as MapMessage
                
                if(Date.now() > lastUpdated.current.time + 1500){
                    occupancyRef.current = Map.data;
                    infoRef.current = Map.info;

                    if(canvasRef.current){
                        canvasRef.current.width = infoRef.current.width;
                        canvasRef.current.height = infoRef.current.height;
                    }

                    Paint();
                    lastUpdated.current.time = Date.now();
                }
            }
        );
        return() => {
            Map_sub.unsubscribe();
        };
            }, [isConnected, ros]);

    return(
        <div className='Map'>
            <canvas className='Map-canvas' ref={canvasRef} width={ infoRef.current?.width } height={ infoRef.current?.height }></canvas>
        </div>
        
    )
}