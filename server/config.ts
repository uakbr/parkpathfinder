/**
 * Centralized configuration for environment variables
 * All environment variable access should go through this module
 */

export const config = {
  // Server configuration
  port: Number(process.env.PORT ?? 5000),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // API Keys (optional - will gracefully degrade if missing)
  openaiKey: process.env.OPENAI_API_KEY || null,
  openWeatherKey: process.env.OPENWEATHER_API_KEY || null,
  
  // Feature flags
  logResponseBody: process.env.LOG_RESP_BODY === '1' || process.env.LOG_RESP_BODY === 'true',
  
  // Database (only used for Drizzle CLI, not runtime)
  databaseUrl: process.env.DATABASE_URL || null,
} as const;

/**
 * Validate configuration on startup
 * Logs warnings for missing optional configuration
 */
export function validateConfig(): void {
  if (!config.openaiKey) {
    console.warn('Warning: OPENAI_API_KEY not set. AI features will use fallback responses.');
  }
  
  if (!config.openWeatherKey) {
    console.warn('Warning: OPENWEATHER_API_KEY not set. Weather features will return placeholder data.');
  }
  
  console.log(`Server configuration:
  - Node Environment: ${config.nodeEnv}
  - Port: ${config.port}
  - OpenAI: ${config.openaiKey ? 'configured' : 'not configured'}
  - OpenWeather: ${config.openWeatherKey ? 'configured' : 'not configured'}
  - Response Body Logging: ${config.logResponseBody ? 'enabled' : 'disabled'}
  `);
}
