import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function ContextMenu({ x, y, items, onClose }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target )) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.1 }}
        className="fixed bg-gray-800 border border-gray-700 rounded-lg shadow-2xl py-1 min-w-[180px] z-50"
        style={{ left: x, top: y }}
      >
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              if (!item.disabled) {
                item.onClick();
                onClose();
              }
            }}
            disabled={item.disabled}
            className={`
              w-full px-4 py-2 text-left flex items-center gap-2 transition-colors
              ${
                item.danger
                  ? 'text-red-400 hover:bg-red-900/20'
                  : 'text-white hover:bg-gray-700'
              }
              ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {item.icon && <span className="text-lg">{item.icon}</span>}
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
