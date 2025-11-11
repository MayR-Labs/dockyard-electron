import { motion } from 'framer-motion';
import type { AppInstance } from '@shared/types';
import { useStore } from '../../store/useStore';

interface AppIconProps {
  app: AppInstance;
  isActive: boolean;
}

export function AppIcon({ app, isActive }: AppIconProps) {
  const { switchApp } = useStore();

  const handleClick = () => {
    switchApp(app.id);
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`
        relative w-14 h-14 rounded-xl flex items-center justify-center
        transition-all duration-200 hover:scale-110
        ${
          isActive
            ? 'bg-primary-600 shadow-lg'
            : 'bg-gray-700 hover:bg-gray-600'
        }
      `}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      title={app.name}
    >
      <span className="text-2xl">{app.icon}</span>
      
      {/* Badge indicator */}
      {app.state.badgeCount && app.state.badgeCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {app.state.badgeCount > 9 ? '9+' : app.state.badgeCount}
        </span>
      )}

      {/* Active indicator */}
      {isActive && (
        <motion.div
          className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-400 rounded-r"
          layoutId="activeIndicator"
        />
      )}
    </motion.button>
  );
}
