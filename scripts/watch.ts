// const nsfw = require('nsfw');
import * as execa from 'execa';
import * as glob from 'glob';
import * as path from 'path';
import * as fs from 'fs-extra';

export async function run(command: string) {
  console.log(`[RUN]: ${command}`);
  // eslint-disable-next-line
  return execa.command(command, { stdio: 'inherit' });
}

(async () =>  {
  await run('npm run clean');

  const fileParten = './src/**/!(*.ts|*.tsx)';
  console.log(`[COPY]: ${fileParten}`);

  const cwd = path.join(__dirname, '../');
  const files = glob.sync(fileParten, { cwd, nodir: true });
  console.log('::::::::::::::', files);
  const fileSet = new Set();
  /* eslint no-restricted-syntax:0 */
  for (const file of files) {
    /* eslint no-await-in-loop:0 */
    await copyOneFile(file, cwd);
    fileSet.add(path.join(cwd, file)); // set没有重复的值
  }
  await run('npx tsc --build ./tsconfig.json -w');
})().catch(e => {
  console.trace(e);
  process.exit(128);
});

async function copyOneFile(file: string, cwd: string) {
  const from = path.join(cwd, file);
  console.log(file.replace(/\/src\//, '/lib/src/'))
  const to = path.join(cwd, file.replace(/\/src\//, '/lib/src/'));
  await fs.copy(from, to);
}