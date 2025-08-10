# DWHITE's Blog

个人技术博客。基于 Astro 构建，用于记录学习和技术实践。

![astro version](https://img.shields.io/badge/astro-4.6-red)
![node version](https://img.shields.io/badge/node-18.18-green)

站点地址：[https://dr9k69ai79.github.io/MyBlog](https://dr9k69ai79.github.io/MyBlog)

## 特性

- ✅ SEO 优化，包含规范的 URL 和 OpenGraph 信息
- ✅ 支持站点地图和 RSS 订阅
- ✅ 夜间模式切换
- ✅ 响应式设计
- ✅ 评论系统集成
- ✅ 代码语法高亮
- ✅ 特殊日期标记

## 技术栈

- [Astro](https://astro.build/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Jotai](https://jotai.org/)

## 使用

### 安装依赖

```bash
pnpm install
```

### 开发环境

```bash
pnpm dev
```

### 构建

```bash
pnpm build
```

### 预览

```bash
pnpm preview
```

## 项目结构

```text
├── public/
├── src/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   ├── pages/
│   ├── plugins/
│   ├── store/
│   ├── styles/
│   ├── utils/
│   └── config.json
├── astro.config.mjs
├── README.md
├── package.json
└── tsconfig.json
```

网站配置保存在 `src/config.json` 文件中。

## 命令

| 命令           | 说明                                  |
| :------------- | :------------------------------------ |
| `pnpm i`       | 安装依赖                              |
| `pnpm dev`     | 启动开发服务器，地址 `localhost:4321` |
| `pnpm build`   | 构建生产版本到 `./dist/` 目录         |
| `pnpm preview` | 本地预览构建结果                      |
| `pnpm format`  | 使用 Prettier 格式化代码              |

## 致谢

本项目基于 [Gyoza](https://github.com/lxchapu/astro-gyoza) 模板构建，感谢原作者的开源贡献。
