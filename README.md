# jira commit message tools for commitizen

## install

Install commitizen and preferred

```bash
npm install -g commitizen @galimu/cz-jira
```

Create a .czrc file in your home directory,with `config` referring to the preferred.

```bash
cd ~
cat .czrc
```
config like this:

```json
{
  "path": "@galimu/cz-jira",
  "jira": {
    "username":"",
    "password":"",
    "protocol": "http", // http or https
    "host": "",
    "apiVersion": "2",
    "strictSSL": true
  }
}
```
You are all set! Now cdinto any git repository and use git cz instead of git commit and you will find the commitizen prompt.
