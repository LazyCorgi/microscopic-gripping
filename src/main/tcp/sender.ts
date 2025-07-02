import net from 'net'

export function sendCurrentTimeToPort2333(): void {
  const socket = new net.Socket()

  socket.connect(2333, '127.0.0.1', () => {
    const msg = `From Electron: ${new Date().toISOString()}\n`
    console.log('发送内容到 2333:', msg)
    socket.write(msg)
    socket.end()
  })

  socket.on('error', (err) => {
    console.error('发送失败:', err.message)
  })
}
