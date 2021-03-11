/**
 * @desc:   command line implementation for opencclint
 * @author: huangyuanqi@addcn.com <10829>
 * @create: 2021-02-22 14:17:47
 */

const parseArgs = require("minimist");
const path = require("path");
const os = require("os");

const OpenccLint = require("./core");
const formatter = require("./formatters");

function displayHelp() {
  const help = [
    "NAME",
    "    opencc lint for project",
    "",
    "SYNOPSIS",
    "    opencclint [options] file.vue",
    "",
    "OPTIONS",
    "    -c, --config [path]",
    "        Path to configuration file.",
    "    -h, --help",
    "        Display help message.",
    "",
  ];

  process.stdout.write(help.join(os.EOL));
}

function getOptions() {
  const parserOptions = {
    boolean: ["help"],
    alias: {
      help: "h",
    },
  };

  return parseArgs(process.argv.slice(2), parserOptions);
}

/**
 * Outputs the results of the linting.
 * @param {LintResult[]} results The results to print.
 */
function printResults(results) {
  const output = formatter(results);

  if (output) {
    console.log(output);
  }
}

/**
 * 獲取根目錄配置文件
 * @returns
 */
function getConfig() {
  const filePath = path.resolve(process.cwd(), "simplify.config.js");
  if (!filePath) {
    throw new Error("请配置简体文件");
  }

  const config = require(filePath);

  if (!config.translation) {
    throw new Error("请配置简体文件, translation 字段");
  }

  return config;
}

/**
 * 计时器 loading
 * @returns setInterval
 */
function generLoading() {
  var h = ["|", "/", "-", "\\"];
  var i = 0;

  return setInterval(() => {
    i = i > 3 ? 0 : i;
    console.clear();
    console.log(h[i]);
    i++;
  }, 300);
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * Encapsulates all CLI behavior for opencclint. Makes it easier to test as well as
 * for other Node.js programs to effectively run the CLI.
 */

const cli = {
  /**
   * Executes the CLI based on an array of arguments that is passed in.
   * @param {string|Array|Object} args The arguments to process.
   * @returns {Promise<number>} The exit code for the operation.
   */
  async execute() {
    let options, results;
    const config = getConfig();

    // 获取 cli 参数
    const opencclint = new OpenccLint(config);

    try {
      options = getOptions(); // get options
    } catch (error) {
      console.log(error);
      return 2;
    }

    const files = options._; // get filesList

    if (options.help) {
      displayHelp();
      return 0;
    }

    // 执行文件检查
    const loading = generLoading(); // 添加 loading
    try {
      results = await opencclint.executeOnFiles(files);
      results = results.filter((result) => result.messages.length > 0);
      clearInterval(loading);
    } catch (error) {
      clearInterval(loading);
    }

    printResults(results); // 打印错误信息

    return results.length ? 1 : 0;
  },
};

module.exports = cli;
