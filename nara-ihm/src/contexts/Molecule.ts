import { atom } from 'jotai'

// Átomos de Ativação;
export const MenuAtom = atom(false)

export const RosapiAtom = atom(false)

export const TeleopAtom = atom(false)

export const ShowMapAtom = atom(true)

export const ShowBatteryAtom = atom(true)

export const VoiceChatAtom = atom(false)

export const ShowAssistantAtom = atom(true)

// Átomos de Configurações;
export const DashboardAtom = atom({ main: 1, firstside: 2 })

export const ThemeAtom = atom('light')

export const BatteryAtom = atom(false) // Átomo para lógica da informação da bateria

// Átomos de Variáveis;
export const SpeedLimitAtom = atom({ linear: 1, angular: 1 })

//Átomos de Log Message : Use "useSetAtom" para apenas modificar o valor mas não causar renderização extra
export const LogAtom = atom( { msg: '', id: 0, error: false } ) 