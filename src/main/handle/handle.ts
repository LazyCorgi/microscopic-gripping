import { ipcMain, dialog } from 'electron'

export const handleStart = (): void => {
  ipcMain.handle('select-model', async () => {
    const { filePaths, canceled } = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'AI 模型', extensions: ['onnx', 'pt', 'bin', 'engine'] }]
    })

    return canceled ? null : filePaths[0]
  })
}
