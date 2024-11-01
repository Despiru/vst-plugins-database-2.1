export interface Plugin {
  id?: number;
  name: string;
  category: 'effects' | 'synth' | 'processing';
  description: string;
  downloadUrl: string;
  tags: string[];
}

declare global {
  interface Window {
    electronAPI: {
      savePlugin: (plugin: Plugin) => Promise<Plugin[]>;
      getPlugins: () => Promise<Plugin[]>;
      deletePlugin: (pluginId: number) => Promise<Plugin[]>;
    }
  }
}