import { ref } from 'vue'
type Message = {
  command: string
  x: number
  y: number
  z: number
}

export const currentX = ref<number>(0)
export const currentY = ref<number>(0)

const camMessage = (msg: Message): void => {
  if (window.electron?.ipcRenderer?.send) {
    window.electron.ipcRenderer.send('send-to-cam', JSON.stringify(msg))
  } else {
    console.warn('IPC/cam send failed: window.electron.ipcRenderer not available.')
  }
}

export const Msg = {
  cammove: (dx: number, dy: number): Message => {
    currentX.value = dx
    currentY.value = dy
    return { command: 'move', x: dx, y: dy, z: 0 }
  },
  camfocus: (focal: number): Message => ({ command: 'focus', x: 0, y: 0, z: focal }),
  camhome: (): Message => ({ command: 'home', x: 0, y: 0, z: 0 })
}

export { camMessage }
