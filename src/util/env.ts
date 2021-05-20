const LRU = require('lru-cache'); // 在内存中管理缓存数据
const {
  execSync
} = require('child_process');

const _projectGit = new LRU({
  max: 10, // 缓存大小
  maxAge: 1000 // 缓存过期时间
});
let _hasGit: any;

/**
 * 测试是否安装了git
 * @returns 
 */
export const hasGit = () => {
  if (_hasGit) {
    return _hasGit;
  }
  try {
    execSync('git --version', {
      stdio: 'ignore' // { stdio: 'ignore' } 默认情况下， stdin、 stdout 和 stderr 的管道会在父 Node.js 进程和衍生的子进程之间建立。 这些管道具有有限的（且平台特定的）容量。 如果子进程写入 stdout 时超出该限制且没有捕获输出，则子进程会阻塞并等待管道缓冲区接受更多的数据。 这与 shell 中的管道的行为相同。 如果不消费输出，则使用 { stdio: 'ignore' } 选项。
    });
    return (_hasGit = true);
  } catch (err) {
    return (_hasGit = false);
  }
}

/**
 * 测试该项目是否已经是一个git repo
 * @param cwd 
 * @returns 
 */
export const hasProjectGit = (cwd: string) => {
  if (_projectGit.has(cwd)) {
    return _projectGit.get(cwd);
  }
  let result;
  try {
    execSync('git status', {
      stdio: 'ignore'
    }, cwd);
    result = true;
  } catch (error) {
    result = false;
  }
  _projectGit.set(cwd, result);
  return result;
}