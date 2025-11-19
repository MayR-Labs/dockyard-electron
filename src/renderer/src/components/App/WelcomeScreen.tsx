import { motion } from 'framer-motion';
import { CreateWorkspaceModal } from '../Modals/CreateWorkspaceModal';

type WelcomeScreenProps = {
  isCreateWorkspaceModalOpen: boolean;
  onOpenCreateWorkspace: () => void;
  onCloseCreateWorkspace: () => void;
  onCreateWorkspace: (data: {
    name: string;
    sessionMode: 'isolated' | 'shared';
    dockPosition: 'top' | 'bottom' | 'left' | 'right';
  }) => Promise<void>;
};

export function WelcomeScreen({
  isCreateWorkspaceModalOpen,
  onOpenCreateWorkspace,
  onCloseCreateWorkspace,
  onCreateWorkspace,
}: WelcomeScreenProps) {
  return (
    <div className="h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 text-white flex items-center justify-center overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -top-20 -left-20 animate-pulse" />
        <div
          className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -bottom-20 -right-20 animate-pulse"
          style={{ animationDelay: '1s' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-2xl px-8 relative z-10"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
          className="text-8xl mb-6 inline-block"
        >
          ⚓
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-5xl font-bold mb-4"
        >
          Welcome to Dockyard
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-xl opacity-90 mb-8"
        >
          Your local-first multi-app workspace is ready!
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-gray-300 mb-8"
        >
          Create your first workspace to start organizing your web apps.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          whileHover={{ scale: 1.05, boxShadow: '0 20px 50px rgba(99, 102, 241, 0.4)' }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenCreateWorkspace}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition shadow-lg"
        >
          Create Your First Workspace
        </motion.button>
      </motion.div>

      <CreateWorkspaceModal
        isOpen={isCreateWorkspaceModalOpen}
        onClose={onCloseCreateWorkspace}
        onCreateWorkspace={onCreateWorkspace}
      />
    </div>
  );
}
