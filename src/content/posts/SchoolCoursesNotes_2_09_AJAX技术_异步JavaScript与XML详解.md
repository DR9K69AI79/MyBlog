---
title: XML-09-AJAX 技术：异步 JavaScript 与 XML 详解
date: 2024-12-09
summary: 学习 AJAX 异步技术的核心概念，包括工作原理、XMLHttpRequest 对象、优缺点分析以及实际应用示例。
category: DMT313_XML Design Technology
tags:
  - 课程笔记
  - AJAX
  - 异步技术
  - XMLHttpRequest
  - JavaScript
comments: true
draft: false
sticky: 0
---
# 第七章：AJAX

## 概述
- **什么是 AJAX？**
- 历史
- 组成部分
- 处理流程
- 优缺点
- 示例

# 什么是 AJAX？

> **AJAX（Asynchronous JavaScript and XML）**  
> 是一种异步技术，可以在不重新加载整个页面的情况下与服务器交互。

### 核心特点
- **异步性**：可在发送请求后继续用户交互，无需等待服务器响应。
- **局部更新**：仅更新指定的页面区域。
- **后台传输**：可在页面加载后与服务器通信。

### 开发者的优势
- 更新网页无需刷新整个页面。
- 在页面加载后请求服务器数据。
- 接收服务器数据。
- 在后台将数据发送到服务器。

### 示例
- [试试 AJAX 示例](https://www.w3schools.com/xml/tryit.asp?filename=tryajax_first)

# 历史

- **静态网页时代**：
  - 网页内容固定，无用户交互。

- **动态网页时代**：
  - 支持用户交互，但性能随着功能增加而降低。

- **AJAX 的诞生**：
  - 解决动态网页性能瓶颈，提高用户体验。

# 为什么 AJAX 很重要？

### 优势
- 提供接近响应式和丰富的用户体验。
- 降低维护成本，仅加载需要更改的页面部分。
- 减少网络流量，提升性能。

## AJAX 的工作原理

1. 用户点击按钮后，JavaScript 和 XHTML 立即更新用户界面。
2. 使用 JavaScript 和 XMLHttpRequest 对象异步向服务器发送请求。
3. 响应到达后，JavaScript、CSS 和 DOM 更新界面。
4. 整个过程无需刷新页面，用户几乎无感知。

# 组成部分

| 技术        | 描述                                                                 |
|-------------|----------------------------------------------------------------------|
| **XHTML**   | 结合 HTML4.01 和 XML 的语法，定义页面结构。                          |
| **CSS**     | 定义页面呈现样式。                                                   |
| **DOM**     | 提供标准 API，支持动态交互和事件处理。                               |
| **XML**     | 用于数据交换与处理的标记语言。                                       |
| **JavaScript** | 脚本语言，将以上技术结合，形成 AJAX 的"模式"。                     |
| **XMLHttpRequest 对象** | 支持客户端与服务器交互，而无需刷新整个页面。               |

## XMLHttpRequest 对象

### 常用方法
- **open()** 和 **send()**：向服务器发送请求。
  - **GET**：简单快速，适合少量数据。
  - **POST**：适合发送大量或敏感数据。

### 属性
- **onreadystatechange**：定义状态变化时的回调函数。
- **readyState**：请求状态。
- **status**：HTTP 响应状态。
- **responseText**：返回服务器响应。

### 示例代码
```xml
let xhr = new XMLHttpRequest();
xhr.open("GET", "data.xml", true);
xhr.onreadystatechange = function() {
  if (xhr.readyState =<mark> 4 && xhr.status </mark>= 200) {
    console.log(xhr.responseText);
  }
};
xhr.send();
```

# 优缺点

## 优点
- **动态和快速**：支持快速构建动态网站。
- **减少服务器负载**：部分处理可在客户端完成。
- **节省网络带宽**：仅更新需要部分页面。

## 缺点
- 与老旧或稀有浏览器兼容性差。
- 用户可能禁用 JavaScript。
- 不支持页面状态书签功能。
- 浏览器后退按钮问题。
- 可能存在网络延迟问题。

# 示例应用
- **CD 集合**：  
  [查看示例](https://www.w3schools.com/xml/tryit.asp?filename=tryajax_xml2)  
  [更多 AJAX 应用](https://www.w3schools.com/xml/ajax_applications.asp)