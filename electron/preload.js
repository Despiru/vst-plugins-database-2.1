const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  savePlugin: (plugin) => ipcRenderer.invoke('save-plugin', plugin),
  getPlugins: () => ipcRenderer.invoke('get-plugins'),
  deletePlugin: (pluginId) => ipcRenderer.invoke('delete-plugin', pluginId),
});