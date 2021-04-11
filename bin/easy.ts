#!/usr/bin/env node  // 所以配置#!/usr/bin/env node, 就是解决了不同的用户node路径不同的问题，可以让系统动态的去查找node来执行你的脚本文件。

const semver = require('semver'); // npm的语义版本包

function checkNodeVersion(wanted: any, cliName: any) {
    // 检测Node版本是否符合要求范围
    if (!semver.satisfies(process.version, wanted)) {
        console.log(
            chalk.red(
                
            )
        )
    }
}