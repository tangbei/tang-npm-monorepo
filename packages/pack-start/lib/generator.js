/**
 * @fileoverview 项目生成器
 * @author tanggoat
 * @version 1.0.0
 */

const path = require('path');
const fs = require('fs-extra');
const { copyTemplateFiles, getTemplatePath } = require('./utils');

/**
 * 生成项目文件
 * @param {Object} config - 项目配置
 */
async function generateProject(config) {
  try {
    const { projectName, template, description, author, version } = config;
    
    // 获取模板路径
    const templatePath = getTemplatePath(template);
    
    // 检查模板是否存在
    if (!fs.existsSync(templatePath)) {
      throw new Error(`模板 ${template} 不存在`);
    }
    
    // 目标项目路径
    const targetPath = path.resolve(process.cwd(), projectName);
    
    // 准备模板数据
    const templateData = {
      projectName,
      description,
      author,
      version,
      currentYear: new Date().getFullYear(),
      packageName: projectName.toLowerCase().replace(/[^a-z0-9-_]/g, '-')
    };
    
    // 复制模板文件
    await copyTemplateFiles(templatePath, targetPath, templateData);
    
    // 根据模板类型进行特殊处理
    if (template === 'react-ts') {
      await processTypeScriptTemplate(targetPath, templateData);
    } else if (template === 'react') {
      await processJavaScriptTemplate(targetPath, templateData);
    }
    
    // 创建 .gitignore 文件
    await createGitignore(targetPath);
    
    // 创建 README.md 文件
    await createReadme(targetPath, templateData);
    
  } catch (error) {
    throw new Error(`生成项目失败: ${error.message}`);
  }
}

/**
 * 处理TypeScript模板的特殊配置
 * @param {string} targetPath - 目标路径
 * @param {Object} templateData - 模板数据
 */
async function processTypeScriptTemplate(targetPath, templateData) {
  // 确保tsconfig.json存在并正确配置
  const tsconfigPath = path.join(targetPath, 'tsconfig.json');
  if (!fs.existsSync(tsconfigPath)) {
    const tsconfig = {
      compilerOptions: {
        target: "ES2020",
        lib: ["dom", "dom.iterable", "es6"],
        allowJs: true,
        skipLibCheck: true,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        strict: true,
        forceConsistentCasingInFileNames: true,
        noFallthroughCasesInSwitch: true,
        module: "esnext",
        moduleResolution: "node",
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: "react-jsx"
      },
      include: ["src"],
      exclude: ["node_modules", "dist"]
    };
    
    await fs.writeJson(tsconfigPath, tsconfig, { spaces: 2 });
  }
}

/**
 * 处理JavaScript模板的特殊配置
 * @param {string} targetPath - 目标路径
 * @param {Object} templateData - 模板数据
 */
async function processJavaScriptTemplate(targetPath, templateData) {
  // JavaScript模板的特殊处理逻辑
  // 可以在这里添加JS特有的配置
}

/**
 * 创建 .gitignore 文件
 * @param {string} targetPath - 目标路径
 */
async function createGitignore(targetPath) {
  const gitignoreContent = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production build
dist/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port
`;

  await fs.writeFile(path.join(targetPath, '.gitignore'), gitignoreContent);
}

/**
 * 创建 README.md 文件
 * @param {string} targetPath - 目标路径
 * @param {Object} templateData - 模板数据
 */
async function createReadme(targetPath, templateData) {
  const { projectName, description, author, currentYear } = templateData;
  
  const readmeContent = `# {{projectName}}

{{description}}

## 🚀 快速开始

### 安装依赖

\`\`\`bash
npm install
\`\`\`

### 开发模式

\`\`\`bash
npm run dev
\`\`\`

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。

### 构建生产版本

\`\`\`bash
npm run build
\`\`\`

构建文件将生成在 \`dist\` 目录中。

### 代码检查

\`\`\`bash
npm run lint
\`\`\`

### 运行测试

\`\`\`bash
npm test
\`\`\`

## 📁 项目结构

\`\`\`
{{projectName}}/
├── public/          # 静态资源
├── src/             # 源代码
│   ├── components/  # React组件
│   ├── pages/       # 页面组件
│   ├── utils/       # 工具函数
│   ├── styles/      # 样式文件
│   ├── App.tsx      # 主应用组件
│   └── index.tsx    # 应用入口
├── webpack.config.js # Webpack配置
├── package.json     # 项目配置
└── README.md        # 项目说明
\`\`\`

## 🛠️ 技术栈

- **构建工具**: Webpack 5
- **前端框架**: React 18
- **开发语言**: TypeScript/JavaScript
- **样式处理**: CSS/SCSS
- **代码规范**: ESLint + Prettier

## 📝 脚本命令

- \`npm run dev\` - 启动开发服务器
- \`npm run build\` - 构建生产版本
- \`npm run lint\` - 代码检查
- \`npm run test\` - 运行测试
- \`npm run clean\` - 清理构建文件

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

---

© {{currentYear}} {{author}}. All rights reserved.
`;

  await fs.writeFile(path.join(targetPath, 'README.md'), readmeContent);
}

module.exports = {
  generateProject
}; 