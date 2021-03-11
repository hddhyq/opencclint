## 介绍
用于项目中文件繁简体检查。

### features
* 支持 vue，js，ts, css，stylus, pug 文件，适配 Vue 项目。
* 依托于[opencc](https://www.npmjs.com/package/opencc)库，完美兼容多种繁简体检查。
* 支持配置项目中已有单个文字忽略。
* 支持文件级别的忽略检查。

## 安装
```shell
# 全局安装
npm i opencclint -g

# 项目中安装
npm i opencclint -D
```
## CLI 命令行使用
```bash
# 單文件檢查
opencclint ./test/test.js

# 多个文件检查
opencclint "./test/test.js" "./test/test.vue"

# 文件夾檢查
opancclint ./test
```
## 项目中使用

项目根目录配置 simplify.config.js 。

### simplify.config.js 配置文件

* translation，
* ignoreTexts，

```js
{
    translation: "simplifiedToTaiwan", // 配置简体转换台湾字体
    ignoreTexts: { // 配置忽略的单个文字
        台: "臺",
        裏: "裡",
    }
}
```

## 忽略文件

项目中以文件级别，忽略繁简体检查
### js文件
```js
/* simplify ignore */
```

### vue文件
```html
...
<script>
/* simplify ignore */
</script>
...
```

### css stylus 文件
```css
/* simplify ignore */
```
