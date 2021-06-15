const EventEmitter = require('events');
const execa = require('execa'); // 一个child_process封装库
import chalk from 'chalk';
import { exit } from 'process';
const fs = require('fs-extra');

import { readTemplateJson } from '../util/readTemplateData';
import { hasGit, hasProjectGit } from '../util/env';
import { clearConsoleWithTitle } from '../util/clearConsole';
import  { error, warn, log } from '../util/logger';
import { stopSpinner } from '../util/spinner';
import { logWithSpinner } from '../util/spinner';
import { fetchRemotePreset } from '../util/loadRemotePreset';

export default class Creator extends EventEmitter {
  constructor(name: any, context: any) {
    super();
    console.log('name', name, 'context', context)
    this.name = name;
    this.context = context;
    process.env.LAUNCH_CONTEXT = context;
  }

  async create(cliOptions = {}) {
    const { name, context } = this; // 对应create(name, targetDir)
    const templateGitRepoJson = readTemplateJson();
    const gitRepoUrl = templateGitRepoJson && process.env.LAUNCH_TEMPLATE_NAME && templateGitRepoJson[process.env.LAUNCH_TEMPLATE_NAME];
    if (!gitRepoUrl) {
      error(`Failed get Git repo Url ${chalk.cyan(gitRepoUrl)}:`);
      exit(1);
    }
    let tmpdir;
    await clearConsoleWithTitle(true);
    log(`✨ Creating project in ${chalk.yellow(context)}.`);
    log();
    try {
      stopSpinner();
      logWithSpinner(
        `⠋`,
        `Download project template. This might take a while...`
      )
      tmpdir = await fetchRemotePreset(gitRepoUrl['download']);
    } catch (e) {
      stopSpinner();
      error(`Failed fetching remote git repo ${chalk.cyan(gitRepoUrl)}:`);
      throw e;
    }

    // 拷贝到项目文件下
    try {
      fs.copySync(tmpdir, context);
    } catch (e) {
      return console.error(chalk.red.dim(`Error: ${e}`));
    }

    const shouldInitGit = this.shouldInitGit();
    if (shouldInitGit) {
      stopSpinner();
      log();
      logWithSpinner(`🗃`, `Initializing git repository...`);
      this.emit('creation', { event: 'git-init' }); // TODO::: ??
      // 执行git init
      await this.run('git init');
    }
    

    // commit init state
    let gitCommitFailed = false;
    if (shouldInitGit) {
      await this.run('git add -A');
      try {
        await this.run('git', ['commit', '-m', 'init']);
      } catch (error) {
        gitCommitFailed = true;
      }
    }
  
    stopSpinner();
    log();
    log(`🎉  Successfully created project ${chalk.yellow(name)}.`);
    log();
    this.emit('creation', { event: 'done' });
    if (gitCommitFailed) {
      // commit fail
      warn(
        `Skipped git commit due to missing username and email in git config.\n` +
          `You will need to perform the initial commit yourself.\n`
      );
    }
  }

  run(command: string, args?: string[] | undefined) {
    if (!args) {
      [command, ...args] = command.split(/\s+/);
    }
    return execa(command, args, { cwd: this.context });
  }

  shouldInitGit() {
    if (!hasGit) {
      return false;
    }
    return !hasProjectGit(this.context);
  }
}

// export const creator = (name: any, context: any) => { return new Creator(name, context) }