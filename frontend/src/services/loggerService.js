/**
 * Centralized logging service - Replaces console.log everywhere
 * Can be easily connected to external logging services
 */
class LoggerService {
  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  /**
   * Log debug message
   */
  debug(message, data = null) {
    if (this.isDevelopment) {
      console.debug(`[DEBUG] ${message}`, data);
    }
    // Send to logging service in production
    // this.sendToLoggingService('DEBUG', message, data);
  }

  /**
   * Log info message
   */
  info(message, data = null) {
    console.info(`[INFO] ${message}`, data);
    // this.sendToLoggingService('INFO', message, data);
  }

  /**
   * Log warning message
   */
  warn(message, data = null) {
    console.warn(`[WARN] ${message}`, data);
    // this.sendToLoggingService('WARN', message, data);
  }

  /**
   * Log error message
   */
  error(message, error = null) {
    console.error(`[ERROR] ${message}`, error);
    // this.sendToLoggingService('ERROR', message, error);
  }

  /**
   * Log API response
   */
  logAPIResponse(method, url, status, duration, data = null) {
    const logMessage = `[API] ${method.toUpperCase()} ${url} - ${status} (${duration}ms)`;
    if (status >= 400) {
      this.warn(logMessage, data);
    } else if (this.isDevelopment) {
      this.debug(logMessage);
    }
  }

  /**
   * Log API error
   */
  logAPIError(method, url, error) {
    const status = error.response?.status || 'UNKNOWN';
    const message = error.response?.data?.message || error.message;
    this.error(`[API] ${method.toUpperCase()} ${url} - ${status} - ${message}`, error);
  }

  /**
   * Method to send logs to external service
   * Can be implemented later with your logging provider (e.g., Sentry, DataDog, etc.)
   */
  sendToLoggingService(level, message, data) {
    // TODO: Implement external logging service
    // Example: Sentry.captureMessage(message, level);
  }

  /**
   * Group related logs
   */
  group(groupName, callback) {
    if (this.isDevelopment) {
      console.group(groupName);
      callback();
      console.groupEnd();
    } else {
      callback();
    }
  }
}

export default new LoggerService();
