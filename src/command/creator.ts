const EventEmitter = require('events');
const execa = require('execa'); // 一个child_process封装库
import chalk from 'chalk';
// import { readTemplateJson } from '../util/readTemplateData';
import { hasGit, hasProjectGit } from '../util/env';
import { clearConsoleWithTitle } from '../util/clearConsole';
import  { log } from '../util/logger';

export class Creator extends EventEmitter {
  constructor(name: any, context: any) {
    super();
    this.name = name;
    this.context = context;
    process.env.LAUNCH_CONTEXT = context;
  }

  async create(cliOptions = {}) {
    const { context } = this;
    // const templateGitRepoJson = readTemplateJson();
    // const gitRepoUrl = templateGitRepoJson[process.env.LAUNCH_TEMPLATE_NAME];
    // let tmpdir;
    await clearConsoleWithTitle(true);
    log(`✨ Creating project in ${chalk.yellow(context)}.`);
    log();
    
  }

  run(command: string, args: string[] | undefined) {
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