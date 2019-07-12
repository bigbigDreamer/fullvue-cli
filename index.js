#!/usr/bin/env node
//命令行工具
const commander  = require('commander');
//自动clone github 仓库
const download = require('download-git-repo');
//命令行答询
const inquirer = require('inquirer');
//修改package.json
const handlebars = require('handlebars');
//显示加载状态
const ora = require('ora');
//控制命令行输出的颜色
const chalk = require('chalk');
//控制命令行符号
const logSym = require('log-symbols');
//文件系统
const fs = require('fs');


//cli源模板
const template = {
    url: 'https://github.com/bigbigDreamer/fullvue',
    //注意了，这里不要被干扰了，这里的url地址格式是：https://github.com:owner/仓库名
    downloadUrl: 'https://github.com:bigbigDreamer/fullvue',
    description: 'fullvue scaffolding test template'
};

const TipList = [
    //项目名
    {
        type: 'input',
        name: 'name',
        message: 'Please enter a project name:',
        default: 'vue'
    },
    //项目描述
    {
        type: 'input',
        name: 'description',
        message: 'Please enter a project description:',
        default: `This is a project`
    },
    //作者名
    {
        type: 'input',
        name: 'author',
        message: 'Please enter the author name:',
        default: ''
    },
    //项目协议
    {
        type: 'input',
        name: 'license',
        message: 'Please enter the license:',
        default: 'MIT'
    },
];

//通过执行  fullvue -v/-V/--version 获取版本号
commander.version('1.0.0');


//设计命令行参数
commander
    .command('create <project>')
    .description('Initialize project template~~~')
    .action((projectName) => {
        const spinner = ora('Downloading template...').start();
        setTimeout(() => {
            spinner.color = 'yellow';
            spinner.text = 'please wait patiently for a while';
        }, 1000);
        const {downloadUrl} = template;
        //第一个参数是github仓库地址，第二个参数是创建的项目目录名，第三个参数是clone
        download(downloadUrl, projectName,  err => {
            if (err) {
                spinner.fail('Project template download failed!');
            } else {
                // console.log('下载模板成功');
                spinner.succeed('Project template downloaded successfully!');
                //命令行答询
                inquirer.prompt(TipList).then(answers => {
                    //根据命令行答询结果修改package.json文件
                    let content = fs.readFileSync(`${projectName}/package.json`, 'utf8');
                    let packageResult = handlebars.compile(content)(answers);
                    fs.writeFileSync(`${projectName}/package.json`, packageResult);
                    //用chalk和log-symbols改变命令行输出样式
                    console.log(logSym.success, chalk.green('project document preparation is successful~~~'));
                    console.log(logSym.info, chalk.greenBright('I hope you have a good time. My personal email address is: vuejs@vip.qq.com. If you have any questions, please contact me directly!'));
                });
            }
        });
    });

//解析命令
commander.parse(process.argv);


