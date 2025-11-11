import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export function AddAppButton({ onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="w-14 h-14 rounded-xl bg-gray-700 hover:bg-primary-600 flex items-center justify-center transition-colors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      title="Add App"
    >
      <Plus size={24} />
    </motion.button>
  );
}
