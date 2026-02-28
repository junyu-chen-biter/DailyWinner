# 日常习惯追踪器 (Daily Habit Tracker)

基于 Electron + Vue 3 + TypeScript 开发的桌面端极简习惯追踪应用。帮助你养成良好的生活习惯，记录每一天的进步。

## ✨ 主要功能

- **每日打卡**：一键完成今日习惯打卡。
- **连击统计 (Streak)**：记录连续打卡天数，激励坚持。
- **习惯管理**：支持自定义添加和删除习惯。
- **数据持久化**：本地自动保存数据，无需担心丢失。
- **开机自启**：支持设置随系统启动，不错过每一天。
- **极简设计**：清爽的 UI 界面，专注习惯本身。

## 🛠️ 技术栈

- **前端框架**：Vue 3 + TypeScript
- **构建工具**：Vite
- **桌面端封装**：Electron
- **打包工具**：electron-builder
- **样式**：原生 CSS (Scoped)

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
# 或者
yarn install
```

### 2. 开发模式运行

```bash
npm run dev
# 或者
yarn dev
```

### 3. 构建应用

构建生产环境的安装包：

```bash
npm run build
# 或者
yarn build
```

构建产物将位于 `release` 目录下。

## 📝 目录结构

- `src/` - Vue 前端源码
- `electron/` - Electron 主进程与预加载脚本
- `dist-electron/` - Electron 编译输出
- `release/` - 打包后的安装程序

## 📄 License

MIT
