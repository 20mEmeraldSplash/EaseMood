#!/bin/bash

echo "🚀 启动前端服务..."
cd frontend

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到 Node.js，请先安装 Node.js 18+"
    exit 1
fi

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

echo ""
echo "✅ Node.js 版本:"
node -v
npm -v

echo ""
echo "🌐 开始启动 Next.js..."
npm run dev
