import chalk from 'chalk';
import { readTemplateJson } from './util/readTemplateData';
import  { stopSpinner } from './util/spinner';
import { log } from './util/logger';

async function listAllTemplate() {
  const templateGitRepoJson = readTemplateJson();
  for (let key in templateGitRepoJson) {
    stopSpinner();
    log();
    log(
      `➡️  Template name ${chalk.yellow(key)},  Github address ${chalk.yellow(
        templateGitRepoJson[key]['github']
      )}`
    );
    log();
  }
  if (!Object.keys(templateGitRepoJson).length) {
    stopSpinner();
    log();
    log(`💔  No any template.`);
    log();
  }
}

export default () => {
  return listAllTemplate().catch(err => {
    console.error(err);
    process.exit(1);
  });
};
