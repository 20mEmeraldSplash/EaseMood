# EaseMood MVP - 极简情绪记录产品

这是一个最小可用产品（MVP），用于验证用户是否会在情绪低落时使用情绪记录工具。

## 🎯 项目目标

- **不做 App**：仅 Web 版本
- **不做复杂分析**：无图表、无统计
- **不做社区**：无点赞、评论、回复
- **不做 AI 建议**：纯记录工具

## 🏗 技术栈

### 后端
- Java 17
- Spring Boot 3.x
- Maven
- Spring Web
- Spring Validation
- Spring Data JPA
- H2（开发环境，内存数据库）

### 前端
- Next.js 14（App Router）
- React 18
- TypeScript
- 移动端优先（mobile-first）
- 不使用任何 UI 框架（纯 CSS）

## 📁 项目结构

```
EaseMood/
├── backend/          # Spring Boot 后端
│   ├── src/main/java/com/mvp/mood/
│   │   ├── MoodApiApplication.java
│   │   ├── config/
│   │   ├── mood/
│   │   ├── session/
│   │   └── common/
│   └── pom.xml
│
└── frontend/         # Next.js 前端
    ├── src/app/
    │   ├── page.tsx      # 首页
    │   ├── done/page.tsx # 提交后页
    │   └── me/page.tsx   # 回看页
    └── package.json
```

## 🚀 本地启动

### 前置要求

- **Java 17+**（必需）
- **Maven 3.6+**（必需）
- **Node.js 18+**（必需）
- **npm**（通常随 Node.js 安装）

#### 安装依赖（如未安装）

**macOS:**
```bash
# 安装 Java 17
brew install openjdk@17

# 安装 Maven
brew install maven

# Node.js 通常已安装，如未安装：
brew install node
```

**Windows:**
- Java: 下载安装 [Oracle JDK 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html) 或使用 [Adoptium](https://adoptium.net/)
- Maven: 下载安装 [Apache Maven](https://maven.apache.org/download.cgi)
- Node.js: 下载安装 [Node.js](https://nodejs.org/)

### 快速启动（推荐）

项目根目录提供了启动脚本：

**方式一：使用启动脚本**

1. **启动后端**（第一个终端窗口）：
```bash
./start-backend.sh
```

2. **启动前端**（第二个终端窗口）：
```bash
./start-frontend.sh
```

**方式二：手动启动**

1. **启动后端**（第一个终端窗口）：
```bash
cd backend
mvn spring-boot:run
```
后端将在 `http://localhost:8080` 启动

2. **启动前端**（第二个终端窗口）：
```bash
cd frontend
npm install  # 首次运行需要安装依赖
npm run dev
```
前端将在 `http://localhost:3000` 启动

### 访问应用

打开浏览器访问：**`http://localhost:3000`**

### 验证后端是否运行

- API 测试：`http://localhost:8080/session`（POST 请求）
- H2 控制台：`http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:mem:mooddb`
  - 用户名: `sa`
  - 密码: （空）

### 常见问题

**Q: 后端启动失败，提示找不到 Java**
- 确保已安装 Java 17+
- 检查 `java -version` 命令是否可用
- macOS 可能需要设置 `JAVA_HOME` 环境变量

**Q: Maven 下载依赖很慢**
- 可以配置国内镜像（如阿里云 Maven 镜像）

**Q: 前端启动失败，提示端口被占用**
- 修改 `frontend/package.json` 中的端口，或使用 `npm run dev -- -p 3001`

**Q: 前端无法连接后端**
- 确保后端已启动在 `http://localhost:8080`
- 检查浏览器控制台是否有 CORS 错误

## 🔌 API 端点

### 1. 创建匿名 session
```
POST /session
返回: { "sessionId": "uuid" }
```

### 2. 创建情绪记录
```
POST /mood
请求体: {
  "sessionId": "uuid",
  "moodScore": -1 | 0 | 1,
  "text": "可选的一句话"
}
```

### 3. 获取同情绪匿名池（最近24小时）
```
GET /mood/others?moodScore=-1
返回: [{ "text": "..." }, ...]  // 最多3条
```

### 4. 获取同情绪数量
```
GET /mood/count?moodScore=-1
返回: { "count": 5 }
```

### 5. 获取我的记录
```
GET /mood/me?sessionId=uuid&limit=7
返回: [{ "id": 1, "moodScore": -1, "text": "...", "createdAt": "..." }, ...]
```

## 🎨 功能说明

### 首页（/）
- 情绪选择：-1（低落）、0（平静）、1（开心）
- 可选文字输入（最多140字）
- 提交按钮："放下它"

### 提交后页（/done）
- 显示："今天有 X 个人和你一样"
- 显示3条匿名情绪文字
- 返回按钮："够了，先这样吧"

### 回看页（/me）
- 显示最近7条记录
- 简单列表展示，无图表

## 🚫 MVP 边界（暂时不要扩展）

### 明确不做：
1. **身份系统**：无登录、注册、用户管理
2. **AI 功能**：无 AI 建议、分析、推荐
3. **社区功能**：无点赞、评论、回复、关注
4. **复杂 UI**：无图表、统计、分析页面
5. **数据持久化**：H2 内存数据库，重启数据丢失（MVP 阶段可接受）
6. **安全功能**：无 Spring Security，无认证授权
7. **移动 App**：仅 Web 版本
8. **未来功能占位**：不要添加任何"未来可能用到"的代码

### 当前限制：
- Session 不持久化（仅前端 localStorage）
- 匿名池只保留最近24小时
- 情绪分数只能是 -1、0、1
- 文字最多140字
- 我的记录最多显示7条

## 📝 开发说明

### 后端
- 使用 H2 内存数据库，重启后数据丢失（MVP 阶段可接受）
- CORS 已配置，允许前端跨域访问
- 全局异常处理已配置
- 数据验证使用 Spring Validation

### 前端
- 使用 Next.js App Router
- Session ID 存储在 localStorage
- 移动端优先设计
- 纯 CSS，无 UI 框架依赖

## 🔍 验证重点

MVP 阶段重点验证：
1. 用户是否会在情绪低落时使用
2. 匿名情绪池是否有价值
3. 极简交互是否足够

**不要过早优化或添加功能！**
