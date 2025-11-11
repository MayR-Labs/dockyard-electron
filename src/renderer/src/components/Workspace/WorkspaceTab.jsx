import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';

export function WorkspaceTab({ workspace, isActive }) {
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
