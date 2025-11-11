import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { ContextMenu } from '../Common/ContextMenu';

export function AppIcon({ app, isActive }) {
  const { switchApp, deleteApp } = useStore();
  const [contextMenu, setContextMenu] = useState(null);

  const handleClick = () => {
    switchApp(app.id);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const contextMenuItems = [
    {
      label: 'Open',
      icon: '🚀',
      onClick: () => switchApp(app.id),
      disabled: isActive,
    },
    {
      label: 'Hibernate',
      icon: '💤',
      onClick: async () => {
        await window.electronAPI.app.hibernate(app.id);
      },
      disabled: isActive,
    },
    {
      label: 'Clear Cache',
      icon: '🧹',
      onClick: async () => {
        await window.electronAPI.app.clearSession(app.id);
      },
    },
    {
      label: 'Remove',
      icon: '🗑️',
      danger: true,
      onClick: () => deleteApp(app.id),
    },
  ];

  return (
    <>
      <motion.button
        onClick={handleClick}
        onContextMenu={handleContextMenu}
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

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenuItems}
          onClose={() => setContextMenu(null)}
        />
      )}
    </>
  );
}
