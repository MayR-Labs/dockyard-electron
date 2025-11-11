/**
 * Workspace Canvas Component
 * Displays the main workspace area with app tiles
 * Single Responsibility: Workspace content display
 */

import { motion, AnimatePresence } from 'framer-motion';
import { App } from '../../../../shared/types/app';
import { NavigationControls } from '../AppControls/NavigationControls';
import { QuickStartGuide } from './QuickStartGuide';

interface WorkspaceCanvasProps {
  apps: App[];
  activeAppId: string | null;
  onAppSelect: (appId: string) => void;
  onAddSampleApps?: () => void;
  onAddCustomApp?: () => void;
}

export function WorkspaceCanvas({ 
  apps, 
  activeAppId, 
  onAppSelect,
  onAddSampleApps,
  onAddCustomApp 
}: WorkspaceCanvasProps) {
  if (apps.length === 0) {
    return (
      <QuickStartGuide 
        onAddSampleApps={onAddSampleApps || (() => {})}
        onAddCustomApp={onAddCustomApp || (() => {})}
      />
    );
  }

  const activeApp = apps.find(app => app.id === activeAppId);

  return (
    <div className="flex-1 bg-gray-950 relative">
      <AnimatePresence mode="wait">
        {activeApp && (
          <AppTile
            key={activeApp.id}
            app={activeApp}
            isActive={true}
            onSelect={() => onAppSelect(activeApp.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

interface AppTileProps {
  app: App;
  isActive: boolean;
  onSelect: () => void;
}

function AppTile({ app, isActive, onSelect }: AppTileProps) {
  if (!isActive) return null;

  // Placeholder handlers for navigation controls
  // These will be connected to BrowserView in Phase 2.3
  const handleBack = () => console.log('Navigate back');
  const handleForward = () => console.log('Navigate forward');
  const handleReload = () => console.log('Reload');
  const handleHome = () => console.log('Navigate home');

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 flex flex-col bg-gray-900"
      onClick={onSelect}
    >
      {/* Micro-toolbar */}
      <div className="h-10 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          {/* Navigation Controls */}
          <NavigationControls
            canGoBack={false}
            canGoForward={false}
            isLoading={false}
            onBack={handleBack}
            onForward={handleForward}
            onReload={handleReload}
            onHome={handleHome}
          />
          
          {/* App Info */}
          <div className="flex items-center gap-2 ml-2 border-l border-gray-700 pl-3">
            {app.icon && (
              <img src={app.icon} alt={app.name} className="w-5 h-5 rounded" />
            )}
            <span className="text-sm font-medium text-gray-300">{app.name}</span>
            {app.instances.length > 1 && (
              <select className="text-xs bg-gray-700 text-gray-300 rounded px-2 py-1 border border-gray-600">
                {app.instances.map((instance, idx) => (
                  <option key={instance.id} value={instance.id}>
                    {instance.name || `Instance ${idx + 1}`}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            className="p-1 hover:bg-gray-700 rounded transition-colors"
            title="Settings"
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <button
            className="p-1 hover:bg-gray-700 rounded transition-colors"
            title="Close"
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* App content area - Simulated Browser View */}
      <SimulatedBrowserView app={app} />
    </motion.div>
  );
}

/**
 * Simulated Browser View
 * Shows a beautiful preview of what the app will look like when embedded
 */
function SimulatedBrowserView({ app }: { app: App }) {
  return (
    <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, currentColor 10px, currentColor 20px)`,
        }} />
      </div>

      {/* Mock Browser Chrome */}
      <div className="absolute top-4 left-4 right-4 bg-white rounded-lg shadow-2xl overflow-hidden">
        <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 mx-4">
            <div className="bg-white rounded px-3 py-1 text-xs text-gray-600 border border-gray-300">
              🔒 {app.url}
            </div>
          </div>
        </div>
        
        {/* Mock Content */}
        <div className="bg-white p-6 h-64">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="space-y-4"
          >
            {/* Simulated content based on app type */}
            <div className="flex items-center gap-4 mb-6">
              {app.icon && (
                <div className="w-16 h-16 flex items-center justify-center text-4xl bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl">
                  <img src={app.icon} alt={app.name} className="w-12 h-12 rounded-lg" />
                </div>
              )}
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{app.name}</h3>
                <p className="text-sm text-gray-500">Web Application</p>
              </div>
            </div>
            
            {/* Skeleton content */}
            <div className="space-y-3">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2 animate-pulse" />
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-5/6 animate-pulse" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Center Info */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="absolute inset-0 flex items-center justify-center"
        style={{ top: '40%' }}
      >
        <div className="text-center bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl max-w-md">
          <div className="text-5xl mb-4">🚧</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            Live Preview Coming Soon!
          </h3>
          <p className="text-gray-600 mb-4">
            This is a preview of <strong>{app.name}</strong>. The actual web app will load here with BrowserView integration.
          </p>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-sm text-indigo-800">
            <p className="font-semibold mb-1">🎯 Phase 3 Feature</p>
            <p>Full web app embedding with session management</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
