declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_HOST: string;
      DB_PORT: string;
      DB_NAME: string;
      DB_USER: string;
      DB_PASS: string;
      PORT: string;
      JWT_SECRET: string;
    }
  }
}