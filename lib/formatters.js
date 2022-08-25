/**
 * @desc:   获取错误并展示
 * @create: 2021-03-07 17:25:29
 */

function formatWhiteSpace(string) {
  return string.replace(/^\s*|\s*$/g, "");
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = function (results) {
  let output = "",
    total = 0;

  results.forEach((result) => {
    if (!result) return;

    const messages = result.messages;

    total += messages.length;

    if (messages.length > 0) {
      output += `${result.filePath}:`;
    }

    messages.forEach((message) => {
      output += `\n${formatWhiteSpace(message.message)}`;
      output += "\n";
    });
  });

  if (total > 0) {
    output += `\ntotal: ${total} problem${total !== 1 ? "s" : ""} need to fix`;
  }

  return output;
};
