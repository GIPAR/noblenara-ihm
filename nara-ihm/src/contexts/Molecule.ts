import { atom } from 'jotai'

// Átomos de Ativação;
export const MenuAtom = atom(false)

export const RosapiAtom = atom(false)

export const TeleopAtom = atom(false)

// Átomos de Configurações;
export const isAdminAtom = atom<boolean | null>(null)

export const LocationAtom = atom({ link: '', user: '' })

// Átomos de Variáveis;
export const SpeedAtom = atom({ linear: 0, angular: 0 })

//Átomos de Log Message : Use "useSetAtom" para apenas modificar o valor mas não causar renderização extra
export const LogAtom = atom( { msg: '', id: 0, error: false } )