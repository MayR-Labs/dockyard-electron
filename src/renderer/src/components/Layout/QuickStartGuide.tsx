/**
 * Quick Start Guide Component
 * Shows when a workspace is created but has no apps
 * Surfaces curated collections and guidance
 */

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useAppSetup } from '../../hooks/useAppSetup';

interface QuickStartGuideProps {
  onCollectionSelect?: (collection: string) => void;
  onAddCustomApp: () => void;
}

export function QuickStartGuide({ onCollectionSelect, onAddCustomApp }: QuickStartGuideProps) {
  const {
    data: appSetup,
    loading: isLoadingCollections,
    error: collectionsError,
    refresh: refreshCollections,
  } = useAppSetup();

  const collectionCards = useMemo(() => {
    const apps = appSetup?.apps ?? [];
    const catalogCollections = appSetup?.collections ?? [];
    const stats = new Map<string, { count: number; logos: string[] }>();

    apps.forEach((app) => {
      (app.collections ?? []).forEach((collection) => {
        if (!collection) return;
        const current = stats.get(collection) ?? { count: 0, logos: [] };
        current.count += 1;
        if (app.logo_url && current.logos.length < 4) {
          current.logos.push(app.logo_url);
        }
        stats.set(collection, current);
      });
    });

    const orderedCollections = (catalogCollections.length ? catalogCollections : Array.from(stats.keys())).map(
      (collection) => ({
        name: collection,
        count: stats.get(collection)?.count ?? 0,
        logos: stats.get(collection)?.logos ?? [],
      })
    );

    return orderedCollections.sort((a, b) => {
      if (b.count === a.count) {
        return a.name.localeCompare(b.name);
      }
      return b.count - a.count;
    });
  }, [appSetup?.apps, appSetup?.collections]);

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl w-full"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="text-7xl mb-6 animate-bounce">🚀</div>
          <h2 className="text-4xl font-bold text-white mb-4">Your Workspace is Ready!</h2>
          <p className="text-xl text-gray-300">Add your favorite web apps to get started</p>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 p-1 group"
          >
            <div className="bg-gray-900 rounded-xl p-6 h-full">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🗂️</div>
                <div className="flex-1 text-left">
                  <h3 className="text-xl font-bold text-white mb-2">Curated Collections</h3>
                  <p className="text-gray-400 text-sm mb-3">
                    Explore themed bundles of apps hand-picked for focused workflows
                  </p>
                  <p className="text-sm text-indigo-300">
                    Select a collection below to browse recommended apps →
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity" />
          </motion.div>

          {/* Add Custom App */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={onAddCustomApp}
            className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 p-1"
          >
            <div className="bg-gray-900 rounded-xl p-6 h-full">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🌐</div>
                <div className="flex-1 text-left">
                  <h3 className="text-xl font-bold text-white mb-2">Add Custom Web App</h3>
                  <p className="text-gray-400 text-sm mb-3">
                    Add any website or web app by entering its URL
                  </p>
                  <div className="text-sm text-teal-400 font-medium">Click to get started →</div>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-20 transition-opacity" />
          </motion.button>
        </div>

        {/* Collections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-800"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <span>⭐</span>
                Collections
              </h3>
              <p className="text-sm text-gray-400">
                Pick a collection to view curated app recommendations.
              </p>
            </div>
            {collectionsError && (
              <button
                onClick={() => refreshCollections()}
                className="text-sm text-red-300 hover:text-red-200 underline"
              >
                Retry loading collections
              </button>
            )}
          </div>

          {isLoadingCollections && collectionCards.length === 0 && (
            <div className="text-center py-12 text-gray-400">Loading collections…</div>
          )}

          {!isLoadingCollections && collectionCards.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              No collections are available yet. Check back soon!
            </div>
          )}

          {collectionCards.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {collectionCards.map((collection) => (
                <motion.button
                  key={collection.name}
                  whileHover={{ scale: collection.count > 0 ? 1.02 : 1 }}
                  whileTap={{ scale: collection.count > 0 ? 0.98 : 1 }}
                  disabled={collection.count === 0}
                  onClick={() =>
                    collection.count > 0 && onCollectionSelect?.(collection.name)
                  }
                  className={`text-left rounded-xl border transition-all bg-gray-900/70 p-4 flex flex-col gap-3 ${
                    collection.count > 0
                      ? 'border-gray-800 hover:border-indigo-500 hover:bg-gray-900'
                      : 'border-gray-800/60 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-white">{collection.name}</p>
                      <p className="text-xs text-gray-400">
                        {collection.count > 0
                          ? `${collection.count} app${collection.count === 1 ? '' : 's'}`
                          : 'Coming soon'}
                      </p>
                    </div>
                    <span className="text-indigo-400 text-sm font-medium">
                      {collection.count > 0 ? 'Select' : 'Soon'}
                    </span>
                  </div>
                  {collection.count > 0 && (
                    <div className="flex items-center gap-2">
                      {collection.logos.length > 0 ? (
                        <div className="flex -space-x-2">
                          {collection.logos.map((logo) => (
                            <img
                              key={logo}
                              src={logo}
                              alt="Collection app"
                              className="w-8 h-8 rounded-full border border-gray-900 bg-gray-800"
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500">Apps ready to launch</div>
                      )}
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Tips & Attribution */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="mt-8 text-center text-sm text-gray-500 space-y-2"
        >
          <p>
            💡 <span className="text-gray-400">Tip:</span> You can add multiple instances of the
            same app for different accounts
          </p>
          <p className="text-xs text-gray-500">
            Built with <span className="text-pink-400">❤️</span> by{' '}
            <a
              href="https://mayrlabs.com"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-300 hover:text-indigo-200 underline"
            >
              MayR Labs
            </a>
            . © 2025
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
