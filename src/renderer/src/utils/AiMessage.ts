type CommandParams = { [key: string]: string | number | string[] | number[] | boolean | null }

type Message = {
  content: string
  parameters?: CommandParams
}

const aiMessage = (msg: Message): void => {
  if (window.electron?.ipcRenderer?.send) {
    window.electron.ipcRenderer.send('send-to-ai', JSON.stringify(msg))
  } else {
    console.warn('IPC/ai send failed: window.electron.ipcRenderer not available.')
  }
}

export const Msg = {
  set: (action: 'start' | 'stop'): Message => ({ content: action }),
  loadModel: (modelPath: string): Message => ({ content: 'model', parameters: { modelPath } })
}

export { aiMessage }
