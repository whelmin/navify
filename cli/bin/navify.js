#!/usr/bin/env node

// require commander, https://www.npmjs.com/package/commander
const program = require('commander');
const fse = require('fs-extra');
// connect create http server
const connect = require('connect');
const livereload = require('connect-livereload');
// livereload
const lrserver = require('livereload');
const serveStatic = require('serve-static');
const opn = require('opn');
const chalk = require('chalk');
// util
const { resolve, pwd, exists } = require('../lib/util');

// set http server port
const httpPort = 8520;
// set livereload port
const livereloadPort = 35729;

program.version(require(resolve('../package.json')).version);

// define $ create commander
program
  .command('create <dir>')
  .alias('c')
  .description(chalk.gray('创建并初始化项目 <dir>:项目名'))
  .action(dir => {
    exists(pwd(dir)).then(isExists => {
      if (!isExists) {
        fse
          .copy(resolve('./template/'), pwd(`./${dir}/`))
          .then(() => {
            console.log(`创建 ${chalk.blue(dir)} 目录成功`);
            console.log(`进入 ${chalk.blue(dir)} 目录并开启本地预览:\n`);
            console.log(chalk.green(`$ cd ${dir} && navify serve`));
          })
          .catch(err => console.error(err));
      } else {
        console.error('目录 ' + chalk.red(dir) + ' 已存在\n');
        process.exit(0);
      }
    });
  });

// define $ serve commander
program
  .command('serve')
  .alias('s')
  .description(chalk.gray('开启本地预览'))
  .action(() => {
    const JSONFile = pwd('./nav.json');
    exists(JSONFile).then(isExists => {
      if (!isExists) {
        console.error(`当前目录非 Navify 项目，请执行命令 ${chalk.blue('navify create <dir>')} 进行创建\n`);
        process.exit(0);
      } else {
        let server = connect();
        server.use(
          livereload({
            port: livereloadPort,
          }),
        );
        const webRoot = pwd();
        server.use(
          serveStatic(webRoot, {
            index: ['index.html', 'index.htm', 'index.php'],
          }),
        );
        server.listen(httpPort);
        lrserver
          .createServer({
            extraExts: ['json'], // 额外需要监听的文件扩展名
            port: livereloadPort,
          })
          .watch(webRoot);

        opn(`http://localhost:${httpPort}`);

        const msg = 'Listening at ' + chalk.green.underline(`http://localhost:${httpPort}`) + '\n';
        console.log(msg);
      }
    });
  });

program.on('--help', () => {
  console.log('\nExamples: \n');
  console.log('  $ navify create <dir>      ', chalk.gray('创建并初始化一个 <dir> Navify项目目录'));
  console.log('  $ navify serve             ', chalk.gray('开启本地预览'), '\n');
});

program.parse(process.argv);
