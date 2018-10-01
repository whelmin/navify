const fse = require('fs-extra');
const path = require('path');

// 相对路径 解析成 绝对路径
exports.resolve = (...dir) => path.resolve(path.join(__dirname, '../'), ...dir);
// 当前目录
exports.pwd = dir => path.resolve(process.cwd(), dir || '.');
// 判断文件是否存在
exports.exists = dir => fse.pathExists(dir);
