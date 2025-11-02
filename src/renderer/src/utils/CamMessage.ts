type Message = {
  command: string
  x: number
  y: number
  z: number
}

const camMessage = (msg: Message): void => {
  if (window.electron?.ipcRenderer?.send) {
    window.electron.ipcRenderer.send('send-to-cam', JSON.stringify(msg))
  } else {
    console.warn('IPC/cam send failed: window.electron.ipcRenderer not available.')
  }
}

export const Msg = {
  cammove: (dx: number, dy: number): Message => ({
    command: 'move',
    x: dx,
    y: dy,
    z: 0
  }),
  camfocus: (focal: number): Message => ({ command: 'focus', x: 0, y: 0, z: focal }),
  camhome: (): Message => ({ command: 'home', x: 0, y: 0, z: 0 })
}

export { camMessage }
