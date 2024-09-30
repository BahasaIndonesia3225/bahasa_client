# Electron是什么？
Electron是一个使用 JavaScript、HTML 和 CSS 构建桌面应用程序的框架。 嵌入 Chromium 和 Node.js 到 二进制的 Electron 允许您保持一个 JavaScript 代码代码库并创建 在Windows上运行的跨平台应用 macOS和Linux——不需要本地开发 经验。

主进程
每个 Electron 应用都有一个单一的主进程，作为应用程序的入口点。 主进程在 Node.js 环境中运行，这意味着它具有 require 模块和使用所有 Node.js API 的能力。

渲染器进程
每个 Electron 应用都会为每个打开的 BrowserWindow ( 与每个网页嵌入 ) 生成一个单独的渲染器进程。 洽如其名，渲染器负责 渲染 网页内容。 所以实际上，运行于渲染器进程中的代码是须遵照网页标准的 (至少就目前使用的 Chromium 而言是如此) 。

# Umi 是什么？
Umi，中文发音为「乌米」，是可扩展的企业级前端应用框架。Umi 以路由为基础，同时支持配置式路由和约定式路由，保证路由的功能完备，并以此进行功能扩展。然后配以生命周期完善的插件体系，覆盖从源码到构建产物的每个生命周期，支持各种功能扩展和业务需求。
git commit --no-verify --message='打包window、mac配置成功'


# umi-plugin-electron-builder

本插件提供基于umijs的electron的开发及打包，无需修改项目结构，支持混合项目结构和main+renderer项目结构，仅支持 umijs4

混合项目结构示例 <a href="https://github.com/BySlin/umi-plugin-electron-builder/tree/main/examples/demo">点此访问</a>

main+renderer项目结构示例 <a href="https://github.com/BySlin/umi-plugin-electron-builder/tree/main/examples/main%2Brenderer">点此访问</a>

使用混合项目结构时，插件可自动生成项目文件，使用main+renderer项目结构时，请参考示例修改目录结构

<a href="https://www.npmjs.com/package/umi-plugin-electron-builder"><img src="https://img.shields.io/npm/v/umi-plugin-electron-builder.svg?sanitize=true" alt="Version"></a>

[更新日志](https://github.com/BySlin/umi-plugin-electron-builder/blob/main/CHANGELOG.md)

[umi3请使用2.x版本插件，点此访问](https://github.com/BySlin/umi-plugin-electron-builder/tree/2.x)

## 安装

```shell
$ yarn add umi-plugin-electron-builder --dev
```

umi4需要手动启用插件

```typescript
import { defineConfig } from "umi";

export default defineConfig({
  npmClient: "yarn",
  plugins: ["umi-plugin-electron-builder"],
});
```

配置完成之后，执行

```shell
$ yarn postinstall
```

执行以下指令，生成主进程文件 src/main/index.ts

```shell
$ yarn electron:init
```

默认安装最新版本的 electron

自动在 package.json 增加以下配置，使用@umijs/max时，请将以下命令中的umi修改为max

```json5
{
  scripts: {
    'rebuild-deps': 'electron-builder install-app-deps',
    'electron:init': 'umi electron init',
    'electron:dev': 'umi dev electron',
    'electron:build:win': 'umi build electron --win',
    'electron:build:mac': 'umi build electron --mac',
    'electron:build:linux': 'umi build electron --linux',
  },
  //这里需要修改成你自己的应用名称
  name: 'electron_builder_app',
  version: '0.0.1',
}
```

### Electron 版本降级

你可以手动将 package.json 中的 electron 修改至低版本，插件与 electron 版本无关

### 开发

```
$ yarn electron:dev
```

### 调试主进程（VS Code）

```json5
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node-terminal",
      "request": "launch",
      "name": "debug electron:dev",
      "command": "yarn electron:dev",
      "skipFiles": [
        "<node_internals>/**"
      ],
      "sourceMapPathOverrides": {
        "webpack://main/./*": "${workspaceFolder}/src/main/*"
      },
      "resolveSourceMapLocations": [
        "${workspaceFolder}/src/.umi/electron/**",
        "${workspaceFolder}/src/renderer/.umi/electron/**"
      ],
      "autoAttachChildProcesses": true
    }
  ]
}
```

### 打包

打包路径不能有中文，electron-builder不能跨平台打包，请在对应系统上打包

```
//windows
$ umi build electron --win
//mac
$ umi build electron --mac
//linux
$ umi build electron --linux
//按平台打包
$ umi build electron --win --ia32    //32位
$ umi build electron --win --x64     //64位
$ umi build electron --win --armv7l  //arm32位
$ umi build electron --win --arm64   //arm64位
```

### 使用 node 环境下运行的模块

例：使用 serialport 插件

```
$ yarn add serialport @types/serialport
```

### 配置 .umirc.ts

```typescript
import Config from '@umijs/bundler-webpack/compiled/webpack-5-chain';
import { defineConfig } from 'umi';
import { InlineConfig } from 'vite';

export default defineConfig({
  electronBuilder: {
    //可选参数
    buildType: 'vite', //webpack或vite，当编译出现问题，可尝试切换为webpack
    //并行构建，默认关闭，如开启出现问题，请关闭此功能
    parallelBuild: false, //并行构建，开启时主进程和渲染进程同时编译
    mainSrc: 'src/main', //默认主进程目录
    preloadSrc: 'src/preload', //默认preload目录，可选，不需要可删除
    routerMode: 'hash', //路由 hash或memory,仅electron下有效，推荐使用hash
    outputDir: 'dist_electron', //默认打包目录
    externals: ['serialport'], //node原生模块配置，打包之后找不到包也需要配置在这里
    rendererTarget: 'web', //构建目标electron-renderer或web，使用上下文隔离时，必须设置为web
    debugPort: 5858, //主进程调试端口
    //2.1.0新增
    preloadEntry: {
      //默认值 key为preload文件名 值为preload输出文件名
      //输出文件名不能为main.js会和主进程文件名冲突
      //文件名为preload目录下多文件名
      //多级目录时key为xxxx/xxxx.ts
      //使用时输出文件会和主进程在同一目录下 preload: path.join(__dirname, 'preload.js')
      'index.ts': 'preload.js',
    },
    viteConfig(config: InlineConfig, type: "main" | "preload") {
      //主进程Vite配置
      //配置参考 https://vitejs.dev/config/
      //ConfigType分为main和preload可分别配置
    },
    //通过 webpack-chain 的 API 修改 webpack 配置。
    mainWebpackChain(config: Config, type: "main" | "preload") {
      //ConfigType分为main和preload可分别配置
      // if (type === 'main') {}
      // if (type === 'preload') {}
    },
    //2.1.10新增 开启自定义主进程日志时
    logProcess(log: string, type: "normal" | "error") {
      if (type === 'normal') {
        console.log(log);
      } else if (type === 'error') {
        console.error(log);
      }
    },
    builderOptions: {
      //配置参考 https://www.electron.build/configuration/configuration
      appId: 'com.test.test',
      productName: '测试',
      publish: [
        {
          provider: 'generic',
          url: 'http://localhost/test',
        },
      ],
    }, //electronBuilder参数
  },
  routes: [{ path: '/', component: '@/pages/index' }],
});
```

在 Electron10 以上使用[contextIsolation](https://www.electronjs.org/docs/tutorial/context-isolation)时 rendererTarget 需要设置成
web

builderOptions[参考 Electron Builder](https://www.electron.build/configuration/configuration)

### 已知问题

esbuild 暂不支持 typescript decorator metadata

Vite 与 typeorm 冲突，typeorm 在主进程无法使用

相关 Issue https://github.com/evanw/esbuild/issues/257
