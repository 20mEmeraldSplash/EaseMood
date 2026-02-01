#!/bin/bash

echo "🚀 启动后端服务..."
cd backend

# 检查 Java
if ! command -v java &> /dev/null; then
    echo "❌ 错误: 未找到 Java，请先安装 Java 17+"
    exit 1
fi

# 检查 Maven
if ! command -v mvn &> /dev/null; then
    echo "❌ 错误: 未找到 Maven，请先安装 Maven"
    exit 1
fi

echo "✅ Java 版本:"
java -version

echo "✅ Maven 版本:"
mvn -version

echo ""
echo "📦 开始启动 Spring Boot..."
mvn spring-boot:run
