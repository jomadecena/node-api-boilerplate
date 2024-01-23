const REQUIRED_ENVIRONMENT_VARIABLES = [
  'DB_HOST',
  'DB_PORT',
  'DB_NAME',
  'DB_USER',
  'DB_PASS',
  'PORT',
  'JWT_SECRET'
];

export const validateEnvVars = () => {
  for (const envVar of REQUIRED_ENVIRONMENT_VARIABLES) {
    if (!process.env[envVar]) {
      console.error(`Error: Environment variable ${envVar} is not defined.`);
      process.exit(1);
    }
  }
}