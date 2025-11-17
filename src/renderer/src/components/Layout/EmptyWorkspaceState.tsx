/**
 * Empty Workspace State
 * Renders a beautiful placeholder when no app is selected
 */

import { App } from '../../../../shared/types/app';

interface EmptyWorkspaceStateProps {
  apps: App[];
  onSelectApp: (appId: string) => void;
  onAddCustomApp?: () => void;
}

export function EmptyWorkspaceState({
  apps,
  onSelectApp,
  onAddCustomApp,
}: EmptyWorkspaceStateProps) {
  const spotlightApps = apps.slice(0, 4);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-gray-950 via-gray-900 to-gray-900 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-indigo-600/20 blur-3xl" />
        <div className="absolute top-1/3 -right-10 w-80 h-80 bg-purple-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/10 blur-[160px]" />
      </div>

      <div className="relative z-10 max-w-3xl w-full px-8 py-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-white/10 bg-white/5 text-xs uppercase tracking-[0.2em] text-gray-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Workspace ready
        </div>

        <h2 className="mt-6 text-4xl font-semibold text-white">
          Select an app to light up this workspace
        </h2>
        <p className="mt-4 text-base text-gray-300 max-w-2xl mx-auto">
          Your workspace is standing by. Choose one of your installed apps to instantly bring this
          canvas to life, or add something new if inspiration strikes.
        </p>

        {spotlightApps.length > 0 && (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {spotlightApps.map((app) => (
              <button
                key={app.id}
                onClick={() => onSelectApp(app.id)}
                className="group flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm text-left transition hover:border-indigo-400/70 hover:bg-indigo-500/10"
              >
                {app.icon ? (
                  <img src={app.icon} alt={app.name} className="w-10 h-10 rounded-xl shadow-lg" />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/50 flex items-center justify-center text-gray-100 font-semibold">
                    {app.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-white">{app.name}</p>
                  <p className="text-xs text-gray-300">Tap to jump in</p>
                </div>
                <span className="ml-auto text-indigo-300 text-xs opacity-0 group-hover:opacity-100 transition">
                  Activate
                </span>
              </button>
            ))}
          </div>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-sm">
          {onAddCustomApp && (
            <button
              onClick={onAddCustomApp}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 text-white border border-white/20 hover:border-white/40 transition"
            >
              <span className="w-2 h-2 rounded-full bg-white" />
              Add new app
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
