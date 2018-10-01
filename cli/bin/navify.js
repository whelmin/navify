#!/usr/bin/env node

const program = require('commander'); // 引用commander
const fse = require('fs-extra');
const connect = require('connect'); // http server
const livereload = require('connect-livereload');
const lrserver = require('livereload'); // livereload
const serveStatic = require('serve-static');
const opn = require('opn');
const chalk = require('chalk'); // colors

const { resolve, pwd, exists } = require('../lib/util'); // util

// http服务端口号
const httpPort = 8520;
// livereload服务端口号
const livereloadPort = 35729;

console.log('');

program
    .version(require(resolve('../package.json')).version);

program
    .command('create <dir>')
    .description(chalk.gray('  创建并初始化项目 <dir>:项目名'))
    .action(dir => {
        exists(pwd(dir)).then(isExists => {
            if (!isExists) { // 目录不存在
                // 初始化 (拷贝 template/* 到 项目目录下)
                fse.copy(resolve('./template/'), pwd(`./${dir}/`))
                    .then(() => {
                        console.log('创建 ' + chalk.blue(dir) + ' 目录成功');
                        console.log('进入 ' + chalk.blue(dir) + ' 目录并开启本地预览:\n');
                        console.log(chalk.green(`  $ cd ${dir} && navify serve`));
                    })
                    .catch(err => console.error(err));
            } else {
                console.error('目录 ' + chalk.red(dir) + ' 已存在\n');
                process.exit(0);
            }
        })
    });

program
    .command('serve')
    .description(chalk.gray('  开启本地预览'))
    .action(() => {
        const JSONFile = pwd('./nav.json');
        exists(JSONFile).then(isExists => { // 判断当前目录是否存在nav.json
            if (!isExists) {
                console.error('当前目录非 Navify 项目，请执行 navify create <dir> 进行创建\n');
                process.exit(0);
            } else {
                let server = connect();
                server.use(livereload({
                    port: livereloadPort,
                }));
                const webRoot = pwd();
                server.use(serveStatic(webRoot, {
                    index: ['index.html', 'index.htm', 'index.php'],
                }));
                server.listen(httpPort);
                lrserver.createServer({
                    extraExts: ['json'], // 额外需要监听的文件扩展名
                    port: livereloadPort
                }).watch(webRoot);

                opn(`http://localhost:${httpPort}`);

                const msg = 'Listening at ' + chalk.green.underline(`http://localhost:${httpPort}`) + '\n';
                console.log(msg);
            }
        });
    });

program
    .on('--help', () => {
        console.log('\nExamples: \n');
        console.log('  $ navify create nav ', chalk.gray('初始化'));
        console.log('  $ navify serve      ', chalk.gray('本地预览'), '\n');
    });

program.parse(process.argv);
