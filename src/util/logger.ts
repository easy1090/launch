const chalk = require('chalk');
const readline = require('readline');
const EventEmitter = require('events');
const padStart = String.prototype.padStart;

const chalkTag = (msg: null) => chalk.bgBlackBright.white.dim(` ${msg} `);

function _log(type: string, tag: null, message: string | undefined) {
  if (message) {
    exports.events.emit('log', {
      message,
      type,
      tag
    });
  }
}

const format = (label: any, msg: string) => {
  return msg.split('\n').map((line: string, i: number) => {
    return i === 0
      ? `${label} ${line}`
      : padStart(Number(line), chalk.reset(label).length); // 对齐
  });
};

export const events = new EventEmitter();

export const clearConsole = (title: string) => {
  if (process.stdout.isTTY) {
    // 判断是否在终端环境
    const blank = '\n'.repeat(process.stdout.rows);
    console.log(blank);
    // 在终端移动光标到标准输出流的起始坐标位置, 然后清除给定的TTY流
    readline.cursorTo(process.stdout, 0, 0);
    readline.clearScreenDown(process.stdout);
    if (title) {
      console.log(title);
    }
  }
};

export const warn = (msg: any, tag = null) => {
  console.warn(
    format(
      chalk.bgYellow.black(' WARN ') + (tag ? chalkTag(tag) : ''),
      chalk.yellow(msg)
    )
  );
  _log('warn', tag, msg);
};

export const error = (msg: { stack: any; }, tag = null) => {
  console.error(
    format(chalk.bgRed(' ERROR ') + (tag ? chalkTag(tag) : ''), chalk.red(msg))
  );
  _log('error', tag, JSON.stringify(msg));
  if (msg instanceof Error) {
    console.error(msg.stack);
    _log('error', tag, msg.stack);
  }
};

export const log = (msg = '', tag = null) => {
  tag ? console.log(format(chalkTag(tag), msg)) : console.log(msg);
  _log('log', tag, msg);
};

export const info = (msg: any, tag = null) => {
  console.log(
    format(chalk.bgBlue.black(' INFO ') + (tag ? chalkTag(tag) : ''), msg)
  );
  _log('info', tag, msg);
};
