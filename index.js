var wrap = require("word-wrap");
// var map = require('lodash.map');
// var longest = require('longest');
// var rightPad = require('right-pad');

var isseuids = [
  {
    name: "TC-7: 前端组件化开发体系建设",
    value: "TC-7"
  }
];
var modules = [
  {
    name: "null",
    value: ""
  },
  {
    name: "PluginHub",
    value: "PluginHub"
  }
];
function Prompter(cz, commit) {
  cz.prompt([
    {
      type: "list",
      name: "isseuid",
      message: "请选择提交改动的 IsseuId:",
      choices: isseuids,
      default: isseuids[0]
    },
    {
      type: "list",
      name: "module",
      message: "请选择提交改动的 Module:",
      choices: modules,
      default: ""
    },
    {
      type: "input",
      name: "title",
      message: "请输入一份简短的标题描述改动:(不超过100字):\n",
      default: null
    },
    {
      type: "input",
      name: "body",
      message: "输入一份更长的描述(\\n 表示换行):\n",
      default: null
    }
  ]).then(function(answers) {
    const maxLineWidth = 100;
    const wrapOptions = {
      trim: true,
      newline: "\n",
      indent: "",
      width: maxLineWidth
    };
    var cModule = answers.module.trim();
    cModule = cModule ? "[" + cModule + "]" : "";
    var head = (answers.isseuid + cModule + ":" + answers.title.trim()).slice(
      0,
      maxLineWidth
    );
    var body = wrap(answers.body, wrapOptions);
    commit(head + "\n\n" + body);
  });
}

module.exports = {
  prompter: Prompter
};
