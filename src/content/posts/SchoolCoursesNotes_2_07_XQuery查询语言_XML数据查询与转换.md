---
title: DMT313_XML-07-XQuery 查询语言：XML 数据查询与转换
date: 2024-12-09
summary: 学习 XQuery 查询语言的基础知识，包括 FLWOR 表达式、条件查询、HTML 生成以及与 XSLT 的结合使用。
category: DMT313 XML设计技术
tags:
  - 课程笔记
  - XQuery
  - XML查询
  - FLWOR表达式
  - 数据转换
comments: true
draft: false
sticky: 0
---
# 第五章：XQuery

## 概述
- **XQuery 与 XPath**：
  - 基于 XPath 表达式构建。
  - 共享相同的数据模型，支持相同的函数和操作符。
- **XQuery 文件格式**：`.xq`, `.xqy`
- **XQuery 的用途**：
  - 提取信息。
  - 将 XML 数据转换为 XHTML。
  - 生成汇总报告。
  - 搜索网页文档中的相关信息。

## XQuery 的主要特性
- **数据过滤**：通过条件选择特定节点（如 `where` 子句）。
- **排序**：根据条件对数据排序（如 `order by`）。
- **聚合操作**：汇总数据（如 `count`, `sum`）。
- **输出格式化**：生成 HTML、XML 或纯文本。

## XQuery 语法
- **大小写敏感**。
- 字符串值可用单引号或双引号。
- 变量以 `$` 开头（如 `$bookstore`）。
- 注释格式：`(: 注释内容 :)`。

```xml
(: 示例代码 :)
let $x := doc("books.xml")//book
return $x/title
```

## FLWOR 表达式
FLWOR 表达式（发音为"flower"）由以下部分组成：
1. **For**：遍历节点序列。
2. **Let**：绑定变量到节点序列。
3. **Where**：过滤节点。
4. **Order by**：排序节点。
5. **Return**：返回结果。

### 示例
```xml
let $books := doc("books.xml")//book
for $book in $books
where $book/price > 20
order by $book/title
return $book/title
```

## XQuery 与 HTML 的结合
可以通过 XQuery 生成 HTML 格式的结果：
- **示例**：生成 HTML 列表。
```xml
let $books := doc("books.xml")//book
return <ul>
  {for $book in $books
    return <li>{$book/title}</li>}
</ul>
```

**结果**：
```html
<ul>
  <li>Book Title 1</li>
  <li>Book Title 2</li>
</ul>
```

## 条件表达式
- 使用 `if-then-else`。
- 必须使用括号 `()`。

### 示例
```xml
for $book in doc("books.xml")//book
return if ($book/price > 20)
       then $book/title
       else "Affordable"
```

## 环境设置
### 工具推荐
| 工具名称      | 描述                                           |
|---------------|-----------------------------------------------|
| **BaseX**     | 开源 XML 数据库和 XQuery 处理器，界面友好。       |
| **Saxon**     | 支持 XQuery 和 XSLT 的处理器，用于 XML 转换和查询。 |
| **eXist-db**  | 高级 XML 管理的数据库工具。                     |
| **MarkLogic** | 企业级 XML 数据库解决方案。                    |
| **Oxygen**    | XML 编辑器，支持 XQuery 和 XSLT。              |

## XQuery 与 XSLT 的结合
- **增强的数据操作**：XQuery 的查询能力与 XSLT 的强大转换功能相辅相成。
- **灵活的数据输出**：适用于需要复杂查询和格式化的应用场景。
- **提高效率**：减少了同时进行查询和样式处理时的代码量。

### 操作步骤
1. 在 BaseX 中运行 XQuery 查询 XML 数据。
2. 保存查询结果为 XML 文件。
3. 打开 XML 和 XSLT 文件，应用样式转换生成所需格式的文件（如 HTML）。
```markdown
query.xqy -> result.xml
style.xsl -> transform.html
```

## 输出注意事项
- 缺少 XML 声明不会影响 XSLT 的转换过程，但建议显式声明编码（通常为 UTF-8）。
```xml
<?xml version="1.0" encoding="UTF-8"?>
```