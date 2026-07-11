/**
 * Logger utility for development and production
 */

const isDev = import.meta.env.DEV;

type LogLevel = 'log' | 'warn' | 'error' | 'info';

const logWithStyle = (level: LogLevel, message: string, data?: any) => {
  const styles = {
    log: 'color: #0f766e;',
    info: 'color: #0369a1;',
    warn: 'color: #d97706;',
    error: 'color: #dc2626;',
  };

  const timestamp = new Date().toLocaleTimeString();
  const prefix = `[${timestamp}] [PINNA]`;

  if (isDev) {
    console.log(`%c${prefix}`, styles[level], message, data || '');
  } else {
    // In production, only log errors
    if (level === 'error') {
      console.error(`${prefix} ${message}`, data);
    }
  }
};

export const logger = {
  log: (message: string, data?: any) => logWithStyle('log', message, data),
  info: (message: string, data?: any) => logWithStyle('info', message, data),
  warn: (message: string, data?: any) => logWithStyle('warn', message, data),
  error: (message: string, data?: any) => logWithStyle('error', message, data),

  /**
   * Log API calls
   */
  api: (method: string, url: string, status?: number) => {
    const message = `${method.toUpperCase()} ${url}`;
    const level = status && status >= 400 ? 'error' : 'info';
    logWithStyle(level as LogLevel, message, { status });
  },

  /**
   * Log performance metrics
   */
  performance: (label: string, duration: number) => {
    logWithStyle('log', `⏱️  ${label}`, `${duration.toFixed(2)}ms`);
  },
};

/**
 * Performance monitoring
 */
export const performanceMonitor = {
  start: (label: string) => {
    if (isDev) {
      performance.mark(`${label}-start`);
    }
  },

  end: (label: string) => {
    if (isDev) {
      performance.mark(`${label}-end`);
      try {
        performance.measure(label, `${label}-start`, `${label}-end`);
        const measure = performance.getEntriesByName(label)[0];
        logger.performance(label, (measure as PerformanceMeasure).duration);
      } catch {
        // Ignore errors
      }
    }
  },
};
