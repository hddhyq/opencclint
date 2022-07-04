/**
 * @desc:   lint html file
 * @author: huangyuanqi@addcn.com <10829>
 * @create: 2022-05-05 11:14:19
 */

"use strict";
const Linter = require("./linter");
const minify = require("html-minifier").minify;

module.exports = function (source, path, config) {
  const linter = new Linter(config);
  const options = linter.getOptions();

  // 忽略单个文件
  const ignoreReg = linter.getIgnoreRegex();
  if (ignoreReg.test(source)) return { filePath: path, messages: [] };

  // 构造繁简体正则
  const re = linter.generRegex();

  const minifySource = minify(source, {
    removeComments: true,
  });

  // 获取需要比对的字符串
  const ignoreTemplate = re
    ? minifySource.replace(re, ($1) => options.ignoreTexts[$1]) // 不需要检测的文字直接转换为繁体字
    : minifySource;

  // 获取比较之后的信息
  const messages = linter.compareTemplate(ignoreTemplate);

  return { filePath: path, messages };
};
