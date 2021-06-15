import chalk from "chalk";
import { program } from "commander";
import * as path from 'path';
import * as fs from 'fs';
const inquirer = require('inquirer');
const exec = require('child_process').exec;
import { readTemplateJson } from '../util/readTemplateData';
import * as validateProjectName from 'validate-npm-package-name';
import { clearConsoleWithTitle } from '../util/clearConsole';
import { pauseSpinner } from "../util/spinner";
import Creator from './creator';

async function create (templateName: any, projectName: any, options: any) {
  const templateGitRepoJson = readTemplateJson();
  if (!templateGitRepoJson[templateName]) {
    console.log(`  ` + chalk.red(`Unknown template name ${templateName}.`));
    program.outputHelp();
    return;
  }

  const cwd = process.cwd();
  const inCurrentDir = projectName === '.';
  // 获取项目名(当前目录 or 指定的项目名)
  const name = inCurrentDir ? path.relative('../', cwd) : projectName;// path.relative() 方法根据当前工作目录返回 from 到 to 的相对路径。 如果 from 和 to 各自解析到相同的路径（分别调用 path.resolve() 之后），则返回零长度的字符串。
  const targetDir = path.resolve(cwd, projectName);
  const validateResult = validateProjectName(name);
  if (!validateResult.validForNewPackages) {
    console.error(chalk.red(`Invalid project name: "${name}"`));
    validateResult.errors && 
      validateResult.errors.forEach((error: any) => {
        console.error(chalk.red.dim(`Error: ${error}`));
      });

    validateResult.warnings &&
    validateResult.warnings.forEach((warn: any) => {
      console.error(chalk.red.dim(`Warning: ${warn}`));
    });
    process.exit(1);
  }

  if (fs.existsSync(targetDir)) {
    // 目录存在有两种情况: 1. 当前目录创建 2. 确实存在同名目录
    await clearConsoleWithTitle();

    if (inCurrentDir) {
      const { ok } = await inquirer.prompt([
        {
          name: 'ok',
          type: 'confirm',
          message: `Generate project in current directory?`
        }
      ]);
      if(!ok) {
        return;
      }
    } else {
      // 待创建目录已经存在
      const { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: `Target directory ${chalk.cyan(targetDir)}
            already exists. Pick an action:`,
          choices: [
            { name: 'Overwrite', value: 'overwrite' },
            {
              name: 'Merge',
              value: 'merge'
            },
            {
              name: 'Cancel',
              value: false
            }
          ]
        }
      ]);
      if (!action) {
        return;
      } else if (action === 'overwrite') {
        console.log(`\nRemoving ${chalk.cyan(targetDir)}...`);
        await exec(`rm -rf ${targetDir}`);
      }
    }
  }

  // 目录不存在
  process.env.LAUNCH_TEMPLATE_NAME = templateName;
  const creator = new Creator(name, targetDir);
  await creator.create(options);
};

export default (templateName: any, projectName: any, ...args: any) => {
  return create(templateName, projectName, args).catch(err => {
    pauseSpinner();
    console.error(err);
    process.exit(1);
  });
};