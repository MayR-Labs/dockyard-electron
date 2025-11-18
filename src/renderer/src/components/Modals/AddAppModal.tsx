import React, { useState, useMemo } from 'react';
import type { PopularApp } from '../../../../shared/types';
import { useAppSetup } from '../../hooks/useAppSetup';
import { getFaviconUrl } from '../../utils/favicon';

interface AddAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddApp: (appData: {
    name: string;
    url: string;
    icon?: string;
    description?: string;
    customCSS?: string;
    customJS?: string;
  }) => Promise<void>;
}

type AddAppMode = 'select' | 'popular' | 'custom';

const ALL_FILTER_VALUE = 'All';
const INDEPENDENT_SUITE_VALUE = '__suite-independent__';

const normalizeSuiteFilterValue = (suite: string | null): string => suite ?? INDEPENDENT_SUITE_VALUE;
const getSuiteLabel = (suite: string | null): string => suite ?? 'Independent';

export function AddAppModal({ isOpen, onClose, onAddApp }: AddAppModalProps) {
  const [mode, setMode] = useState<AddAppMode>('select');
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [icon, setIcon] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Filtering state for popular apps
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(ALL_FILTER_VALUE);
  const [selectedSuite, setSelectedSuite] = useState<string>(ALL_FILTER_VALUE);

  const {
    data: appSetup,
    loading: isAppSetupLoading,
    refreshing: isRefreshingAppSetup,
    error: appSetupError,
    refresh: refreshAppSetup,
  } = useAppSetup();

  const apps = useMemo<PopularApp[]>(() => appSetup?.apps ?? [], [appSetup?.apps]);

  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    apps.forEach((app) => {
      app.categories.forEach((category) => categorySet.add(category));
    });
    (appSetup?.categories ?? []).forEach((category) => {
      if (category) {
        categorySet.add(category);
      }
    });
    return Array.from(categorySet).sort((a, b) => a.localeCompare(b));
  }, [appSetup?.categories, apps]);

  const suiteSelectOptions = useMemo(() => {
    const suiteSet = new Set<string | null>();
    apps.forEach((app) => suiteSet.add(app.suite ?? null));
    (appSetup?.suites ?? []).forEach((suite) => suiteSet.add(suite ?? null));
    return Array.from(suiteSet)
      .map((suite) => ({
        value: normalizeSuiteFilterValue(suite),
        label: getSuiteLabel(suite),
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [appSetup?.suites, apps]);

  // Filtered popular apps
  const filteredApps = useMemo(() => {
    let filtered = [...apps];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.name.toLowerCase().includes(query) ||
          (app.description?.toLowerCase() ?? '').includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== ALL_FILTER_VALUE) {
      filtered = filtered.filter((app) => app.categories.includes(selectedCategory));
    }

    // Filter by suite
    if (selectedSuite !== ALL_FILTER_VALUE) {
      filtered = filtered.filter(
        (app) => normalizeSuiteFilterValue(app.suite ?? null) === selectedSuite
      );
    }

    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [apps, searchQuery, selectedCategory, selectedSuite]);

  const totalApps = apps.length;
  const showLoadingState = isAppSetupLoading && totalApps === 0;
  const showErrorState = Boolean(appSetupError) && totalApps === 0 && !isAppSetupLoading;
  const catalogErrorMessage = appSetupError ?? 'Unable to load popular apps';

  if (!isOpen) {
    // Reset state when modal is closed
    if (
      mode !== 'select' ||
      isSubmitting ||
      error ||
      name ||
      url ||
      icon ||
      description ||
      searchQuery
    ) {
      setTimeout(() => {
        setMode('select');
        setIsSubmitting(false);
        setError('');
        setName('');
        setUrl('');
        setIcon('');
        setDescription('');
        setSearchQuery('');
        setSelectedCategory(ALL_FILTER_VALUE);
        setSelectedSuite(ALL_FILTER_VALUE);
      }, 0);
    }
    return null;
  }

  const handlePopularAppSelect = (app: PopularApp) => {
    setName(app.name);
    setUrl(app.url);
    setIcon(app.logo_url || '');
    setDescription(app.description || '');
    setMode('custom'); // Show the form with pre-filled data
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent double submission
    if (isSubmitting) {
      return;
    }

    setError('');

    if (!name.trim() || !url.trim()) {
      setError('Name and URL are required');
      return;
    }

    // Basic URL validation
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    setIsSubmitting(true);
    try {
      const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;

      // Use provided icon or try to fetch favicon automatically
      let finalIcon = icon;
      if (!finalIcon) {
        // const { getFaviconUrl } = await import('../../utils/favicon.js');
        finalIcon = getFaviconUrl(normalizedUrl);
      }

      await onAddApp({
        name: name.trim(),
        url: normalizedUrl,
        icon: finalIcon,
        description: description.trim() || undefined,
      });

      // Reset form and close
      setName('');
      setUrl('');
      setIcon('');
      setDescription('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add app');
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Mode selection view
  if (mode === 'select') {
    return (
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={handleBackdropClick}
      >
        <div className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-md p-6 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Add App</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Mode selection */}
          <div className="space-y-3">
            <button
              onClick={() => setMode('popular')}
              className="w-full p-6 bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl transition text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">Popular Apps</h3>
                  <p className="text-sm text-white/70">Choose from 200+ pre-configured apps</p>
                </div>
                <svg
                  className="w-5 h-5 text-white/50 group-hover:text-white transition"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </button>

            <button
              onClick={() => setMode('custom')}
              className="w-full p-6 bg-gray-800 hover:bg-gray-750 rounded-xl transition text-left group border border-gray-700"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">Custom App</h3>
                  <p className="text-sm text-gray-400">Add any web app with custom details</p>
                </div>
                <svg
                  className="w-5 h-5 text-gray-500 group-hover:text-gray-300 transition"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Popular apps browser view
  if (mode === 'popular') {
    return (
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={handleBackdropClick}
      >
        <div className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-4xl max-h-[85vh] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMode('select')}
                className="p-2 hover:bg-gray-800 rounded-lg transition"
              >
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h2 className="text-2xl font-bold text-white">Popular Apps</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-gray-800 space-y-4">
            {/* Search */}
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search apps..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Category and Suite filters */}
            <div className="flex gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={ALL_FILTER_VALUE}>All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={selectedSuite}
                onChange={(e) => setSelectedSuite(e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={ALL_FILTER_VALUE}>All Suites</option>
                {suiteSelectOptions.map((suite) => (
                  <option key={suite.value} value={suite.value}>
                    {suite.label}
                  </option>
                ))}
              </select>
            </div>

            {isRefreshingAppSetup && (
              <p className="text-xs text-indigo-300">Refreshing catalog…</p>
            )}
          </div>

          {/* App list */}
          <div className="flex-1 overflow-y-auto p-6">
            {showLoadingState && (
              <div className="text-center py-12">
                <p className="text-gray-400">Loading popular apps…</p>
              </div>
            )}

            {showErrorState && (
              <div className="text-center py-12 space-y-4">
                <p className="text-gray-400">{catalogErrorMessage}</p>
                <button
                  onClick={() => refreshAppSetup()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                >
                  Retry
                </button>
              </div>
            )}

            {!showLoadingState && !showErrorState && (
              filteredApps.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400">
                    {totalApps === 0
                      ? 'No apps are available yet. Please try again later.'
                      : 'No apps found matching your filters'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredApps.map((app) => (
                    <button
                      id={app.id}
                      key={app.id}
                      onClick={() => handlePopularAppSelect(app)}
                      className="p-4 bg-gray-800 hover:bg-gray-750 rounded-xl transition text-left group border border-gray-700 hover:border-indigo-500"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={app.logo_url}
                          alt={app.name}
                          className="w-10 h-10 rounded-lg flex-shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-white group-hover:text-indigo-400 transition">
                              {app.name}
                            </h3>
                            {app.suite && (
                              <span className="text-xs px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded">
                                {app.suite}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                            {app.description || 'No description provided'}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {app.categories.slice(0, 2).map((category) => (
                              <span
                                key={category}
                                className="text-xs px-2 py-0.5 bg-gray-700 text-gray-300 rounded"
                              >
                                {category}
                              </span>
                            ))}
                            {app.categories.length > 2 && (
                              <span className="text-xs px-2 py-0.5 bg-gray-700 text-gray-300 rounded">
                                +{app.categories.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )
            )}

            {appSetupError && !showErrorState && (
              <div className="mt-6 text-xs text-red-400 bg-red-900/20 border border-red-800 rounded-lg p-3 text-center">
                Failed to refresh the catalog. Showing cached data.
                <button
                  onClick={() => refreshAppSetup()}
                  className="ml-2 text-red-200 underline hover:text-red-100"
                >
                  Retry
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800 text-center text-sm text-gray-400">
            Showing {filteredApps.length} of {totalApps} apps
          </div>
        </div>
      </div>
    );
  }

  // Custom app form view
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-2xl max-h-[85vh] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setMode('select');
                setName('');
                setUrl('');
                setIcon('');
                setDescription('');
              }}
              className="p-2 hover:bg-gray-800 rounded-lg transition"
            >
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-white">
              {name && url && icon ? 'Confirm App Details' : 'Create Custom App'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              App Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Gmail, Slack, GitHub"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isSubmitting}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              URL <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g., gmail.com or https://app.slack.com"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isSubmitting}
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter a domain or full URL. HTTPS will be added automatically.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Logo URL (Optional)
            </label>
            <input
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="e.g., https://example.com/logo.png"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isSubmitting}
            />
            <p className="mt-1 text-xs text-gray-500">
              Paste a link to the app&apos;s logo. Leave empty to auto-fetch the favicon.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the app..."
              rows={3}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              disabled={isSubmitting}
            />
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-3">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
        </form>

        {/* Footer */}
        <div id="add-app-footer" className="p-6 border-t border-gray-800">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setMode('select');
                setName('');
                setUrl('');
                setIcon('');
                setDescription('');
              }}
              className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add App'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
