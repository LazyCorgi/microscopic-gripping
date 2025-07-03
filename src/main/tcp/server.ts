import net from 'net'
import { BrowserWindow } from 'electron'

const clients: net.Socket[] = []

export function startTCPServer(): void {
  const server = net.createServer((socket) => {
    clients.push(socket)
    console.log('[TCP] 客户端连接成功')

    let buffer = ''
    socket.on('data', (data) => {
      buffer += data.toString()
      const parts = buffer.split('\n')
      buffer = parts.pop() || ''

      for (const msg of parts) {
        console.log('[TCP 收到]', msg)
        const win = BrowserWindow.getAllWindows()[0]
        win?.webContents.send('tcp-data', msg)
      }
    })

    socket.on('end', () => {
      const i = clients.indexOf(socket)
      if (i !== -1) clients.splice(i, 1)
    })

    socket.on('error', (err) => {
      console.error('[TCP 错误]', err)
    })
  })

  server.listen(2333, () => {
    console.log('[TCP] 监听 2333 成功')
  })
}

// 暴露 clients 数组供主进程调用
export function broadcast(msg: string): void {
  const payload = msg + '\n'
  for (const client of clients) {
    client.write(payload)
  }
}
