declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CLIENT_ID: string;
      BOT_TOKEN: string;
      WEB_SSL_PRIVKEY: string;
      WEB_SSL_CERT: string;
      GITHUB_WEBHOOK_SECRET: string;
      DATABASE_URL: string;
      LOGGER_GUILD: string;
      LOGGER_CHANNEL: string;
      LOGGER_IGNORE: string;
    }
  }
}

export {}
