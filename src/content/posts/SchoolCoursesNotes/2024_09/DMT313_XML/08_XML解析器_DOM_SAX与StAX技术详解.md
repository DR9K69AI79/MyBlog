---
title: XML 解析器：DOM、SAX 与 StAX 技术详解
date: 2024-12-09
summary: 深入学习 XML 解析器的工作原理，包括 DOM、SAX 和 StAX 三种解析方式的比较，以及 DOM 节点操作和修改方法。
category: DMT313 XML设计技术
tags:
  - 课程笔记
  - XML解析器
  - DOM
  - SAX
  - StAX
  - 节点操作
comments: true
draft: false
sticky: 0
---
# 第六章：XML 解析器

## 概述
  - 简介
  - 解析器的类型
  - DOM 的属性与方法
  - DOM 节点树
  - DOM 解析器访问 XML 元素值的方法：读取与修改

## 简介

> XML 解析器是一种能够读取并解释 XML 文档的程序，用于验证文档是否格式正确，并提供与客户端程序交互的接口。

- **日常定义**：读取和解释 XML 文档的程序。
  - 验证文档格式是否正确。
  - 主流浏览器都内置了 XML 解析器。

- **技术定义**：提供接口的库或包，供客户端程序操作 XML 文档。

## XML 解析过程

> XML 解析器读取 XML 文档并提供对其内容和结构的访问。

- **输入**：
  - 原始 XML 文档
  - 可选的 DTD 和 Schema 文件
  - 可选的 XSL 样式表

- **输出**：
  - 分为未解析数据和已解析数据。
  - 已解析数据包含字符数据和标记。

## XML 解析器类型

| 类型        | 示例       | 说明                                         |
|-------------|------------|--------------------------------------------|
| **基于对象** | DOM        | 将整个 XML 文档加载为内存中的树结构           |
| **基于事件** | SAX        | 事件驱动：触发事件（如 `startElement`）     |
|              | StAX       | 拉取解析：由应用程序控制解析进程             |

- **选择解析器依据**：编程语言、库或框架。

## DOM、SAX 与 StAX 比较

| 特性                | DOM                              | SAX                              | StAX                              |
|---------------------|-----------------------------------|-----------------------------------|-----------------------------------|
| **解析方法**        | 树结构                           | 事件驱动                         | 拉取解析                         |
| **内存使用**        | 高                               | 低                               | 低                               |
| **性能**            | 大文件性能较慢                   | 快                               | 类似 SAX，控制更灵活             |
| **访问方式**        | 随机访问                         | 顺序访问                         | 顺序访问，可按需拉取事件         |
| **修改能力**        | 支持修改                         | 只读解析                         | 只读解析                         |
| **错误处理**        | 加载完文档后检测错误             | 解析过程中检测错误               | 解析过程中检测错误               |
| **适用场景**        | 小型 XML 文档，需操作或修改      | 大型 XML 文件，流式处理          | 实时处理大数据流                 |

## 什么是 DOM？

> DOM（文档对象模型）：定义访问和操作 HTML/XML 文档的标准方法。

- **特点**：
  - 将文档表示为树状结构。
  - 可通过 DOM 更改 HTML/XML 的值。

- **方法示例**：
```xml
x = xmlDoc.getElementsByTagName("title")[0];
x.childNodes[0].nodeValue = "新的标题";
```

## XML DOM 节点

- **节点类型**：
  - 文档/根节点
  - 元素节点
  - 文本节点
  - 属性节点
  - 注释节点
  - 共 12 种类型

- **节点关系**：
  - **父节点**：除了根节点，每个节点都有一个父节点。
  - **子节点**：节点可包含任意数量的子节点。
  - **兄弟节点**：具有相同父节点的节点。

## 访问节点

1. **通过标签名称**：
   - 返回指定标签名称的所有元素。
```xml
x = xmlDoc.getElementsByTagName("title")[0];
```

2. **遍历节点树**：
   - 从根节点遍历。
```javascript
function traverse(node) {
    console.log(node.nodeName);
    for (let child of node.childNodes) {
        traverse(child);
    }
}
```

3. **通过节点关系导航**：
   - **父节点**：`parentNode`
   - **子节点**：`childNodes`
   - **兄弟节点**：`nextSibling`、`previousSibling`

## 修改节点值

1. **修改元素值**：
```javascript
x.childNodes[0].nodeValue = "新值";
```

2. **修改属性值**：
```javascript
x.setAttribute("class", "new-class");
```

3. **删除节点或属性**：
   - 删除节点：`removeChild()`
   - 删除属性：`removeAttribute()`

4. **替换节点或数据**：
```javascript
x.replaceChild(newNode, oldNode);
```

5. **创建新节点**：
```javascript
let newNode = document.createElement("newElement");
parentNode.appendChild(newNode);
```

## 实用参考链接

- [W3Schools XML DOM](https://www.w3schools.com/xml/dom_examples.asp)