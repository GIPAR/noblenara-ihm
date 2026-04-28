import { useRef, useEffect } from 'react'
import './Map.css'
import { useStore } from 'zustand'
import { ROStore } from '../contexts/Store'

type MapMessage = {
    data: Int8Array;
    info: { width: number, height: number, resolution: number, origin: { position: { x: number, y: number, z: number } } };
}

// type TfMessage = {
//     transforms: {
//         header: { frame_id: string };
//         child_frame_id: string;
//         transform: { translation: { x: number, y: number, z: number }, rotation: { z: number, w: number } };
//     }[];
// }

export const Map = () => {
    const isConnected = useStore(ROStore, (s) => s.isConnected)
    const ros = useStore(ROStore, (s) => s.ros)

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const occupancyRef = useRef<Int8Array | null>(null);
    const infoRef = useRef<MapMessage['info'] | null>(null);

    // const robotRef = useRef({ translation: { x: 0, y: 0, z: 0 }, rotation: { z: 0, w: 0 } });
    // const navRef = useRef<HTMLDivElement>(null);

    const lastUpdated = useRef({ map: 0, tf: 0 });

    // const updateNavigator = () => {
    //     const info = infoRef.current;
    //     const nav = navRef.current;
    //     const canvas = canvasRef.current;
    //     if(!info || !nav || !canvas) return;

    //     let pixelsMove = { x: 0, y: 0};

    //     pixelsMove.x = info.width + (info.origin.position.x / info.resolution);
    //     pixelsMove.y = -(info.origin.position.y / info.resolution);

    //     nav.style.transform = `translate(calc(-50% + ${pixelsMove.x}px + ${canvas.offsetLeft}px), calc(-50% + ${pixelsMove.y}px)) rotate(-45deg)`;
    // }

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
                
                if(Date.now() > lastUpdated.current.map + 1500){
                    occupancyRef.current = Map.data;
                    infoRef.current = Map.info;

                    if(canvasRef.current){
                        canvasRef.current.width = infoRef.current.width;
                        canvasRef.current.height = infoRef.current.height;
                    }

                    Paint();
                    lastUpdated.current.map = Date.now();
                }
            }
        );

        // const Tf_sub = ros.subscribe(
        //     '/tf',
        //     'tf2_msgs/msg/TFMessage',
        //     (message) => { 
        //         const Tf = message as TfMessage

        //         for(let i = 0; i < Tf.transforms.length; i++) {
        //             Tf.transforms[i]

        //             if(Tf.transforms[i].child_frame_id === 'odom' && Tf.transforms[i].header.frame_id === 'map' && Date.now() > lastUpdated.current.tf + 1000){
        //                 console.log('Mensagem Recebida na segunda logic!');
        //                 robotRef.current = Tf.transforms[i].transform;
        //                 lastUpdated.current.tf = Date.now();

        //                 updateNavigator();
        //             }
        //         }

        //     }
        // );


        return() => {
            Map_sub.unsubscribe();
            // Tf_sub.unsubscribe();
        };
            }, [isConnected, ros]);


    return(
        <div className='Map'>
            <canvas className='Map-canvas' ref={canvasRef} width={ infoRef.current?.width } height={ infoRef.current?.height }> </canvas>

            {/* <div className='Map-navigator' ref={navRef}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><path d="M152,152,234.35,129a8,8,0,0,0,.27-15.21l-176-65.28A8,8,0,0,0,48.46,58.63l65.28,176a8,8,0,0,0,15.21-.27Z" opacity="0.1"/><path d="M152,152,234.35,129a8,8,0,0,0,.27-15.21l-176-65.28A8,8,0,0,0,48.46,58.63l65.28,176a8,8,0,0,0,15.21-.27Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/></svg>
            </div> */}
        </div>
        
    )
}