# CITSILAER

这个项目已经整理成适合直接上传到 GitHub 并用 GitHub Pages 自动发布的版本。

## 日常更新

### 增加照片

1. 把新照片放进 `assets/photos`
2. 双击运行 `更新照片.command`
3. 刷新本地页面确认照片已经出现
4. 把改动一起上传到 GitHub

### 修改文字

1. 打开 `editor.html`
2. 修改文字、关于我、社交链接
3. 点 `发布到当前浏览器`
4. 如果想让线上网站也更新，再点 `下载内容文件`
5. 用下载的新 `site-content.json` 替换项目里的 `content/site-content.json`
6. 运行一次 `node ./tools/generate-content.mjs`
7. 把改动上传到 GitHub

说明：
`发布到当前浏览器` 只会改你这台电脑当前浏览器里的内容，不会自动同步到线上网站。

## 上传到 GitHub 就能上线

### 第一次上线

1. 新建一个 GitHub 仓库
2. 把这个文件夹里的全部文件上传到仓库
3. 默认分支建议叫 `main`
4. 上传后进入 GitHub 仓库的 `Settings` -> `Pages`
5. 在 `Build and deployment` 里把 `Source` 选成 `GitHub Actions`
6. 等待仓库里的 `Deploy GitHub Pages` 工作流跑完
7. GitHub 会给你一个网址，通常是 `https://你的用户名.github.io/仓库名/`

### 以后更新

1. 在本地改照片或文字
2. 把改动上传到 GitHub
3. GitHub 会自动重新发布

## 项目里和上线相关的文件

- `.github/workflows/deploy-pages.yml`
  作用：上传到 GitHub 后自动部署到 GitHub Pages
- `.nojekyll`
  作用：避免 GitHub Pages 忽略某些静态文件
- `.gitignore`
  作用：忽略 `.DS_Store` 这类不需要上传的系统文件

## 现在你最需要记住的两件事

1. 照片更新后要把改动上传到 GitHub，线上网站才会变
2. `editor.html` 里点“发布到当前浏览器”不等于线上发布，线上发布还是要替换 `content/site-content.json` 后再上传
