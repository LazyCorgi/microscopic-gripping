// tcpClient.ts
import net from 'net'
import { BrowserWindow } from 'electron'

export interface TCPClientOptions {
  host: string
  port: number
  reconnectInterval?: number
  channel: string // IPC 通道名，用于区分不同模块
}

export class TCPClient {
  private socket: net.Socket | null = null
  private reconnectTimer: NodeJS.Timeout | null = null
  private buffer = ''

  constructor(private options: TCPClientOptions) {}

  start(): void {
    this.connect()
  }

  private connect(): void {
    if (this.socket && !this.socket.destroyed) {
      this.socket.destroy()
    }
    console.log(`[TCP-${this.options.channel}] 连接 ${this.options.host}:${this.options.port}...`)

    this.socket = net.createConnection({ host: this.options.host, port: this.options.port }, () => {
      console.log(`[TCP-${this.options.channel}] 已连接`)
    })

    this.setupEvents(this.socket)
  }

  private setupEvents(sock: net.Socket): void {
    sock.on('data', (data) => {
      this.buffer += data.toString()
      const parts = this.buffer.split('\n')
      this.buffer = parts.pop() || ''

      for (const msg of parts) {
        console.log(`[TCP-${this.options.channel}] 收到:`, msg)
        const win = BrowserWindow.getAllWindows()[0]
        win?.webContents.send(this.options.channel, msg)
      }
    })

    sock.on('error', (err) => {
      console.error(`[TCP-${this.options.channel}] 错误`, err)
    })

    sock.on('close', () => {
      console.warn(`[TCP-${this.options.channel}] 连接关闭，准备重连`)
      this.scheduleReconnect()
    })
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) return
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null
      this.connect()
    }, this.options.reconnectInterval ?? 1000)
  }

  send(msg: string): void {
    if (this.socket && !this.socket.destroyed) {
      this.socket.write(msg + '\n')
    } else {
      console.warn(`[TCP-${this.options.channel}] 发送失败：未连接`)
    }
  }
}
