import { atom } from 'jotai'

// Átomos de Ativação
export const MenuAtom = atom(false)

export const TeleopAtom = atom(false)

// Átomos de Configurações; Possivelmente fazer um do isAdmin como está no Intro.tsx
export const LocationAtom = atom({ link: '', user: '' })

// Átomos de Variáveis
export const SpeedAtom = atom({ linear: 0, angular: 0 })

//Átomos de Log Message : Use "useSetAtom" para apenas modificar o valor mas não causar renderização extra
export const LogAtom = atom( { msg: '', id: 0, error: false } )