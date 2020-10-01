import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import log from 'updatable-log';

interface InitParams {
  rootDir: string;
  isExtendedConfig: boolean;
  projectRoot?: string;
}

function createRelativeDefaultConfig(from: string | null = null, to: string | null = null) {
  const defaultExtends = '../typescript/tsconfig.base.json';
  const extendsConfig = (from && to && path.relative(from, to)) || defaultExtends;

  return `{
    "extends": "${extendsConfig}",
    "include": [".", "../typescript/types"]
  }
  `;
}

export default function init({ rootDir, isExtendedConfig = false, projectRoot = '' }: InitParams) {
  if (!fs.existsSync(rootDir)) {
    log.error(`${rootDir} does not exist`);
    return;
  }

  const configFile = path.resolve(rootDir, 'tsconfig.json');
  if (fs.existsSync(configFile)) {
    log.info(`Config file already exists at ${configFile}`);
    return;
  }

  if (isExtendedConfig) {
    const config = createRelativeDefaultConfig(rootDir, projectRoot);
    fs.writeFileSync(configFile, config);
  } else {
    execSync('npx tsc --init', { cwd: rootDir });
  }

  log.info(`Config file created at ${configFile}`);
}
