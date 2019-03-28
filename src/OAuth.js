const fs = require("fs");
const path = require("path");
const process = require("process");
const JiraClient = require("jira-client");
const configPath = path.resolve(
  process
    .cwd()
    .split("/")
    .splice(0, 3)
    .join("/"),
  ".czrc"
);

if (!fs.existsSync(configPath)) {
  console.log("没有在用户目录下找到 .czrc 文件");
  process.exit(1);
}
let config = JSON.parse(fs.readFileSync(configPath, "utf8"));
if (
  !config.jira ||
  !config.jira.username ||
  !config.jira.password ||
  !config.jira.apiVersion ||
  !config.jira.host ||
  !config.jira.protocol ||
  !config.jira.strictSSL
) {
  console.log("未找到 jira 配置信息");
  process.exit(1);
}

module.exports = new JiraClient(config.jira);
