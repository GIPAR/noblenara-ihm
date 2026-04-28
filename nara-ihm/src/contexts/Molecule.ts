import { atom } from 'jotai'

// Átomos de Ativação;
export const MenuAtom = atom(false)

export const RosapiAtom = atom(false)

export const TeleopAtom = atom(false)

export const MapAtom = atom(true)

// Átomos de Configurações;
export const LocationAtom = atom({ link: '', user: '' })

export const RobotAtom = atom({ robot: 0, topic: '/noblenara/cmd_vel' })

export const DashboardAtom = atom({ main: 1, firstside: 2 })

export const ThemeAtom = atom('light')

// Átomos de Variáveis;
export const SpeedAtom = atom({ linear: 0, angular: 0 })

//Átomos de Log Message : Use "useSetAtom" para apenas modificar o valor mas não causar renderização extra
export const LogAtom = atom( { msg: '', id: 0, error: false } ) 