import { defineConfig } from "umi";

const { serverConfig } = require('./server.config');
const config = serverConfig[process.env.APP_ENV || 'Hongkong'];
const { outputPath } = config;

const baseUrl =  "http://studypc.bahasaindo.net";

//配置文件，包含 Umi 所有非运行时配置
export default defineConfig({
  title: "东东印尼语",
  npmClient: 'yarn',
  outputPath,
  history: { type: 'hash' },
  hash: true,  //让 build 之后的产物包含 hash 后缀, 避免浏览器加载缓存
  mock: false, //关闭 Mock 功能
  clientLoader: {}, //路由数据预加载
  theme: {
    '@primary-color': '#1DA57A'
  },
  proxy: {
    //备用环境
    '/prod-api': {
      'target': baseUrl + '/prod-api/',
      'changeOrigin': true,
      'pathRewrite': { '^/prod-api' : '' },
    },
  },
  routes: [
    { path: "/", component: "home" },
    { path: "/home", component: "home" },
    { path: "/login", component: "login", name: "Selamat datang 欢迎" },
    { path: "/courseCatalog", component: "courseCatalog", name: "课程分类" },
    { path: "/courseList", component: "courseList", name: "课程目录" },
    { path: "/confidentiality", component: "confidentiality", name: "保密协议" },
    { path: "/courseDetail", component: "courseDetail", name: "课程查看" },
    // { path: "/setting", component: "setting", name: "设置" },
    { path: "/doExercises", component: "doExercises", name: "习题练习" },
    // { path: "/aboutUs", component: "aboutUs", name: "关于我们" },
    // { path: "/peopleNearby", component: "peopleNearby", name: "附近的人" },
  ],
  alias: {},
  links: [
    {
      rel: "stylesheet",
      type: "text/css",
      href: 'https://g.alicdn.com/apsara-media-box/imp-web-player/2.16.3/skins/default/aliplayer-min.css'
    },
  ],
  headScripts: [
    'https://g.alicdn.com/apsara-media-box/imp-web-player/2.16.3/aliplayer-h5-min.js',
    { src: '/lib/aliplayercomponents-1.0.9.min.js' },
  ],
  plugins: ['@umijs/plugins/dist/dva', "umi-plugin-electron-builder"],
  dva: {},
  electronBuilder: {
    builderOptions: {
      productName: '东东印尼语学习系统',  //应用安装完成后显示的应用名称
      win: {
        //windows系统相关打包配置
        icon: `public/image/client_icon.png`,
        artifactName: '${productName}-${platform}-${arch}-${version}.${ext}',
        target: [
          {
            // 打包成一个独立的 exe 安装程序
            target: 'nsis',
            // 这个意思是打出来32 bit + 64 bit的包，但是要注意：这样打包出来的安装包体积比较大，所以建议直接打32的安装包。
            arch: [
              // 'x64',
              'ia32'
            ]
          }
        ],
      },
      nsis: {
        //window安装程序配置
        oneClick: false, //是否一键安装
        allowToChangeInstallationDirectory: true, //是否允许修改安装目录
        // installerIcon: `public/image/client_icon.ico`, //安装图标
        // uninstallerIcon: `public/image/client_icon.ico`, //卸载图标
        // installerHeaderIcon: `public/image/client_icon.ico`, //安装时头部图标
        createDesktopShortcut: true, //是否创建桌面图标
        createStartMenuShortcut: true, //是否创建开始菜单图标
        // shortcutName: '东东印尼语学习系统' //图标名称
        deleteAppDataOnUninstall: true,  // 卸载时删除用户数据
      },
      mac: {
        //macOS系统相关打包配置
        // 应用程序图标
        icon: `public/image/client_icon.png`,
        // 应用程序包名
        artifactName: '${productName}-${platform}-${arch}-${version}.${ext}',
        target: [ // 要打的包的格式类型设置
          'dmg',
          'zip' // 这里注意更新的时候，mac只认zip格式的包
        ],
      },
      dmg: {
        //mac安装程序配置
        background: 'public/image/client_icon.png',
        backgroundColor: '#cccccc',
        contents: [
          {
            x: 410,
            y: 190,
            type: 'link',
            path: '/Applications'
          },
          {
            x: 130,
            y: 190,
            type: 'file'
          }
        ],
        window: {
          height: 380,
          width: 540
        },
      },
    },
  },
});
