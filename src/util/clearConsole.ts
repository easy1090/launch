import chalk from 'chalk';
import * as semver from 'semver';
import { clearConsole } from './logger';
import { getVersions } from './getVersions';

export const generateTitle = async function (checkUpdate: any) {
  const { current, latest } = await getVersions(); 
  let title = chalk.bold.blue(`LAUNCH CLI v${current}`);
  if (checkUpdate && semver.gt(latest, current)) {
    title += chalk.green(`
    ┌────────────────────${`─`.repeat(latest.length)}──┐
    │  Update available: ${latest}  │
    └────────────────────${`─`.repeat(latest.length)}──┘`);
  }

  return title;
}

export const clearConsoleWithTitle = async function (checkUpdate?: any) {
  const title = await generateTitle(checkUpdate);
  clearConsole(title);
}