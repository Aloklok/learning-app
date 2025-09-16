import { app, BrowserWindow, ipcMain, dialog, Tray, Menu, globalShortcut, nativeImage, systemPreferences } from 'electron';
import path from 'path';
import fs from 'fs';
import Database from 'better-sqlite3';
import { exec } from 'node:child_process';
import { registerDatabaseIpcHandlers } from './ipc/database';


// --- 【关键修正】使用更健壮的方式加载原生插件 ---
let SpeechRecognizer: any;
try {
  const isDev = !app.isPackaged;
  
  // 开发路径：从项目根目录加载
  const devPath = path.join(app.getAppPath(), 'native-addons/speech-recognizer/build/Release/speech_recognizer.node');
  
  // 生产路径：从 Resources 目录加载 (由 extraResources 复制)
  const prodPath = path.join(process.resourcesPath, 'speech_recognizer.node');

  const addonPath = isDev ? devPath : prodPath;
  
  console.log(`[main.ts] 正在加载原生插件，路径: ${addonPath}`);
  const addon = require(addonPath);
  SpeechRecognizer = addon.SpeechRecognizer;

  if (!SpeechRecognizer) {
    throw new Error('从原生插件加载 SpeechRecognizer 失败。');
  }

  console.log('✅ 原生插件加载成功!');
} catch (error) {
  console.error('❌ 加载原生插件失败:', error);
  if (app.isPackaged) {
    dialog.showErrorBox('关键组件加载失败', `无法加载语音识别模块。\n错误: ${error.message}`);
  }
}


let recognizer = null;
// --- 新增结束 ---

// --- 全局设置 ---
process.env.DIST = path.join(__dirname, '../dist');
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? path.join(process.env.DIST, '../public')
  : process.env.DIST;

// --- 数据库初始化 (关键修改) ---
const userDataPath = app.getPath('userData');
const dbPath = path.join(userDataPath, 'database.db');
console.log('!!! 应用正在使用的数据库路径是:', dbPath);
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
console.log(`Database connection opened successfully at: ${dbPath}`);

// --- 数据库初始化函数 (关键修改) ---
function initializeDatabase() {
  const table = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = 'books'").get();
  if (table) {
    console.log('[main.ts] Database tables already exist. Skipping initialization.');
    return;
  }
  try {
    console.log('[main.ts] Database tables not found. Initializing schema from schema.sql...');
    
    // 修正 schema.sql 的路径
    const isDev = !app.isPackaged;
    const schemaPath = isDev
      ? path.join(app.getAppPath(), 'database/schema.sql')
      : path.join(process.resourcesPath, 'database/schema.sql');

    console.log('>>> [main.ts] 正在尝试读取SQL文件，路径是:', schemaPath);
    if (!fs.existsSync(schemaPath)) {
        throw new Error(`Schema file not found at ${schemaPath}`);
    }
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schemaSql);
    console.log('[main.ts] Database schema initialization complete!');
  } catch (error) {
    console.error("[main.ts] Failed to initialize database schema from file:", error);
    dialog.showErrorBox('数据库初始化失败', `无法创建数据库表，请检查 database/schema.sql 文件是否存在。\n错误: ${error.message}`);
    app.quit();
  }
}

initializeDatabase();
// --- 注册数据库 IPC 处理器 ---
registerDatabaseIpcHandlers(db);

app.on('will-quit', () => {
  if (db && db.open) {
    db.close();
    console.log('Database connection closed.');
  }
});

// --- 窗口管理 ---
let win: BrowserWindow | null;
let tray: Tray | null;
let isQuitting = false;
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: 'hiddenInset', // macOS 样式的标题栏
    trafficLightPosition: { x: 20, y: 20 }, // 调整红绿灯位置
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      allowRunningInsecureContent: true,
      experimentalFeatures: true
    },
    show: false, // 初始隐藏，等待ready-to-show事件
    backgroundColor: '#f4f7fe', // 设置背景色避免白屏闪烁
    vibrancy: 'under-window', // macOS 毛玻璃效果
  });

  win.once('ready-to-show', () => {
    win?.show();
  });

  win.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      win?.hide();
    }
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    const distPath = process.env.DIST;
    if (distPath) {
      win.loadFile(path.join(distPath, 'index.html'));
    } else {
      console.error('DIST environment variable is not set');
    }
  }
}

function createTray() {
  const iconPath = path.join(__dirname, '../public/icon.png');
  let trayIcon;
  
  if (!fs.existsSync(iconPath)) {
    trayIcon = nativeImage.createFromNamedImage('NSApplicationIcon');
  } else {
    trayIcon = nativeImage.createFromPath(iconPath);
  }
  
  if (!trayIcon || trayIcon.isEmpty()) {
    trayIcon = nativeImage.createFromNamedImage('NSApplicationIcon');
  }
  
  tray = new Tray(trayIcon.resize({ width: 16, height: 16 }));
  
  const contextMenu = Menu.buildFromTemplate([
    { label: '显示应用', click: () => { win?.show(); win?.focus(); } },
    { label: '开始学习', click: () => { win?.show(); win?.focus(); win?.webContents.send('navigate-to', '/'); } },
    { label: '今日复习', click: () => { win?.show(); win?.focus(); win?.webContents.send('navigate-to', '/review'); } },
    { type: 'separator' },
    { label: '退出应用', click: () => { isQuitting = true; app.quit(); } }
  ]);
  
  tray.setContextMenu(contextMenu);
  tray.setToolTip('日语学习助手');
  
  tray.on('double-click', () => {
    win?.show();
    win?.focus();
  });
}

function registerGlobalShortcuts() {
  globalShortcut.register('CommandOrControl+Shift+L', () => {
    if (win) {
      if (win.isVisible()) {
        win.hide();
      } else {
        win.show();
        win.focus();
      }
    }
  });

  globalShortcut.register('CommandOrControl+Shift+R', () => {
    win?.show();
    win?.focus();
    win?.webContents.send('navigate-to', '/review');
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.commandLine.appendSwitch('unsafely-treat-insecure-origin-as-secure', 'http://localhost:5173');
app.commandLine.appendSwitch('disable-web-security');
app.commandLine.appendSwitch('allow-running-insecure-content');
app.commandLine.appendSwitch('force-fieldtrials', 'WebRTC-Audio-Red-For-Opus/Enabled/');
app.commandLine.appendSwitch('enable-features', 'VaapiVideoDecoder');

app.whenReady().then(async () => {
  app.setAsDefaultProtocolClient('learning-app');
  
  createWindow();
  createTray();
  registerGlobalShortcuts();
  
  if (win) {
    win.webContents.setUserAgent(win.webContents.getUserAgent() + ' SpeechRecognition/1.0');
    
    win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': [
            "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; " +
            "connect-src 'self' https: wss: ws: https://*.googleapis.com https://*.google.com; " +
            "media-src 'self' blob: data:; " +
            "img-src 'self' data: blob: https:;"
          ]
        }
      });
    });
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

// --- 辅助函数 ---
async function askGemini(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const escapedPrompt = JSON.stringify(prompt);
    const command = `gemini -m gemini-2.5-flash -p ${escapedPrompt}`;
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(new Error(`Failed to execute gemini: ${stderr || error.message}`));
        return;
      }
      if (stderr) {
        console.warn(`gemini stderr: ${stderr}`);
      }
      resolve(stdout);
    });
  });
}

// =================================================================
// IPC 处理器 (非数据库)
// =================================================================

// ipcMain.on('start-recognition', (event, language) => {
//   const win = BrowserWindow.fromWebContents(event.sender);
//   if (!recognizer) {
//     try {
//       recognizer = new SpeechRecognizer({
//         locale: language || 'ja-JP',
//         onResult: (text) => { 
//           win?.webContents.send('speech-result', text);
//         },
//         onError: (error) => { 
//           console.error('SpeechRecognizer error:', error);
//           win?.webContents.send('speech-error', error);
//         }
//       });
//       recognizer.start();
//       win?.webContents.send('recognition-started');
//     } catch (e) {
//       console.error('Failed to start SpeechRecognizer:', e);
//       win?.webContents.send('speech-error', e.message || 'Unknown error');
//     }
//   }
// });

// ipcMain.on('stop-recognition', (event) => {
//   const win = BrowserWindow.fromWebContents(event.sender);
//   if (recognizer) {
//     recognizer.stop();
//     recognizer = null; // 清理实例
//     win?.webContents.send('recognition-stopped');
//   }
// });

// 创建一个统一的、返回 Promise 的 IPC 处理器
// main.ts
ipcMain.handle('speech:recognize', async (event, { language }) => {
  console.log('>>> [IPC] Received speech:recognize request.');
  if (recognizer) {
    console.log('>>> [IPC] Existing recognizer found, stopping it.');
    recognizer.stop();
    recognizer = null;
  }

  return new Promise((resolve, reject) => {
    try {
      console.log('>>> [IPC] Creating new SpeechRecognizer instance...');
      recognizer = new SpeechRecognizer({
        locale: language || 'ja-JP',
        onResult: (text: string) => {
          console.log(`<<< [Native] onResult received: ${text}`);
          recognizer?.stop();
          recognizer = null;
          resolve({ success: true, text: text });
        },
        onError: (error: string) => {
          console.error(`<<< [Native] onError received: ${error}`);
          recognizer?.stop();
          recognizer = null;
          reject(new Error(error));
        }
      });
      
      console.log('>>> [IPC] Calling recognizer.start()...');
      recognizer.start();
      console.log('>>> [IPC] recognizer.start() called successfully.');

    } catch (e) {
      console.error('>>> [IPC] CRITICAL: Failed to instantiate or start SpeechRecognizer:', e);
      reject(e);
    }
  });
});

// 如果用户中途取消，需要一个单独的处理器
ipcMain.on('speech:cancel', () => {
  if (recognizer) {
    recognizer.stop();
    recognizer = null;
  }
});




ipcMain.handle('ai:ask', async (event, prompt: string) => {
  try {
    return await askGemini(prompt);
  } catch (error) {
    console.error('Failed to ask Gemini:', error);
    throw error;
  }
});

// 【关键修改】重写权限请求的 IPC 处理器
ipcMain.handle('speech:requestAuthorization', async () => {
  // systemPreferences.askForMediaAccess 专门用于请求摄像头和麦克风权限
  // 对于语音识别，我们需要检查并请求麦克风权限
  const micStatus = systemPreferences.getMediaAccessStatus('microphone');
  console.log(`[IPC] Microphone access status: ${micStatus}`);

  if (micStatus !== 'granted') {
    const granted = await systemPreferences.askForMediaAccess('microphone');
    console.log(`[IPC] Microphone access granted: ${granted}`);
    if (!granted) {
      return false; // 如果麦克风权限被拒绝，直接返回 false
    }
  }

  // 在 macOS 10.15+，语音识别权限是自动处理的，
  // 只要应用在 Info.plist 中有 NSSpeechRecognitionUsageDescription，
  // 并且应用已签名，第一次尝试使用时就会自动弹出请求。
  // 我们在这里返回 true，让前端继续尝试启动识别。
  return true;
});
