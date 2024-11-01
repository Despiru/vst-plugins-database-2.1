import React, { useState, useEffect } from 'react';
import { Plus, Download, Trash2, Search } from 'lucide-react';
import AddPluginModal from './components/AddPluginModal';
import { Plugin } from './types';

function App() {
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadPlugins();
  }, []);

  const loadPlugins = async () => {
    const loadedPlugins = await window.electronAPI.getPlugins();
    setPlugins(loadedPlugins);
  };

  const handleAddPlugin = async (plugin: Plugin) => {
    const updatedPlugins = await window.electronAPI.savePlugin(plugin);
    setPlugins(updatedPlugins);
    setIsModalOpen(false);
  };

  const handleDeletePlugin = async (id: number) => {
    const updatedPlugins = await window.electronAPI.deletePlugin(id);
    setPlugins(updatedPlugins);
  };

  const filteredPlugins = plugins.filter(plugin => {
    const matchesSearch = plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plugin.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || plugin.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">VST Plugin Manager</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Add Plugin
          </button>
        </div>

        <div className="mb-6 flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search plugins..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <select
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="effects">Effects</option>
            <option value="synth">Synth</option>
            <option value="processing">Processing</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlugins.map((plugin) => (
            <div key={plugin.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{plugin.name}</h3>
                <button
                  onClick={() => handleDeletePlugin(plugin.id!)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              <div className="mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  {plugin.category}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{plugin.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {plugin.tags.map((tag, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
              <a
                href={plugin.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
              >
                <Download size={20} />
                Download Plugin
              </a>
            </div>
          ))}
        </div>

        <AddPluginModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddPlugin}
        />
      </div>
    </div>
  );
}