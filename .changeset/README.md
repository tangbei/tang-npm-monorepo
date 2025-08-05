## changeset配置说明
```bash
{
  "$schema": "https://unpkg.com/@changesets/config@3.1.1/schema.json",
  "changelog": "@changesets/cli/changelog", // changelog生成方式
  "commit": false, // 不要让 changeset 在 publish 的时候帮我们做 git add
  "fixed": [],
  "linked": [], // 配置哪些包要共享版本
  "access": "public", // 公私有安全设定，内网建议 restricted ，开源使用 public
  "baseBranch": "main", // 项目主分支
  "updateInternalDependencies": "patch", // 确保某包依赖的包发生 upgrade，该包也要发生 version upgrade 的衡量单位（量级）
  "ignore": [], // 不需要变动 version 的包
  "___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH": { // 在每次 version 变动时一定无理由 patch 抬升依赖他的那些包的版本，防止陷入 major 优先的未更新问题
    "onlyUpdatePeerDependentsWhenOutOfRange": true
  }
}
```