const wrap = require("word-wrap");
const process = require("process");
const ora = require("ora");

const jira = require("./OAuth.js");

let spinner = ora("Isseus 加载中..");

async function Prompters(cz, commit) {
  try {
    spinner.start();
    let userInfo = await jira.getCurrentUser();
    let res = await jira.getUsersIssues(userInfo.name, true);

    let isseus = Object.values(res.issues).map((iss, index) => {
      return {
        name: `${iss.key}: ${iss.fields.description || "无"}`,
        value: index,
        key: iss.key,
        modules: [
          {
            name: "无",
            value: ""
          }
        ].concat(
          iss.fields.components.map(component => ({
            name: `${component.name}: ${component.description}`,
            value: component.name
          }))
        )
      };
    });
    spinner.succeed("Isseus 加载完成");

    cz.prompt([
      {
        type: "list",
        name: "isseuid",
        message: "请选择提交改动的 Isseus:",
        choices: isseus,
        default: isseus[0]
      }
    ]).then(function(answers) {
      let isseuid = answers.isseuid;
      cz.prompt([
        {
          type: "list",
          name: "module",
          message: "请选择提交改动的 Module:",
          choices: isseus[isseuid].modules,
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
        cModule = cModule ? "[" + cModule + "] " : "";
        var head = (
          isseus[isseuid].key +
          ": " +
          cModule +
          answers.title.trim()
        ).slice(0, maxLineWidth);
        var body = wrap(answers.body, wrapOptions);
        commit(head + "\n\n" + body);
      });
    });
  } catch (e) {
    spinner.fail("Isseus 加载失败");
    process.exit(1);
  }
}
function Prompter(cz, commit) {
  Prompters(cz, commit);
}
module.exports = {
  prompter: Prompter
};
