import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    config: {
      get: (key: string) => Promise
      set: (key: string, value) => Promise<void>
    }
  }
}
