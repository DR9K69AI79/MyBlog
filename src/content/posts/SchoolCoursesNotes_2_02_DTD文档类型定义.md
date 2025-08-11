---
title: DMT313_XML-02-DTD文档类型定义
date: 2024-12-09
summary: 详细介绍DTD（文档类型定义）的概念、声明方式、元素属性定义，以及实体使用方法，帮助理解XML文档结构验证机制。
category: DMT313 XML设计技术
tags:
  - 课程笔记
  - XML
  - DTD
  - 文档验证
comments: true
draft: false
sticky: 0
---
# 第二章：DTD

## 概述
- DTD 简介
- 适用场景与不适用场景
- DTD 的声明方式
- 元素、属性与实体的定义

## 什么是 DTD？
> **DTD（Document Type Definition）** 用于定义 XML 文档的结构以及合法的元素和属性。
> DTD 可确保 XML 文档的有效性，但在创建 XML 时并非绝对必要。

### 功能
- 确保文档包含所有必需的元素
- 防止使用未定义的元素
- 强制遵循特定的数据结构
- 定义属性的使用和可能的取值
- 指定属性的默认值
- 指导解析器访问非 XML 或非文本内容

## 适用场景
- **适用**：
  - 需要验证数据时
- **不适用**：
  - 试验性 XML 项目或小型 XML 文件
  - 在应用程序开发中，规范尚未稳定时

## DTD 的声明方式
### 类型
1. **内部 DTD**：
   ```xml
   <!DOCTYPE example [
       <!ELEMENT example (#PCDATA)>
   ]>
   ```

2. **外部 DTD**：
   ```xml
   <!DOCTYPE example SYSTEM "example.dtd">
   ```
   **外部 DTD 示例**（`example.dtd` 文件）：
   ```xml
   <!ELEMENT example (#PCDATA)>
   ```

## 元素声明
### 元素内容类型
- **ANY**：可以存储任何内容
  ```xml
  <!ELEMENT anyElement ANY>
  ```
- **EMPTY**：不允许任何内容
  ```xml
  <!ELEMENT emptyElement EMPTY>
  ```
- **#PCDATA**：仅能包含解析的字符数据
  ```xml
  <!ELEMENT textElement (#PCDATA)>
  ```

### 子元素声明
- **顺序声明**：
  ```xml
  <!ELEMENT parent (child1, child2)>
  ```
- **选择声明**：
  ```xml
  <!ELEMENT parent (child1 | child2)>
  ```

### 修改符号
| 符号  | 说明                     |
|-------|--------------------------|
| `?`   | 0 次或 1 次              |
| `+`   | 1 次或多次              |
| `*`   | 0 次或多次              |

## 属性声明
- **语法**：
  ```xml
  <!ATTLIST elementName
      attributeName type defaultValue>
  ```
  
### 属性类型
| 类型         | 描述                               |
|--------------|------------------------------------|
| CDATA        | 任意字符数据（除保留字符外）       |
| ID           | 文档内唯一字符串                  |
| IDREF        | 引用文档内已声明的 ID             |
| ENUMERATION  | 枚举值                            |

### 属性默认值
| 默认值类型       | 描述                    |
|------------------|-------------------------|
| `#REQUIRED`      | 必须提供                |
| `#IMPLIED`       | 可选                   |
| `"defaultValue"` | 提供默认值（可选）      |
| `#FIXED "value"` | 固定值（可选）          |

## 实体的定义与引用
### 内部实体
```xml
<!ENTITY entityName "replacementText">
```

### 外部实体
```xml
<!ENTITY entityName SYSTEM "URL">
```

### 使用方法
```xml
&entityName;
```

## 注意事项
- 每个 XML 文档只能有一个 DTD
- 避免过多使用混合内容