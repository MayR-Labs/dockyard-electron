type LogLevel = 'log' | 'warn' | 'error';

const isDevEnvironment = (): boolean => process.env.NODE_ENV !== 'production';

const output = (level: LogLevel, args: unknown[]) => {
  if (!isDevEnvironment()) return;

  const normalizedArgs = args.length > 0 ? args : [''];
  // eslint-disable-next-line no-console -- routed through debug helper
  console[level]('[Dockyard]', ...normalizedArgs);
};

export const debugLog = (...args: unknown[]) => output('log', args);
export const debugWarn = (...args: unknown[]) => output('warn', args);
export const debugError = (...args: unknown[]) => output('error', args);
