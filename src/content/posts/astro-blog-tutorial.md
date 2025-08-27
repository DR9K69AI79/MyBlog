---
title: 快速搭建一个基于Astro框架的博客模板项目
date: 2025-08-10
summary: 本文作为首篇博客，将简单讲讲该站搭建与配置自动化的过程。
category: 实践记录
tags:
  - VibeCoding
comments: true
draft: false
sticky: 0
---
# 简介

本文作为网站正式上线首篇博客，会简单介绍一下网站配置部署以及实现的一些自动化流程。

首先本站是使用基于Astro架构的一个完善的博客模板项目，然后对部分功能进行二次开发，最后部署至了免费的GitHub Page托管服务上。在博文的推送更新上，考虑到我主要使用的Obsidian，所以这里基于Github Action联动了我的Obsidian Github仓库与博客仓库，最终实现了一套相对无感的自动化更新部署的方案。

# 配置项

以下是一些博客配置