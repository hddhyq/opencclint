/**
 * @desc:   lint pug file
 * @author: huangyuanqi@addcn.com <10829>
 * @create: 2021-03-08 22:39:00
 */

"use strict";
const Linter = require("./linter");
const pug = require("pug");

module.exports = function (source, path, config) {
  const linter = new Linter(config);
  const options = linter.getOptions();

  // 忽略单个文件
  const ignoreReg = linter.getIgnoreRegex();
  if (ignoreReg.test(source)) return { filePath: path, messages: [] };

  const template = source ? pug.compile(source, { doctype: "html" })({}) : "";

  // 构造繁简体正则
  const re = linter.generRegex();

  // 获取需要比对的字符串
  const ignoreTemplate = re
    ? template.replace(re, ($1) => options.ignoreTexts[$1])
    : template;

  // 获取比较之后的文本
  const messages = linter.compareTemplate(ignoreTemplate);

  return { filePath: path, messages };
};
