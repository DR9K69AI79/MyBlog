---
title: 快速搭建并部署一个基于Astro框架的博客模板项目
date: 2025-08-10
summary: 简单介绍一下本站配置部署以及实现的一些自动化流程。
category: 实践记录
tags:
  - VibeCoding
comments: true
draft: false
sticky: 0
---
# 简介

本站使用了一个基于Astro架构的完善的博客模板项目，对部分功能进行二次开发，最后部署至了免费的GitHub Page托管服务上。

在博文的推送更新上，考虑到我主要使用Obsidian进行记录与知识管理，所以这里基于Github Action联动了我的Obsidian Github仓库与博客仓库，最终实现了一套相对无感的自动化更新部署的方案。

# 基本配置

我这里选择了一个基于Astro架构的开源博客模板，整体设计风格简洁动效与视效都算得上精致。首先通过Fork操作获取模板项目的副本，然后使用Git Clone将项目下载到本地进行配置：

这里我直接使用GitHub Copilot对项目结构进行分析，识别出需要自定义配置的关键文件。主要涉及以下文件的修改：

- **`src/config.ts`** - 网站全局配置（标题、描述、社交链接等）
- **`src/pages/about.md`** - 关于页面内容
- **`src/content/config.ts`** - 内容集合配置
- **`public/`** 目录下的静态资源文件

具体的配置我也使用了Copilot：先让AI工具分析项目结构并生成了一个配置清单md文档，然后手动填空具体信息，最后再由agent模式自主完成批量修改。

# 自动化更新流程
基于Github的Action功能，配合Obsidian实现博文更新自动化流程。核心逻辑是当我的Obsidian仓库commit并push时，如果`BLOG_Ready`目录下存在更改，则触发`sycn_blog`的GitHub Action对`posts`目录下的所有变更博客md进行增删改的同步。
## 脚本系统架构

自动化更新流程的核心是一个基于Python的脚本系统，负责处理从Obsidian到博客的完整内容转换和同步流程。

### 目录结构

```
BLOG_Ready/
├── scripts/
│   ├── blog_processor.py      # 主处理器，协调整个工作流
│   ├── frontmatter_fixer.py   # 前置信息标准化处理器
│   ├── markdown_converter.py  # Markdown语法转换器
│   ├── github_syncer.py       # GitHub仓库同步器
│   └── utils/                 # 工具函数模块
├── posts/                     # 已发布的博文
├── drafts/                    # 草稿文件夹
├── assets/                    # 图片和资源文件
├── .blog-meta/                # 系统配置和缓存
└── requirements.txt           # Python依赖包
```

### 各模块职能详解

#### 1. BlogProcessor (主处理器)
**作用**: 整个自动化流程的指挥中心，负责协调各个子模块的工作。
- 提供命令行接口，支持多种处理模式
- 管理处理队列和错误处理
- 生成处理报告和统计信息
- 支持预览模式和选择性处理

#### 2. FrontmatterFixer (前置信息处理器)
**作用**: 确保每篇博文都有符合Astro规范的标准前置信息。
- 自动生成缺失的日期（使用文件创建时间）
- 标准化标题、分类、标签等字段
- 验证必填字段的完整性
- 处理数据类型转换（如sticky字段的数值化）

#### 3. MarkdownConverter (语法转换器)
**作用**: 将Obsidian特有的语法转换为标准Markdown格式。
- 内部链接转换：`[文章](/posts/文章)` → `[文章](/posts/文章)`
- 图片引用转换：`![图片](/images/posts/图片.png)` → `![图片](/images/posts/图片.png)`
- 高亮文本转换：`<mark>文本</mark>` → `<mark>文本</mark>`
- 处理其他Obsidian特有的语法元素

#### 4. GitHubSyncer (仓库同步器)
**作用**: 负责与GitHub博客仓库的双向同步。
- 管理文件的增、删、改操作
- 处理GitHub API的调用和错误重试
- 支持批量处理以提高效率
- 维护同步状态和冲突处理

## 完整运行逻辑

当Obsidian仓库接收到新的`git push`时，一个预设的GitHub Actions工作流便会自动触发。该工作流会首先检查`BLOG_Ready/`目录下是否有文件变更，以此判断是否需要执行后续的博客同步任务。

一旦检测到变更，脚本系统便会启动一个精细的内容处理管道。它会扫描`posts`目录，找出所有发生变化的文件，并逐一进行处理。首先，`FrontmatterFixer`模块会介入，确保每篇文章的元数据（如标题、日期、标签等）都符合Astro博客系统的规范，自动补全缺失字段并修正格式。紧接着，`MarkdownConverter`模块会将Obsidian特有的双链、图片引用等语法转换为标准的Markdown格式，确保内容在博客上能正确渲染。

在处理过程中，系统包含了一些容错与优化的机制设计。例如，同步失败时，设置了3次自动重试；文件处理出错，能够暂时跳过文件并继续处理其余部分，同时记录错误日志；同步基于增量更新的策略，只处理有变动的文件。

经过这一系列自动化的处理、转换与验证，最终生成的内容会被`GitHubSyncer`模块同步到博客所在的GitHub仓库。这个动作会触发博客站点的重新构建和部署流程，最终将更新后的文章发布到线上。