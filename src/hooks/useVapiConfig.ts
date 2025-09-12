'use client';

import { useState, useEffect } from 'react';

export interface VapiConfig {
  apiKey: string;
  assistantId: string;
}

const DEFAULT_CONFIG: VapiConfig = {
  apiKey: 'ef035323-e70f-4575-9cdc-57b256de9ce1',
  assistantId: 'dd677d2a-d984-4e0e-bd6b-02ad1c9759af'
};

export function useVapiConfig() {
  const [config, setConfig] = useState<VapiConfig>(DEFAULT_CONFIG);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load config from localStorage on mount
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem('vapi-config');
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig(parsedConfig);
      }
    } catch (error) {
      console.error('Error loading Vapi config from localStorage:', error);
    }
    setIsLoaded(true);
  }, []);

  const updateConfig = (newConfig: VapiConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem('vapi-config', JSON.stringify(newConfig));
    } catch (error) {
      console.error('Error saving Vapi config to localStorage:', error);
    }
  };

  return {
    config,
    updateConfig,
    isLoaded
  };
}