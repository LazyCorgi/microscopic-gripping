type CommandParams = { [key: string]: string | number | string[] | number[] | boolean | null }

type Message = {
  content: string
  parameters?: CommandParams
}

const camMessage = (msg: Message): void => {
  if (window.electron?.ipcRenderer?.send) {
    window.electron.ipcRenderer.send('send-to-cam', JSON.stringify(msg))
  } else {
    console.warn('IPC/cam send failed: window.electron.ipcRenderer not available.')
  }
}

export const Msg = {
  cammove: (destination: number[]): Message => ({ content: 'cammove', parameters: { destination } })
}

export { camMessage }
