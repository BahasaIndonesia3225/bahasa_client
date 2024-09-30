import { defineConfig } from '@umijs/max';

const isDevelopment = process.env.NODE_ENV === "development";
console.log(isDevelopment);

export default defineConfig({
  antd: {
    dark: false,
  },
  access: {},
  model: {},
  initialState: {},
  request: {
    dataField: '',
  },
  layout: {
    title: '东东印尼语',
  },
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      name: '登录',
      path: '/login',
      component: './Login',
      menuRender: false,
    },
    {
      name: '课程',
      path: '/course',
      component: './Course',
      menuRender: false,
    },
  ],
  npmClient: 'yarn',
  proxy: {
    //备用环境
    '/business': {
      target: 'http://www.bahasaindo.net/business/',
      changeOrigin: true,
      pathRewrite: { '^/business': '' },
    },
    '/file': {
      target: 'http://www.bahasaindo.net/file/',
      changeOrigin: true,
      pathRewrite: { '^/file': '' },
    },
  },
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
  plugins: ["umi-plugin-electron-builder"],
  electronBuilder: {
    mainSrc: 'src/main', //默认主进程目录
    preloadSrc: 'src/preload', //默认preload目录，可选，不需要可删除
    routerMode: 'hash', //路由 hash或memory,仅electron下有效，推荐使用hash
    outputDir: 'dist_electron', //默认打包目录
    builderOptions: {
      "win": {
        "icon": "./public/logo.ico",
        "target": [{
          "target": "nsis", //利用nsis制作安装程序
          "arch": ["x64"]
        }]
      },
      "mac": {
        "icon": "./public/logo.ico",
      },
      "nsis": {
        "oneClick": false, // 是否一键安装
        "allowElevation": false, // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
        "allowToChangeInstallationDirectory": true, // 允许修改安装目录
        "installerIcon": "./public/logo.ico", // 安装图标
        "uninstallerIcon": "./public/logo.ico", //卸载图标
        "installerHeaderIcon": "./public/logo.ico", // 安装时头部图标
        "createDesktopShortcut": true, // 创建桌面图标
        "createStartMenuShortcut": true, // 创建开始菜单图标
        "shortcutName": "AppDemo", // 图标名称
      },
    }
  }
});
