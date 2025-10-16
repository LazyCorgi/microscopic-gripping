import { ipcMain, dialog } from 'electron'
import store from '../store/Storage'

export const handleStart = (): void => {
  ipcMain.handle('select-model', async () => {
    const { filePaths, canceled } = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'AI 模型', extensions: ['onnx', 'pt', 'bin', 'engine'] }]
    })

    return canceled ? null : filePaths[0]
  })
  // 读取配置
  ipcMain.handle('config:get', (_, key) => {
    return store.get(key)
  })

  // 写入配置
  ipcMain.handle('config:set', (_, key, value) => {
    store.set(key, value)
  })
}
