#!/usr/bin/env node

const semver = require('semver'); // npm的语义版本包
const program = require('commander'); // 命令行工具
const chalk = require('chalk'); // 命令行输出美化
const requiredNodeVersion = require('../package.json').engines.node;
const validateArgsLen = require('./util');

/**
 * @param {string | semver.Range} wanted
 * @param {string} cliName
 */
function checkNodeVersion(wanted, cliName) {
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
        console.log('aaaa')
          // 退出进程
    process.exit(1);
    }
}

// 检测node版本
checkNodeVersion(requiredNodeVersion, '@easy/cli');

program
  .version(require('../package.json').version, '-v, --version') // 版本
  .usage('<command> [options]'); // 使用信息

program
.command('list')
.description('list all available project template')
.action(cmd => {
  validateArgsLen(process.argv.length, 3);
  // @ts-ignore
  require('../lib/src/list-template').default();
});

program
.command('delete')
//    .alias('d')
.description('删除模板')
.action((templateName, projectName, cmd) => {
  console.log('')
})


program.parse(process.argv); // 把命令行参数传给commander解析

// 输入easy显示帮助信息
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

// // 初始化项目模板
// program
//   .command('create <template-name> <project-name>')
//   .description('create a new project from a template')
//   .action((templateName, projectName, cmd) => {
//     console.log('')
//     // 输入参数校验
//     validateArgsLen(process.argv.length, 5);
//     require('../src/command/easy-create')(lowercase(templateName), projectName);
//   });

  


// /**
//  * @param {string} str
//  */
// function lowercase(str) {
//     return str.toLocaleLowerCase();
//   }