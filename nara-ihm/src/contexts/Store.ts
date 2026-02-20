import { create } from 'zustand'
import { ROS2Service } from '../services/ROS2Service'

const defaultuserConfig = { Login: false, Type: false, Environment: 0 }
const nullUser = { name: '', password: '' }

// Loja 1/2 => Loja Geral
interface GlobalState {
  User: typeof nullUser
  setUser: (newuser: typeof nullUser) => void

  userConfig: typeof defaultuserConfig
  setuserConfig: (newconfig: typeof defaultuserConfig ) => void
  logout: () => void
}

export const GlobalStore = create<GlobalState>()((set) => ({
  User: nullUser,
  setUser: ( newuser: typeof nullUser ) => set({ User: newuser }),

  userConfig: defaultuserConfig,
  setuserConfig: ( newconfig ) => set({ userConfig: newconfig }),
  logout: () => set({ userConfig: defaultuserConfig, User: nullUser }),
}))

//Ideia: usar User and SetUser para serem as variÁveis na hora de se "registrar", enquanto que Intro usa variÁvel local
//Mas: Considerar o uso de outro método para backend instead

// Loja 2/2 => Loja ROS
interface ROSProps {
  isConnected: boolean
  setisConnected: ( newState: boolean ) => void

  ros: ROS2Service
  rosapiData: Record<string, string | string[] | number | boolean>,
  setrosapiData: ( newState: Record<string, string | string[] | number | boolean>, ) => void
}

export const ROStore = create<ROSProps>()((set) => ({
  isConnected: false,
  setisConnected: ( newState: boolean ) => set({ isConnected: newState }),

  ros: new ROS2Service(),
  rosapiData: {} as Record<string, string | string[] | number | boolean>,
  setrosapiData: (newState: Record<string, string | string[] | number | boolean>) => set({ rosapiData: newState }),
}))