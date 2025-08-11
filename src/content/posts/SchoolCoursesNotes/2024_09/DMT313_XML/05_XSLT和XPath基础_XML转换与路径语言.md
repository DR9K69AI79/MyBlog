---
title: XSLT 和 XPath 基础：XML 转换与路径语言
date: 2024-12-09
summary: 学习 XSLT 可扩展样式表转换语言的基础知识，包括 XML 文档转换、XPath 路径表达式、节点关系和操作符使用。
category: DMT313 XML设计技术
tags:
  - 课程笔记
  - XSLT
  - XPath
  - XML转换
  - 样式表语言
comments: true
draft: false
sticky: 0
---
# 第四章：XSLT 和 XPath（上）

## 概述
- **基本 XSLT**
- **XPath 和节点**
- **XPath 语法**
- **操作符**

# XSLT 和 XPath 简介

> **XML 数据的一个挑战是如何将其以易于阅读的格式呈现出来。**

- **XSL** 是一种基于 XML 的样式表语言，包含以下四部分：
  1. **XSLT**：用于转换 XML 文档。
  2. **XPath**：用于导航 XML 文档中的元素和属性。
  3. **XQuery**：用于查找和提取 XML 文档中的元素和属性。
  4. **XSLT-FO**：用于格式化 XML 文档（已于 2013 年停用）。

## **XSLT**：可扩展样式表转换语言

- 将 **XML** 文档转换为其他格式（如 HTML、PDF、RTF 等）。
- **文件扩展名**：`.xsl`
- **功能**：
  - 将 XML 元素转换为 HTML 元素。
  - 增加/删除输出文件中的元素或属性。
  - 排列和排序元素。
  - 执行测试并决定隐藏或显示哪些元素。
  
> **转换的执行方式**：
> 1. **服务器端转换**：客户端请求服务器生成结果文档。
> 2. **客户端转换**：客户端请求 XML 文档和样式表，并通过浏览器完成转换。

## **创建 XSLT 样式表**

- **语法**：
```xml
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <!-- 样式表内容 -->
</xsl:stylesheet>
```

- **绑定样式表到 XML**：
```xml
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
```

## **XPath**：XML 路径语言

- **定义**：使用路径表达式选择节点或节点集。
- **节点类型**：
  1. **根/文档节点**
  2. **元素节点**
  3. **属性节点**
  4. **文本节点**
  5. **命名空间节点**
  6. **处理指令节点**
  7. **注释节点**
  
### **节点关系**
| 术语       | 说明                                 |
|------------|--------------------------------------|
| **父节点** | 包含其他节点的节点                     |
| **子节点** | 被父节点包含的节点                     |
| **兄弟节点** | 共享同一父节点的节点                  |
| **祖先节点** | 当前节点的父节点及其上层父节点          |
| **后代节点** | 当前节点的子节点及其所有下层子节点      |

## **XPath 语法**

- **常见路径表达式**：
  - `/`：从根节点开始。
  - `//`：匹配文档中的所有符合条件的节点。
  - `@`：选择属性。

- **示例代码**：
```xml
<bookstore>
    <book>
        <title>Everyday Italian</title>
        <price>30.00</price>
    </book>
</bookstore>
```

| 表达式                      | 说明                   | 返回值                    |
|-----------------------------|------------------------|---------------------------|
| `/bookstore/book/title`     | 选择所有书籍的标题     | `<title>` 元素的节点集    |
| `/bookstore/book[1]/title`  | 选择第一本书的标题     | `<title>` 节点集          |
| `/bookstore/book[price>35]` | 选择价格大于 35 的书籍 | `<book>` 元素节点集       |

## **XPath 通配符**

- **示例**：
  - `*`：匹配任何元素节点。
  - `@*`：匹配任何属性节点。

- **选择文本节点**：
  - `text()`
  - 示例：`//sName/text()`

## **XPath 操作符**

| 操作符 | 描述        | 示例                           |
|--------|-------------|--------------------------------|
| `=`    | 等于        | `/bookstore/book[price=30]`   |
| `>`    | 大于        | `/bookstore/book[price>35]`   |
| `<`    | 小于        | `/bookstore/book[price<30]`   |
| `or`   | 或者        | `/bookstore/book[price>30 or price<20]` |

### 练习题

1. `/bookstore/book/title`  
2. `/bookstore/book[1]/title`  
3. `/bookstore/book/price[text()]`  
4. `/bookstore/book[price>35]/price`  
5. `/bookstore/book[price>35]/title`  

## **附加内容：XAMPP 安装**

- **XAMPP** 是一组用于安装和运行开发服务器的应用程序。
- **安装步骤**：
  1. 下载 [XAMPP](https://www.apachefriends.org/index.html)。
  2. 修改配置文件以适配系统需求。