#!/bin/bash

# 发布脚本
echo "🚀 开始发布 @tang-npm/request 包..."

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误：请在 packages/request 目录下运行此脚本"
    exit 1
fi

# 检查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ 错误：有未提交的更改，请先提交或暂存"
    git status --porcelain
    exit 1
fi

# 构建
echo "📦 构建中..."
pnpm build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

echo "✅ 构建成功"

# 检查 dist 目录
if [ ! -d "dist" ]; then
    echo "❌ 错误：dist 目录不存在"
    exit 1
fi

# 显示构建结果
echo "📁 构建结果："
ls -la dist/

# 询问是否继续发布
read -p "🤔 是否继续发布到 npm？(y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 取消发布"
    exit 0
fi

# 发布到 npm
echo "🚀 发布到 npm..."
npm publish

if [ $? -eq 0 ]; then
    echo "✅ 发布成功！"
    echo "📦 包地址：https://www.npmjs.com/package/@tang-npm/request"
else
    echo "❌ 发布失败"
    exit 1
fi 