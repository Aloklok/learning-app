// 文件：electron.dev.ts
import { app } from 'electron';
import './electron/main'; // 导入你的主应用逻辑

// 确保在开发模式下能正确退出
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});