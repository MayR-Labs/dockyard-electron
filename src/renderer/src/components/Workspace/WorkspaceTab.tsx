import { motion } from 'framer-motion';
import type { Workspace } from '@shared/types';
import { useStore } from '../../store/useStore';

interface WorkspaceTabProps {
  workspace: Workspace;
  isActive: boolean;
}

export function WorkspaceTab({ workspace, isActive }: WorkspaceTabProps) {
  const { switchWorkspace } = useStore();

  const handleClick = () => {
    switchWorkspace(workspace.id);
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`
        px-4 py-1.5 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap
        ${
          isActive
            ? 'bg-primary-600 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span>{workspace.icon}</span>
      <span className="text-sm font-medium">{workspace.name}</span>
    </motion.button>
  );
}
