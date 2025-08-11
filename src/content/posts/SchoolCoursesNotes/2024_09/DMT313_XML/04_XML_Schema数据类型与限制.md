---
title: XML Schema数据类型与限制
date: 2024-12-09
summary: 深入介绍XML Schema的内置数据类型、自定义派生类型、限制机制和正则表达式应用，提供完整的数据验证解决方案。
category: DMT313 XML设计技术
tags:
  - 课程笔记
  - XML
  - XML Schema
  - 数据类型
  - 正则表达式
comments: true
draft: false
sticky: 0
---
# 第三章：XML Schema（下）

## 概述
- **内置数据类型**
- **自定义派生数据类型**
- **限制（Restrictions）**
- **第一部分回顾**

---

## 内置数据类型

### 特点
- 是 XML Schema 词汇表的一部分，必须使用命名空间。
- 包含两类：
  - **原始类型**（Primitive）：19 种。
  - **派生类型**（Derived）：25 种，基于原始类型进行修改。

### 字符串数据类型
- 允许几乎任何文本字符串用于元素和属性。
- 在控制内容方面不太有用，可通过派生类型增加限制。

### 数值数据类型
- XML Schema 支持数值数据类型，这在 DTD 中不支持。

### 日期和时间数据类型
- 日期格式：`yyyy-mm-dd`（如 `2017-01-08`）。
- 时间格式：24 小时制 `hh:mm:ss`（如 `15:45:30`）。

---

## 派生数据类型

### 自定义数据类型
- 可以基于内置或用户定义的词汇表派生新的数据类型。
- **语法**：
  ```xml
  <xs:simpleType name="newType">
      <xs:restriction base="baseType">
          <xs:minInclusive value="0"/>
          <xs:maxInclusive value="120"/>
      </xs:restriction>
  </xs:simpleType>
  ```

### 列表数据类型
- 值用空格分隔的列表。
- 示例：
  ```xml
  <xs:simpleType name="GPAList">
      <xs:list itemType="xs:decimal"/>
  </xs:simpleType>
  ```

### 限制数据类型
- 定义 XML 元素或属性的可接受值（称为“facets”）。
- 示例：
  ```xml
  <xs:simpleType name="CarType">
      <xs:restriction base="xs:string">
          <xs:enumeration value="Audi"/>
          <xs:enumeration value="BMW"/>
      </xs:restriction>
  </xs:simpleType>
  ```

---

## 使用正则表达式的限制

### 正则表达式的作用
- 定义字符模式。
- 示例：
  ```xml
  <xs:simpleType name="IDPattern">
      <xs:restriction base="xs:string">
          <xs:pattern value="[A-Z]{2}\d{4}"/>
      </xs:restriction>
  </xs:simpleType>
  ```
- **解释**：
  - `[A-Z]{2}`：两个大写字母。
  - `\d{4}`：四个数字。

### 常见字符集定义
| **模式**         | **含义**                             |
|-------------------|-------------------------------------|
| `[a-z]`          | 小写字母                           |
| `[A-Z]`          | 大写字母                           |
| `[0-9]`          | 数字 0-9                          |

---

## 使用量词
- 指定字符或字符集的出现次数。
- 示例：
  ```xml
  <xs:pattern value="[A-Z]{2}-\d{4}"/>
  ```

---

## XML 验证步骤

### 实验步骤
1. 创建完整的 XML 文档。
2. 确定简单类型或复杂类型内容。
3. 创建 XSD 文档。
4. 编写验证规则。
5. 将 XML 文档链接到 XSD 文档。
6. 验证文档。

---

## 复习：简单类型与复杂类型

### 简单类型
- 仅包含文本，无嵌套元素。

### 复杂类型
- 包含两个或多个值或元素。