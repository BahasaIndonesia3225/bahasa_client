// Modules to control application life and create native browser window
// app 模块，它控制应用程序的事件生命周期。
// BrowserWindow 模块，它创建和管理应用程序 窗口。
import { app, BrowserWindow, protocol } from 'electron';
import * as path from 'path';
import createProtocol from './createProtocol';

let mainWindow: BrowserWindow;
let isDevelopment = process.env.NODE_ENV === 'development';
let APP_URL = process.env.UMI_APP_URL;

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: {
      secure: true,
      standard: true,
      supportFetchAPI: true,
      allowServiceWorkers: true,
    },
  },
]);

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    useContentSize: true,
    webPreferences: {
      //预加载脚本在渲染器进程加载之前加载，并有权访问两个 渲染器全局 (例如 window 和 document) 和 Node.js 环境。
      webSecurity: false, //允许跨域
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  //隐藏窗口的菜单
  mainWindow.setMenu(null);

  if (isDevelopment) {
    // @ts-ignore
    mainWindow.loadURL(APP_URL);
    mainWindow.webContents.openDevTools();
  } else {
    createProtocol('app');
    mainWindow.loadURL('app://./index.html');
  }
}

app.on('ready', async () => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
