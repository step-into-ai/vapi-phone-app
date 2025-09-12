'use client';

import { useState } from 'react';
import VapiSmartphone from '@/components/VapiSmartphone';
import Navigation from '@/components/Navigation';
import Settings from '@/components/Settings';
import { useVapiConfig } from '@/hooks/useVapiConfig';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'agent' | 'settings'>('agent');
  const { config, updateConfig, isLoaded } = useVapiConfig();

  // Don't render until config is loaded
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p>Lade Konfiguration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
      </div>
      
      {/* Main Content */}
      <div className="relative min-h-screen flex flex-col p-4">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI Phone
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-4">
            Sprechen Sie mit Ihrem intelligenten KI-Assistenten
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Content Area */}
        <div className="flex-1 flex items-center justify-center px-4">
          {activeTab === 'agent' && (
            <div className="w-full max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <p className="text-gray-400 max-w-lg mx-auto">
                  Eine moderne Sprachschnittstelle, die es Ihnen ermöglicht, natürliche Gespräche mit fortschrittlicher KI zu führen.
                </p>
              </div>

              {/* Smartphone Component */}
              <div className="w-full flex justify-center items-center mb-16">
                <div className="flex justify-center w-full">
                  <div className="relative">
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl transform scale-110 animate-pulse"></div>
                    
                    {/* Phone */}
                    <VapiSmartphone className="relative z-10" config={config} />
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Natürliche Sprache</h3>
                  <p className="text-gray-400 text-sm">Sprechen Sie normal und natürlich mit der KI</p>
                </div>
                
                <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Sofortige Antworten</h3>
                  <p className="text-gray-400 text-sm">Erhalten Sie Echtzeit-Antworten von der KI</p>
                </div>
                
                <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Sicher & Privat</h3>
                  <p className="text-gray-400 text-sm">Ihre Gespräche sind geschützt und sicher</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <Settings onConfigChange={updateConfig} />
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center pb-8">
          <p className="text-gray-400 text-sm">
            Powered by{" "}
            <a 
              href="https://vapi.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Vapi AI
            </a>
            {" "}&{" "}
            <a 
              href="https://nextjs.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Next.js
            </a>
          </p>
          
          {/* Debug Panel in Development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 rounded-lg bg-gray-800/50 text-xs text-gray-300 max-w-md mx-auto">
              <div className="font-mono space-y-1 text-left">
                <div className="text-center font-bold mb-2">🔧 Debug Panel</div>
                <div>Environment: {process.env.NODE_ENV}</div>
                <div>API Key: {config.apiKey.substring(0, 10)}...</div>
                <div>Assistant: {config.assistantId.substring(0, 8)}...</div>
                <div>Check Console: F12 → Console Tab</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}