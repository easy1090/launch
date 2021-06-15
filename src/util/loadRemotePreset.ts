import * as fs from 'fs-extra';
const download = require('download-git-repo');
const os = require('os');
const path = require('path');

export const fetchRemotePreset = async function (name: string, clone = false) {
  const tmpdir = path.resolve(os.tmpdir(), 'launch'); // os.tmpdir()以字符串的形式返回操作系统的默认临时文件目录
  if (clone) {
    await fs.remove(tmpdir);
  }
  return new Promise((resolve, reject) => {
    download(name, tmpdir, { clone }, (err: any) => {
      if (err) {
        return reject(err);
      }
      return resolve(tmpdir);
    });
  })
}