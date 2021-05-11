#!/usr/bin/env node  
// 所以配置#!/usr/bin/env node, 就是解决了不同的用户node路径不同的问题，可以让系统动态的去查找node来执行你的脚本文件。

const semver = require('semver'); // npm的语义版本包
const program = require('commander'); // 命令行工具
const chalk = require('chalk'); // 命令行输出美化
const requiredNodeVersion = require('../package.json').engines.node;
const { validateArgsLen } = require('./util');

/**
 * @param {string | semver.Range} wanted
 * @param {string} cliName
 */
function checkNodeVersion(wanted, cliName) {
    console.log('ddd')
    // 检测Node版本是否符合要求范围
    if (!semver.satisfies(process.version, wanted)) {
        console.log(
            // @ts-ignore
            chalk.red(
                'You are using Node ' +
                process.version +
                ', but this version of ' +
                cliName +
                ' requires Node ' +
                wanted +
                '.\nPlease upgrade your Node version.'   
            )
        )
          // 退出进程
    process.exit(1);
    }
}
console.log(requiredNodeVersion);
// 检测node版本
checkNodeVersion(requiredNodeVersion, '@easy/cli');

program
  .version(require('../package.json').version, '-v, --version') // 版本
  .usage('<command> [options]'); // 使用信息

program
.command('list')
.description('显示所有模板')


// 初始化项目模板
program
  .command('create <template-name> <project-name>')
  .description('create a new project from a template')
  .action((templateName, projectName, cmd) => {
    // 输入参数校验
    validateArgsLen(process.argv.length, 5);
    require('../src/command/easy-create')(lowercase(templateName), projectName);
  });

  
program
.command('delete')
//    .alias('d')
.description('删除模板')

/**
 * @param {string} str
 */
function lowercase(str) {
    return str.toLocaleLowerCase();
  }