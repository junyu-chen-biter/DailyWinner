/// <reference types="vite/client" />

interface ElectronAPI {
  getTasks: () => Promise<any[]>
  updateTasks: (tasks: any[]) => void
  toggleAutoLaunch: (enable: boolean) => void
  getAutoLaunchStatus: () => Promise<boolean>
}

interface Window {
  electronAPI: ElectronAPI
}
