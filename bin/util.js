// @ts-nocheck
const chalk = require('chalk'); // 命令行输出美化

export const validateArgsLen = (argvLen, maxArgvLens) => {
  if (argvLen > maxArgvLens) {
    console.log(
      chalk.yellow(
        '\n Info: You provided more than argument. the rest are ignored.'
      )
    )
  }
};