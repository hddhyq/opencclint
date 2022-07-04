/**
 * @desc:   opencclint core process program
 * @author: huangyuanqi@addcn.com <10829>
 * @create: 2021-02-22 16:12:32
 */

const fs = require("fs").promises;
const linter = require("./linter");
const glob = require("glob");

class OpenccLint {
  constructor(config) {
    this.config = config;
  }

  /**
   * Executes the current configuration on an array of file and directory names.
   * @param {string[]} patterns An array of file and directory names.
   * @returns {LintReport} The results for all files that were linted.
   */
  async executeOnFiles(patterns) {
    let results = [];
    const re = /\.(js|json|ts|tsx|pug|vue|css|styl|sass|scss)$/;
    const startTime = Date.now();

    // Merge Path
    const paths = await this.mergePath(patterns);
    const filterPaths = paths.filter((path) => re.test(path)); // 過濾不需要處理的文件後綴

    // Iterate source code files.
    for (const path of filterPaths) {
      let result;
      try {
        result = await this.processFile(path);
      } catch (err) {
        console.log(err);
      }

      results.push(result);
    }

    console.log(`Linting complete in: ${Date.now() - startTime}ms`);

    return results;
  }

  /**
   *
   * @param {String} patterns 路径
   * @returns
   */
  async mergePath(patterns) {
    let paths = [];

    for (const pattern of patterns) {
      const path = await this.processPath(pattern);
      paths.push(...path);
    }

    return paths;
  }

  /**
   * Processes directory or file.
   * @returns {Promise}
   */
  async processPath(path) {
    path = path.replace(/\/$/, "");

    const stats = await fs.stat(path);

    // 獲取所有路徑
    return stats.isDirectory()
      ? glob.sync(path + "**/**").filter((p) => /\.[^/]+$/.test(p))
      : [path];
  }

  /**
   * Processes single file.
   * @param {String} path
   * @returns {Promise}
   */
  async processFile(path) {
    let data = await fs.readFile(path, "utf-8");
    data = data.replace(/\r*\n/g, "\n");
    return this._distributeLinter(data, path);
  }

  _distributeLinter(data, path) {
    if (/\.(js|ts)?$/.test(path)) {
      return linter.allLinter(data, path, this.config);
    }

    if (/\.pug?$/.test(path)) {
      return linter.pugLinter(data, path, this.config);
    }

    if (/\.vue?$/.test(path)) {
      return linter.vueLinter(data, path, this.config);
    }

    if (/\.(css|styl|sass|scss)?$/.test(path)) {
      return linter.allLinter(data, path, this.config);
    }
  }
}

module.exports = OpenccLint;
