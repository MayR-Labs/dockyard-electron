import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { WorkspaceTab } from './WorkspaceTab';
import { AddWorkspaceModal } from './AddWorkspaceModal';

export function WorkspaceSwitcher() {
  const { workspaces, currentWorkspace } = useStore();
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <>
      <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center px-4 gap-2 overflow-x-auto no-scrollbar">
        {workspaces.map((workspace) => (
          <WorkspaceTab
            key={workspace.id}
            workspace={workspace}
            isActive={workspace.id === currentWorkspace?.id}
          />
        ))}

        {/* Add Workspace Button */}
        <motion.button
          onClick={() => setShowAddModal(true)}
          className="px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-primary-600 flex items-center gap-1.5 transition-colors whitespace-nowrap"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={16} />
          <span className="text-sm">New</span>
        </motion.button>
      </div>

      {/* Add Workspace Modal */}
      {showAddModal && (
        <AddWorkspaceModal onClose={() => setShowAddModal(false)} />
      )}
    </>
  );
}
