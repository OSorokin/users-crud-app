export const MODE = {
  local: 'local',
  qa: 'qa',
  staging: 'staging',
  production: 'production',
  test: 'test',
  migrations: 'migrations'
};

const POSSIBLE_ENVIRONMENTS: string[] = [
  MODE.local,
  MODE.qa,
  MODE.staging,
  MODE.production
];

export function throwExceptionIfInvalidEnv() {
  if (POSSIBLE_ENVIRONMENTS.indexOf(process.env.mode) === -1) {
    throw new Error('Environment variable mode must be in array: ' + POSSIBLE_ENVIRONMENTS);
  }
}
