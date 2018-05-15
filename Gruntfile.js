var grunt = require('grunt');

//进行配置
grunt.config.init({
    pkg: grunt.file.readJSON("package.json"),
    'create-windows-installer': {
        ia32: {
            version: '1.0.0', //版本号
            authors: 'fshang', //作者
            projectUrl: 'http://www.1818lao.com/', //项目官网
            appDirectory: './outApp', //必填，真正要打包的项目目录
            outputDirectory: './Installer', //必填，打包之后的目录
            releasesNotes: 'test tool', //工具描述
            exe: 'electron.exe',
            description: 'test tool 描述',
            owners: 'wo',
            title: 'ttest',
            noMsi: true
        }
    }
});

//加载任务
grunt.loadNpmTasks('grunt-electron-installer');

//设置为默认
grunt.registerTask('default', ['create-windows-installer']);