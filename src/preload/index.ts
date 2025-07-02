import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  sendTimeToTcp: () => ipcRenderer.send('send-time'),
  startTcpReceiver: (callback: (text: string) => void) => {
    ipcRenderer.on('tcp-data', (_event, data) => {
      callback(data)
    })
  }
})
