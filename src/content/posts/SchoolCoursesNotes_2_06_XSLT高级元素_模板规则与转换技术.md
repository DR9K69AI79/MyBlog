---
title: XML-06-XSLT 高级元素：模板规则与转换技术
date: 2024-12-09
summary: 深入学习 XSLT 高级元素，包括模板规则、条件处理、循环遍历、排序以及客户端 XML 到 XHTML 转换技术。
category: DMT313_XML Design Technology
tags:
  - 课程笔记
  - XSLT
  - XML转换
  - 模板规则
  - 客户端转换
comments: true
draft: false
sticky: 0
---
# 第四章：XSLT 和 XPath（下）

## 概述
  - `<xsl:template>` 元素
  - `<xsl:value-of>` 元素
  - `<xsl:for-each>` 元素
  - `<xsl:sort>` 元素
  - `<xsl:if>` 元素
  - `<xsl:choose>` 元素
  - `<xsl:apply-template>` 元素
  - 客户端转换代码

## 简介
> **XSLT 样式表**由一组模板规则组成，每个模板规则指定如何处理匹配的节点。

- **语法**：
  - 模板通常定义在 `<xsl:stylesheet>` 标签之后。
  - `match` 属性用于将模板与 XML 文档关联，`"/"` 定义整个文档。
  - **节点集**：XPath 表达式引用源文档中的节点集合。
  - **样式**：XSLT 样式应用到这些节点。

## XSLT 元素详解

### `<xsl:template>`
- **作用**：定义处理 XML 数据的规则。
- **用法示例**：
  - 示例 XML 文件：`cdcatalog.xml`
  - 示例 XSL 文件：`cdcatalog.xsl`

### `<xsl:value-of>`
- **作用**：提取选定节点的值。
- **特点**：
  - 仅复制 XML 文档中的一行数据到输出。
- **示例链接**：[查看演示结果](https://www.w3schools.com/xml/tryxslt.asp?xmlfile=cdcatalog&xsltfile=cdcatalog_ex2)

### `<xsl:for-each>`
- **作用**：实现 XSLT 中的循环功能。
- **特点**：
  - 可通过 XPath 表达式中的谓词过滤输出。
- **示例链接**：
  - [普通循环示例](https://www.w3schools.com/xml/tryxslt.asp?xmlfile=cdcatalog&xsltfile=cdcatalog_ex3)
  - [带过滤条件的循环](https://www.w3schools.com/xml/tryxslt.asp?xmlfile=cdcatalog&xsltfile=cdcatalog_filter)

### `<xsl:sort>`
- **作用**：对输出结果排序。
- **用法**：
  - 应放在 `<xsl:for-each>` 元素内部。
- **示例链接**：[查看排序结果](https://www.w3schools.com/xml/tryxslt.asp?xmlfile=cdcatalog&xsltfile=cdcatalog_sort)

### `<xsl:if>`
- **作用**：对 XML 文件内容执行条件测试。
- **语法**：
```xml
<xsl:if test="condition">
  <!-- 输出内容 -->
</xsl:if>
```
- **示例链接**：[条件测试示例](https://www.w3schools.com/xml/tryxslt.asp?xmlfile=cdcatalog&xsltfile=cdcatalog_if)

### `<xsl:choose>`
- **作用**：配合 `<xsl:when>` 和 `<xsl:otherwise>` 实现多条件测试。
- **语法**：
```xml
<xsl:choose>
  <xsl:when test="condition1">
    <!-- 输出1 -->
  </xsl:when>
  <xsl:otherwise>
    <!-- 默认输出 -->
  </xsl:otherwise>
</xsl:choose>
```
- **示例链接**：
  - [示例 1](https://www.w3schools.com/xml/tryxslt.asp?xmlfile=cdcatalog&xsltfile=cdcatalog_choose)
  - [示例 2](https://www.w3schools.com/xml/tryxslt.asp?xmlfile=cdcatalog&xsltfile=cdcatalog_choose2)

### `<xsl:apply-templates>`
- **作用**：对当前元素或其子节点应用模板。
- **特点**：
  - 无 `select` 属性：按照 XML 树结构层次处理模板。
  - 有 `select` 属性：仅处理匹配属性值的子节点，并按指定顺序处理。
- **示例链接**：[查看应用结果](https://www.w3schools.com/xml/tryxslt.asp?xmlfile=cdcatalog&xsltfile=cdcatalog_apply)

## 客户端 XML 转换为 XHTML

### 步骤：
1. 创建 XHTML 文件。
2. 在 `<head>` 标签内放置 `<script>` 标签。
3. 在 `<script>` 标签中编写 JavaScript。
4. 在 `<body>` 标签中使用 `onload` 属性引用 JavaScript。
5. 将转换后的 XML 元素显示在 `<div>` 标签中。

### JavaScript 关键函数：
#### `loadXMLDoc()`
- **作用**：
  - 创建 `XMLHttpRequest` 对象。
  - 通过 `open()` 和 `send()` 方法发送请求。
  - 获取 XML 数据响应。

#### `displayResult()`
- **作用**：
  - 加载 XML 和 XSL 文件。
  - 根据浏览器类型选择不同处理方式：
    - **IE**：使用 `transformNode()` 方法。
    - **其他浏览器**：使用 `XSLTProcessor` 对象和 `transformToFragment()` 方法。

### 示例代码：
```xml
<script>
function loadXMLDoc() {
  // XMLHttpRequest 逻辑
}
function displayResult() {
  // 处理逻辑
}
</script>
```

## 案例研究：金融数据的浏览器友好展示
> **背景**：
> Rafael Garcia 希望将包含 15 种股票数据的 XML 文档转换为 HTML 格式，以便更易于阅读和显示。

### 实现方法：
- 使用 XSLT 将 XML 数据转换为 HTML 文件。
- 显示于网页浏览器中。