/**
 * @desc:   vueLinter class
 * @create: 2021-03-08 16:57:10
 */
const jsLinter = require("./jsLinter");
const pugLinter = require("./pugLinter");
const htmlLinter = require("./htmlLinter");
const Linter = require("./linter");
let compiler;
let parse;
let version;

module.exports = function (source, path, config) {
  // 判断Vue版本使用不同解析器
  version = config?.vue ?? 2;
  //   vue 3 版本 更换解析器
  if (version === 3) {
    parse = require("@vue/compiler-sfc").parse;
  } else {
    parse = require("@vue/component-compiler-utils").parse;
    compiler = require("vue-template-compiler");
  }

  const linter = new Linter(config);

  const ignoreReg = linter.getIgnoreRegex();

  if (ignoreReg.test(source)) return { filePath: path, messages: [] };

  let descriptor;

  // 解析 vue SFC文件
  if (version === 3) {
    // vue 3
    descriptor = parse(source).descriptor;
  } else {
    // vue 2
    descriptor = parse({
      source,
      compiler,
      needMap: false,
    });
  }

  let messages = [];
  // vue template(pug)文件需要提取 template 内容
  if (descriptor.template && descriptor.template.lang === "pug") {
    const result = pugLinter(descriptor.template.content, path, config);
    result.messages && messages.push(...result.messages);
  }

  // vue template 内容
  if (descriptor.template && !descriptor.template?.lang) {
    const result = htmlLinter(descriptor.template.content, path, config);
    result.messages && messages.push(...result.messages);
  }

  // vue 文件需要提取 script 内容
  if (descriptor.script) {
    const result = jsLinter(descriptor.script.content, path, config);
    result.messages && messages.push(...result.messages);
  }

  // vue 文件需要提取 scriptSetup 内容
  if (descriptor.scriptSetup) {
    const result = jsLinter(descriptor.scriptSetup.content, path, config);
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
