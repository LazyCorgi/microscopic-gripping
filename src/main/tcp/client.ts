// client.ts
import net from 'net'
import { BrowserWindow, ipcMain } from 'electron'

let socket: net.Socket | null = null
let reconnectTimer: NodeJS.Timeout | null = null

const HOST = '127.0.0.1'
const PORT = 2333
const RECONNECT_INTERVAL_MS = 1000

function setupSocketEvents(sock: net.Socket): void {
  let buffer = ''
  sock.on('data', (data) => {
    buffer += data.toString()
    const parts = buffer.split('\n')
    buffer = parts.pop() || ''

    for (const msg of parts) {
      console.log('[TCP 收到]', msg)
      const win = BrowserWindow.getAllWindows()[0]
      win?.webContents.send('tcp-data', msg)
    }
  })

  sock.on('error', (err) => {
    console.error('[TCP 错误]', err)
  })

  sock.on('close', () => {
    console.warn('[TCP 连接关闭，准备重连]')
    scheduleReconnect()
  })
}

function connect(): void {
  if (socket && !socket.destroyed) {
    socket.destroy()
  }
  console.log(`[TCP] 尝试连接 ${HOST}:${PORT}...`)
  socket = net.createConnection({ host: HOST, port: PORT }, () => {
    console.log('[TCP] 已连接服务端')
  })
  setupSocketEvents(socket)
}

function scheduleReconnect(): void {
  if (reconnectTimer) return
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null
    connect()
  }, RECONNECT_INTERVAL_MS)
}

// 初始连接
export function startTCPClient(): void {
  connect()
}

// 前端请求发送消息
ipcMain.on('send-to-server', (_, msg: string) => {
  if (socket && !socket.destroyed) {
    socket.write(msg + '\n')
  } else {
    console.warn('[TCP] 发送失败：未连接')
  }
})
