/**
 * @desc:   vueLinter class
 * @author: huangyuanqi@addcn.com <10829>
 * @create: 2021-03-08 16:57:10
 */
const jsLinter = require("./jsLinter");
const pugLinter = require("./pugLinter");
const Linter = require("./linter");
const { parse } = require("@vue/component-compiler-utils");
const compiler = require("vue-template-compiler");

module.exports = function (source, path, config) {
  const linter = new Linter(config);

  const ignoreReg = linter.getIgnoreRegex();

  if (ignoreReg.test(source)) return { filePath: path, messages: [] };

  // 解析 vue SFC文件
  const descriptor = parse({
    source,
    compiler,
    needMap: false,
  });

  let messages = [];

  // vue 文件需要提取 template 内容
  if (descriptor.template && descriptor.template.lang === "pug") {
    const result = pugLinter(descriptor.template.content, path, config);
    result.messages && messages.push(...result.messages);
  }

  // vue 文件需要提取 script 内容
  if (descriptor.script) {
    const result = jsLinter(descriptor.script.content, path, config);
    result.messages && messages.push(...result.messages);
  }

  // vue 文件提取 styles 内容 stylus 和 js注释相同
  if (descriptor.styles.length > 0) {
    for (const style of descriptor.styles) {
      const result = jsLinter(style.content, path, config);
      result.messages && messages.push(...result.messages);
    }
  }

  return {
    filePath: path,
    messages,
  };
};
