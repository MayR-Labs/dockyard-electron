import { motion } from 'framer-motion';

export function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-950">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">⚓</div>
          <div className="text-white text-2xl font-semibold">Loading Dockyard...</div>
        </div>
      </motion.div>
    </div>
  );
}
