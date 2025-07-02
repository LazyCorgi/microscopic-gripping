/// <reference types="vite/client" />
export {}

declare global {
  interface Window {
    electronAPI: {
      sendTimeToTcp: () => void
      startTcpReceiver: (callback: (text: string) => void) => void
    }
  }
}
