---
title: XML-03-XML Schema基础与复杂类型定义
date: 2024-12-09
summary: 介绍XML Schema的概念、与DTD的比较、简单类型和复杂类型的定义方法，以及XML文档与Schema的链接方式。
category: DMT313_XML Design Technology
tags:
  - 课程笔记
  - XML
  - XML Schema
  - XSD
  - 数据验证
comments: true
draft: false
sticky: 0
---
# 第三章：XML Schema（上）

## 概述

- **XML Schema 与 DTD 比较**
- XML Schema 内容类型
  - 声明简单内容
    - 仅元素
    - 仅属性
  - 声明复杂内容
    - 空元素，仅包含属性
    - 包含文本和属性的元素
    - 包含文本和子元素的元素
    - 包含文本、属性和子元素的元素
- XML Schema 与 XML 文档的链接

---

## 简介

> **XML Schema** 是一种包含验证规则的 XML 文档，用于定义 XML 文档的合法组成部分。

- 又称 **XML Schema Definition (XSD)**
- **目的**：
  - 定义文档中的元素和属性
  - 确定子元素的数量和顺序
  - 元素和属性的数据类型
  - 元素和属性的默认值和固定值
- 与 DTD 的区别：
  - DTD 常用于验证，但 Schema 提供更强大的验证规则

---

## XML Schema 与 DTD 比较

| 特性                | DTD                                | XML Schema                              |
|---------------------|-------------------------------------|-----------------------------------------|
| 数据类型支持        | **有限**                          | **广泛**                               |
| 命名空间支持        | 不完全                             | 完全支持                               |
| 语法                | 与 XML 不同                       | 类似 XML                               |
| 使用场景            | 适合简单文档                      | 适合复杂验证需求的文档                 |

> 如果需要验证文档，可以选择 DTD 或 Schema，但不能同时使用。

---

## 简单类型与复杂类型

- **简单类型**：仅包含文本，无嵌套元素。
- **复杂类型**：包含多个值或元素。

### 定义简单类型元素

**语法**：
```xml
<xs:element name="元素名" type="数据类型"/>
```

**示例**：
```xml
<xs:element name="age" type="xs:integer"/>
```

### 定义简单类型属性

**语法**：
```xml
<xs:attribute name="属性名" type="数据类型" default="默认值" fixed="固定值"/>
```

**示例**：
```xml
<xs:attribute name="id" type="xs:string" fixed="SI###-###-##"/>
```

---

## 定义复杂类型元素

### 类型分类

1. 空元素，仅含属性。
2. 含文本和属性的元素。
3. 含子元素，无属性的元素。
4. 含子元素和属性的元素。

**基本语法**：
```xml
<xs:complexType>
    <!-- 声明的内容因类别而异 -->
</xs:complexType>
```

### 定义仅包含属性的元素

**示例**：
```xml
<xs:element name="person">
    <xs:complexType>
        <xs:attribute name="id" type="xs:string"/>
    </xs:complexType>
</xs:element>
```

### 定义包含文本和属性的元素

**示例**：
```xml
<xs:element name="grade">
    <xs:complexType>
        <xs:simpleContent>
            <xs:extension base="xs:string">
                <xs:attribute name="scale" type="xs:string"/>
            </xs:extension>
        </xs:simpleContent>
    </xs:complexType>
</xs:element>
```

---

## 子元素的声明

### 组合器类型

- **sequence**：子元素按顺序出现。
- **choice**：子元素中任意一个出现即可。
- **all**：所有子元素可以按任意顺序出现，但每个最多一次。

**示例**：
```xml
<xs:element name="address">
    <xs:complexType>
        <xs:sequence>
            <xs:element name="street" type="xs:string"/>
            <xs:element name="city" type="xs:string"/>
            <xs:element name="state" type="xs:string"/>
        </xs:sequence>
    </xs:complexType>
</xs:element>
```

---

## XML Schema 与 XML 文档的链接

**语法**：
```xml
<root xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
      xsi:noNamespaceSchemaLocation="schema文件路径.xsd">
</root>
```

**说明**：
- **xsi:noNamespaceSchemaLocation**：用于未关联命名空间的 XSD 文件。
- **xsi:schemaLocation**：用于关联多个 XSD 文件的命名空间。

**示例**：
```xml
<students xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xsi:noNamespaceSchemaLocation="students.xsd">
</students>
```

---

## 数量控制

**语法**：
```xml
<xs:element name="student" minOccurs="1" maxOccurs="3"/>
```

**解释**：
- **minOccurs**：最小出现次数，0 表示可选。
- **maxOccurs**：最大出现次数，unbounded 表示无限次。

**示例**：
```xml
<xs:element name="student" minOccurs="1" maxOccurs="3"/>
```

> 此示例要求 `student` 元素最少出现一次，最多三次。
---

## 练习题区域

以下练习题帮助巩固 XML Schema 的学习内容。

### 练习题 1：定义简单类型
创建一个 XML Schema 文件，定义一个名为 `book` 的元素，该元素包含以下内容：
- `title`：文本内容，类型为字符串。
- `author`：文本内容，类型为字符串。

**提示**：使用简单类型。

---

### 练习题 2：定义复杂类型
编写一个 XML Schema 文件，描述一个名为 `order` 的复杂类型，要求包括：
- 一个名为 `customerID` 的属性，类型为字符串。
- 包含以下子元素：
  - `product`：包含 `name` 和 `price` 两个子元素。
  - `quantity`：表示数量，类型为整数。

**提示**：使用 `sequence` 定义子元素的顺序。

---

### 练习题 3：链接 XML Schema
给定一个 XML 文件，如何正确链接外部 XML Schema 文件？提供 XML 和 Schema 文件的完整代码。

**示例练习**：
- `students.xml` 文件：
  ```xml
  <students xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
            xsi:noNamespaceSchemaLocation="students.xsd">
      <student>
          <name>John Doe</name>
          <age>21</age>
      </student>
  </students>
  ```

- `students.xsd` 文件：
  ```xml
  <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
      <xs:element name="students">
          <xs:complexType>
              <xs:sequence>
                  <xs:element name="student" maxOccurs="unbounded">
                      <xs:complexType>
                          <xs:sequence>
                              <xs:element name="name" type="xs:string"/>
                              <xs:element name="age" type="xs:integer"/>
                          </xs:sequence>
                      </xs:complexType>
                  </xs:element>
              </xs:sequence>
          </xs:complexType>
      </xs:element>
  </xs:schema>
  ````

---

### 练习题 4：数量限制
设计一个 XML Schema，定义一个名为 `course` 的元素，该元素必须包含以下子元素：
- 至少一个 `module`，最多五个。

**提示**：使用 `minOccurs` 和 `maxOccurs`。

---

### 扩展阅读
- [W3Schools XML Schema](https://www.w3schools.com/xml/schema_intro.asp)
- [XML Schema Reference by MDN](https://developer.mozilla.org/en-US/docs/Web/XML/XML_Schema)