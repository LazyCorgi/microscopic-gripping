type Message = {
  command: string
  x: number
  y: number
}

const camMessage = (msg: Message): void => {
  if (window.electron?.ipcRenderer?.send) {
    window.electron.ipcRenderer.send('send-to-cam', JSON.stringify(msg))
  } else {
    console.warn('IPC/cam send failed: window.electron.ipcRenderer not available.')
  }
}

export const Msg = {
  cammove: (dx: number, dy: number): Message => ({ command: 'move', x: dx, y: dy }),
  camhome: (): Message => ({ command: 'home', x: 0, y: 0 })
}

export { camMessage }
