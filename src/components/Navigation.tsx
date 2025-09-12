'use client';

import { useState } from 'react';
import { Settings, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationProps {
  activeTab: 'agent' | 'settings';
  onTabChange: (tab: 'agent' | 'settings') => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-2 mb-8">
      <div className="flex space-x-2">
        {/* Agent Tab */}
        <button
          onClick={() => onTabChange('agent')}
          className={cn(
            "flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200",
            activeTab === 'agent'
              ? "bg-blue-500 text-white shadow-lg"
              : "text-gray-300 hover:text-white hover:bg-white/10"
          )}
        >
          <Phone className="h-5 w-5" />
          <span>Agent</span>
        </button>

        {/* Settings Tab */}
        <button
          onClick={() => onTabChange('settings')}
          className={cn(
            "flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200",
            activeTab === 'settings'
              ? "bg-blue-500 text-white shadow-lg"
              : "text-gray-300 hover:text-white hover:bg-white/10"
          )}
        >
          <Settings className="h-5 w-5" />
          <span>Einstellungen</span>
        </button>
      </div>
    </nav>
  );
}