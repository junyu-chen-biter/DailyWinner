import { app, BrowserWindow, ipcMain, Tray, Menu, screen } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import Store from "electron-store";
import AutoLaunch from "auto-launch";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;
let tray: Tray | null = null;
const store = new Store();

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width } = primaryDisplay.workAreaSize;
  // 窗口位置固定在屏幕右上角（距离顶部和右侧各 50px）
  const x = width - 320 - 50;
  const y = 50;

  win = new BrowserWindow({
    width: 320,
    height: 460,
    x,
    y,
    frame: false, // 无边框
    transparent: true, // 背景透明
    skipTaskbar: true, // 不显示在任务栏
    resizable: false, // 窗口大小不可调整
    // alwaysOnTop: true, // 总是显示在最顶层 (开发时注释)
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
    },
  });

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(() => {
  // IPC 监听器
  ipcMain.handle("get-tasks", () => {
    return store.get("tasks", []);
  });

  ipcMain.on("update-tasks", (_event, tasks) => {
    store.set("tasks", tasks);
  });

  ipcMain.handle("get-auto-launch-status", () => {
    const autoLauncher = new AutoLaunch({
      name: "Daily Habit Tracker",
      path: app.getPath("exe"),
    });
    return autoLauncher.isEnabled();
  });

  ipcMain.on("toggle-auto-launch", (_event, enable) => {
    const autoLauncher = new AutoLaunch({
      name: "Daily Habit Tracker",
      path: app.getPath("exe"),
    });
    if (enable) {
      autoLauncher.enable();
    } else {
      autoLauncher.disable();
    }
  });

  createWindow();

  // 系统托盘
  try {
    tray = new Tray(path.join(process.env.VITE_PUBLIC, "electron-vite.svg"));
    const contextMenu = Menu.buildFromTemplate([
      { label: "Exit", click: () => app.quit() },
    ]);
    tray.setToolTip("Daily Habit Tracker");
    tray.setContextMenu(contextMenu);
  } catch (error) {
    console.error("Failed to create tray:", error);
  }
});
