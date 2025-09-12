'use client';

import { useState, useEffect } from 'react';
import { Save, Key, Bot, Check, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface VapiConfig {
  apiKey: string;
  assistantId: string;
}

interface SettingsProps {
  onConfigChange?: (config: VapiConfig) => void;
}

export default function Settings({ onConfigChange }: SettingsProps) {
  const [config, setConfig] = useState<VapiConfig>({
    apiKey: '',
    assistantId: ''
  });
  const [savedStatus, setSavedStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errors, setErrors] = useState<{ apiKey?: string; assistantId?: string }>({});

  // Load config from localStorage on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('vapi-config');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig(parsedConfig);
      } catch (error) {
        console.error('Error loading saved config:', error);
      }
    } else {
      // Load default values if no saved config
      setConfig({
        apiKey: 'ef035323-e70f-4575-9cdc-57b256de9ce1',
        assistantId: 'dd677d2a-d984-4e0e-bd6b-02ad1c9759af'
      });
    }
  }, []);

  const validateConfig = (config: VapiConfig): { apiKey?: string; assistantId?: string } => {
    const errors: { apiKey?: string; assistantId?: string } = {};
    
    if (!config.apiKey.trim()) {
      errors.apiKey = 'API Key ist erforderlich';
    } else if (config.apiKey.length < 10) {
      errors.apiKey = 'API Key scheint zu kurz zu sein';
    }

    if (!config.assistantId.trim()) {
      errors.assistantId = 'Assistant ID ist erforderlich';
    } else if (!config.assistantId.match(/^[a-f0-9-]{36}$/)) {
      errors.assistantId = 'Assistant ID sollte eine gültige UUID sein';
    }

    return errors;
  };

  const handleSave = () => {
    const validationErrors = validateConfig(config);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setSavedStatus('error');
      return;
    }

    setSavedStatus('saving');
    
    try {
      localStorage.setItem('vapi-config', JSON.stringify(config));
      onConfigChange?.(config);
      setSavedStatus('saved');
      
      setTimeout(() => {
        setSavedStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Error saving config:', error);
      setSavedStatus('error');
      setTimeout(() => {
        setSavedStatus('idle');
      }, 2000);
    }
  };

  const handleInputChange = (field: keyof VapiConfig, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Vapi Einstellungen</h2>
          <p className="text-gray-400">
            Konfigurieren Sie Ihre Vapi API-Credentials für die Nutzung des Voice Agents
          </p>
        </div>

        <div className="space-y-6">
          {/* API Key Input */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2">
              <Key className="h-4 w-4" />
              <span>Vapi API Key (Public Key)</span>
            </label>
            <input
              type="text"
              value={config.apiKey}
              onChange={(e) => handleInputChange('apiKey', e.target.value)}
              placeholder="ef035323-e70f-4575-9cdc-57b256de9ce1"
              className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
                errors.apiKey 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-white/20 focus:ring-blue-500'
              }`}
            />
            {errors.apiKey && (
              <p className="mt-1 text-sm text-red-400 flex items-center space-x-1">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.apiKey}</span>
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Ihr Public API Key von{" "}
              <a href="https://dashboard.vapi.ai" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                dashboard.vapi.ai
              </a>
            </p>
          </div>

          {/* Assistant ID Input */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2">
              <Bot className="h-4 w-4" />
              <span>Assistant ID</span>
            </label>
            <input
              type="text"
              value={config.assistantId}
              onChange={(e) => handleInputChange('assistantId', e.target.value)}
              placeholder="dd677d2a-d984-4e0e-bd6b-02ad1c9759af"
              className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
                errors.assistantId 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-white/20 focus:ring-blue-500'
              }`}
            />
            {errors.assistantId && (
              <p className="mt-1 text-sm text-red-400 flex items-center space-x-1">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.assistantId}</span>
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Die ID Ihres konfigurierten Assistenten
            </p>
          </div>

          {/* Save Button */}
          <motion.button
            onClick={handleSave}
            disabled={savedStatus === 'saving'}
            className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
              savedStatus === 'saved'
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : savedStatus === 'error'
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white hover:shadow-lg'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            whileTap={{ scale: 0.98 }}
          >
            {savedStatus === 'saving' && (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {savedStatus === 'saved' && <Check className="h-5 w-5" />}
            {savedStatus === 'error' && <AlertCircle className="h-5 w-5" />}
            {savedStatus === 'idle' && <Save className="h-5 w-5" />}
            <span>
              {savedStatus === 'saving' && 'Speichern...'}
              {savedStatus === 'saved' && 'Gespeichert!'}
              {savedStatus === 'error' && 'Fehler beim Speichern'}
              {savedStatus === 'idle' && 'Einstellungen speichern'}
            </span>
          </motion.button>

          {/* Info Box */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <h3 className="text-blue-400 font-medium mb-2">💡 Hinweise:</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Die Einstellungen werden lokal in Ihrem Browser gespeichert</li>
              <li>• Nach dem Speichern wird der Agent mit den neuen Credentials neu initialisiert</li>
              <li>• Verwenden Sie nur Ihren Public API Key (nicht den Private Key)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}