### 安装说明

包管理器为yarn 1.22.22

脚手架为umi 4.0.79

node版本为 22.12.0

打包时需要修改src/services/index.js 中的prefix

node_modules\umi-plugin-electron-builder\lib\index.js需要修改

```javascript
const defaultBuildConfig = {
      directories: {
        output: absOutputDir,
        app: `${absOutputDir}/bundled`
      },
      files: ["**"],
      extends: null
    };
    api.logger.info("build electron");
    
    //----------------------------------------------------
    const yargs = require('yargs');
    const { hideBin } = require('yargs/helpers');
    const yargsInstance = yargs(hideBin(process.argv));
    
    const { configureBuildCommand } = require("electron-builder/out/builder");
    //const builderArgs = import_yargs.default.command(["build", "*"], "Build", configureBuildCommand).parse(process.argv);
    const builderArgs = yargsInstance.command(["build", "*"], "Build", configureBuildCommand).parse(process.argv);
    //----------------------------------------------------
    
    require("electron-builder").build(
      import_utils.lodash.merge({
        config: import_utils.lodash.merge(defaultBuildConfig, builderOptions),
        ...builderArgs
      })
    ).then(() => {
      api.logger.info("build electron success");
      process.exit();
    });


