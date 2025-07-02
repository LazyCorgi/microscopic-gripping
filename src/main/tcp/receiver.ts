import net from 'net'
import { BrowserWindow } from 'electron'

export function startReceiverServer(): void {
  const server = net.createServer((socket) => {
    socket.on('data', (data) => {
      const message = data.toString()
      console.log('收到来自 2334 的消息:', message)

      // 向所有窗口广播
      BrowserWindow.getAllWindows().forEach((win) => {
        win.webContents.send('tcp-data', message)
      })

      socket.end()
    })
  })

  server.listen(2334, () => {
    console.log('TCP接收服务已启动，监听 2334 端口')
  })

  server.on('error', (err) => {
    console.error('TCP 接收服务出错:', err.message)
  })
}
