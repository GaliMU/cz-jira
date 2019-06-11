const wrap = require("word-wrap");
const process = require("process");
const ora = require("ora");

const jira = require("./OAuth.js");

const maxLineWidth = 200;
const wrapOptions = {
  indent: "   ",
  width: maxLineWidth
};

let spinner = ora("Isseus 加载中..");

async function Prompters(cz, commit) {
  try {
    spinner.start();
    let issues = await filter();
    spinner.succeed("Isseus 加载完成");

    cz.prompt([
      {
        type: "list",
        name: "isseuid",
        message: "请选择提交改动的 issues:",
        choices: issues,
        default: issues[0]
      },
      {
        type: "input",
        name: "body",
        message: "输入一份描述(\\n 表示换行):\n",
        default: null
      }
    ]).then(function(answers) {
      let body = wrap(
        answers.body.trim().replace(/\s{2,}/g, "\n"),
        wrapOptions
      );
      commit(answers.isseuid + (body ? `\n\n${body}` : ""));
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

async function filter() {
  let userInfo = await jira.getCurrentUser();
  return await getIssues(userInfo);
}

async function getIssues(userInfo) {
  let issues = [];
  let a = true;
  let startAt = 0;
  while (a) {
    let res = await jira.searchJira(
      `assignee = ${userInfo.name.replace("@", "\\u0040")}`,
      {
        startAt,
        maxResults: 50
      }
    );
    issues = issues.concat(
      res.issues
        .filter(
          issue => issue.fields.status.statusCategory.name === "In Progress"
        )
        .map(iss => ({
          name: `${iss.key}: ${iss.fields.summary}`,
          value: `${iss.key}: ${iss.fields.summary}`
        }))
    );
    if (res.maxResults + startAt > res.total) {
      a = false;
    } else {
      startAt += res.maxResults;
    }
  }
  return issues;
}
