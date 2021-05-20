import * as ora from 'ora' ; // 美化终端交互
import * as chalk from 'chalk' ;

const spinner = ora();

let lastMsg: { symbol: any; text: any; } | null = null;

export const logWithSpinner = (symbol: string, msg: string) => {
  if (!msg) {
    msg = symbol;
    symbol = chalk.default.green('✔');
  }
  if (lastMsg) {
    // 清除上次的spinner
    spinner.stopAndPersist({
      symbol: lastMsg.symbol,
      text: lastMsg.text
    });
  }
  spinner.text = ' ' + msg;
  lastMsg = {
    symbol: symbol + ' ',
    text: msg
  };
  spinner.start();
};

export const stopSpinner = (persist?: any) => {
  if (lastMsg && persist !== false) {
    spinner.stopAndPersist({
      symbol: lastMsg.symbol,
      text: lastMsg.text
    });
  } else {
    spinner.stop();
  }
  lastMsg = null;
};

export const pauseSpinner = function() {
  spinner.stop();
};

export const resumeSpinner = function() {
  spinner.start();
};
