---
title: CG-07-曲线控制与生成
date: 2024-05-30
summary: 本章介绍了计算机图形学中的曲线生成技术，重点讲解贝塞尔曲线和NURBS曲线的数学原理、控制点设置以及在OpenGL中的具体实现方法。
category: DMT201_Computer Graphics
tags:
  - 课程笔记
  - 计算机图形学
  - 贝塞尔曲线
  - NURBS
  - OpenGL
comments: true
draft: false
sticky: 0
---
# 第7章: 曲线控制与生成

## 贝塞尔曲线(Bezier Curve)

### 定义
贝塞尔曲线是计算机图形学中用于生成平滑曲线的一种参数曲线。

### OpenGL中使用贝塞尔曲线
#### 控制点设置
为了绘制贝塞尔曲线，首先需要指定控制点数组：
```plaintext
const int numcontrolpts = 4;  // 控制点数量
GLfloat controlpts[numcontrolpts][3] = {
    {-0.9, -0.9, 0.0},
    {-0.5, 0.2, 0.0},
    {0.9, -0.9, 0.0},
    {0.9, 0.9, 0.0}
};
```
#### 初始化求值器
使用`glMap1f`函数初始化一个求值器，设置曲线参数：
```plaintext
glMap1f(GL_MAP1_VERTEX_3, 0.0, 1.0, 3, numcontrolpts, &controlpts[0][0]);
```
#### 启用求值器
```plaintext
glEnable(GL_MAP1_VERTEX_3);
```
#### 绘制曲线
通过`glEvalCoord1d`函数使用求值器绘制曲线：
```plaintext
glBegin(GL_LINE_STRIP);
for (int i = 0; i <= numdrawsegs; ++i) {
    GLdouble t = GLdouble(i) / numdrawsegs;
    glEvalCoord1d(t);
}
glEnd();
```
#### 简化绘制过程
使用`glMapGrid1d`函数指定网格参数值，简化绘制过程：
```plaintext
glMapGrid1d(numdrawsegs, 0.0, 1.0);
```

## NURBS(非均匀有理B样条曲线)

### 定义
NURBS是一种通过控制点和权重因子定义的曲线，能够精确表达标准几何形状。

### 特点
- 控制点表示为齐次坐标系统，包含额外的缩放因子$h$。
- 控制点公式为$P_i = (x_i h_i, y_i h_i, z_i h_i, h_i)$，$h_i \neq 0$。
- 权重$h_i$作为每个点的标量权重，提供对曲线形状的额外控制。

### 应用
NURBS广泛用于表面设计，例如通过在xy平面上建模一个样条曲线，然后围绕y轴旋转该曲线生成旋转面。

---

## 数学公式示例
- 贝塞尔曲线参数公式:
  $$ P(t) = \sum_{i=0}^{n} B_{i,n}(t) \cdot P_i $$
  其中$B_{i,n}(t)$是贝塞尔基函数，$P_i$是控制点。

- NURBS曲线参数公式:
  $$ C(u) = \frac{\sum_{i=0}^{n} N_{i,p}(u) \cdot w_i \cdot P_i}{\sum_{i=0}^{n} N_{i,p}(u) \cdot w_i} $$
  其中$N_{i,p}(u)$是B样条基函数，$w_i$是权重，$P_i$是控制点。

这一章节详细介绍了如何在OpenGL中使用贝塞尔曲线和NURBS曲线进行图形生成，以及这些技术的数学基础和实际应用。