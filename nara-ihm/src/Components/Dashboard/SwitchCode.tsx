import { KeyboardControl } from '../../services/KeyboardService'
import { useAtom } from 'jotai'
import { TeleopAtom, LocationAtom } from '../../contexts/Molecule'


export const SwitchCode = ({which}: {which: number}) => {
    const [StartTeleop] = useAtom(TeleopAtom)
    const [CameraURL] = useAtom(LocationAtom)

    return (
        <>
        {which === 1 ? (
            <>
                <img src={CameraURL.link}/> 
                {StartTeleop ? <KeyboardControl/> : null}
            </>
        ) : (null) }

        {which === 2 ? (
            <>
                <img src={CameraURL.user}/>
            </>
        ) : (null) }
        </>
        );
    }