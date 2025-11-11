import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { AppIcon } from './AppIcon';
import { AddAppButton } from './AddAppButton';
import { AddAppModal } from './AddAppModal';

export function AppDock() {
  const { apps, currentAppId } = useStore();
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <>
      <div className="w-20 bg-gray-800 border-r border-gray-700 flex flex-col items-center py-4 gap-3">
        {/* App Logo */}
        <div className="mb-4 text-3xl">⚓</div>

        {/* App Icons */}
        <div className="flex-1 flex flex-col gap-2 overflow-y-auto no-scrollbar">
          {apps.map((app) => (
            <AppIcon
              key={app.id}
              app={app}
              isActive={app.id === currentAppId}
            />
          ))}
        </div>

        {/* Add App Button */}
        <AddAppButton onClick={() => setShowAddModal(true)} />
      </div>

      {/* Add App Modal */}
      {showAddModal && <AddAppModal onClose={() => setShowAddModal(false)} />}
    </>
  );
}
