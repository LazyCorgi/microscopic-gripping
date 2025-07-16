type CommandParams = { [key: string]: string | number | string[] | number[] | boolean | null }

type Command = {
  index: number
  command: string
  parameters: CommandParams
}

const sendMessage = (msg: Command): void => {
  if (window.electron?.ipcRenderer?.send) {
    window.electron.ipcRenderer.send('send-to-server', JSON.stringify(msg))
  } else {
    console.warn('IPC send failed: window.electron.ipcRenderer not available.')
  }
}

// 指令封装
export const Commands = {
  clearFault: (): Command => ({ index: 0, command: 'clear_fault', parameters: {} }),
  readTxPDO: (index: number): Command => ({ index, command: 'read_txpdo', parameters: {} }),
  shutdown: (): Command => ({ index: 0, command: 'shutdown', parameters: {} }),
  changeMode: (mode: 'to_home' | 'to_csp'): Command => ({
    index: 0,
    command: 'change_mode',
    parameters: { mode }
  }),
  home: (action: 'start' | 'stop'): Command => ({
    index: 0,
    command: 'home',
    parameters: { action }
  }),
  cspMove: (destination: [number, number, number], action: 'start' | 'stop'): Command => ({
    index: 0,
    command: 'csp',
    parameters: { destination, action }
  }),

  // 泵控制器
  setPressure: (channel: 1 | 2 | 3 | 4, pressure: number): Command => ({
    index: 4,
    command: 'set_pressure',
    parameters: { channel, pressure }
  }),
  readPressure: (): Command => ({ index: 4, command: 'read_pressure', parameters: {} })
}

export { sendMessage }
