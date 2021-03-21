/**
 * @desc:   Linter Class
 * @author: huangyuanqi@addcn.com <10829>
 * @create: 2021-03-08 17:38:19
 */
require("colors");
const Diff = require("diff");
const openCC = require("node-opencc");

class Linter {
  constructor(options) {
    this.options = options;
    this.converter = openCC[options.translation];
  }

  getOptions() {
    return this.options;
  }

  getIgnoreRegex() {
    return /\/\*\s?simplify ignore\s?\*\//gi;
  }

  generRegex() {
    if (!this.options.ignoreTexts) {
      throw new Error("请在simplify.config.js配置 simplified");
    }

    // ignoreTexts 為空對象
    if (Object.keys(this.options.ignoreTexts).length === 0) {
      return false;
    }

    const regStr = Object.keys(this.options.ignoreTexts).reduce(
      (acc, curr) => acc + "|" + curr
    );
    const re = new RegExp(`(${regStr})`, "g"); // 形如：/(台|家具|周)/g ...

    return re;
  }

  compareTemplate(ignoreTemplate) {
    // 构建需要比对的模板
    const translateTemplate = this.converter(ignoreTemplate); // 全部转换为繁体字

    let messages = [];

    if (ignoreTemplate === translateTemplate) return messages;

    // 生成含 diff 的文本内容，在控制台显示
    let diff = Diff.diffLines(ignoreTemplate, translateTemplate);

    let strerr = "",
      addedStr = "",
      removedStr = "";

    diff.forEach((part) => {
      if (part.removed) {
        removedStr = part.value;
      }

      if (part.added) {
        addedStr = part.value;
        let interDiff = Diff.diffChars(removedStr, addedStr);
        interDiff.forEach((part) => {
          // green for additions, red for deletions
          // grey for common parts
          const color = part.added ? "green" : part.removed ? "red" : "grey";
          strerr += part.value[color];
        });

        messages.push({ message: strerr });

        strerr = "";
        addedStr = "";
        removedStr = "";
      }
    });

    return messages;
  }
}

module.exports = Linter;
