---
title: 高数2 - 第10章 参数方程与极坐标
date: 2024-03-23
summary: 本章介绍参数方程定义的曲线、参数曲线的微积分、极坐标系统、极坐标下的面积与长度计算，以及圆锥曲线的性质和方程。
category: G0212_Introduction to Advanced Mathematics II
tags:
  - 课程笔记
  - 高等数学
  - 参数方程
  - 极坐标
  - 圆锥曲线
comments: true
draft: false
sticky: 0
---
# 第10章 参数方程与极坐标

## 10.1 由参数方程定义的曲线

- **参数方程定义**：平面曲线可以由一对参数方程定义：

$$
x = f(t), \quad y = g(t), \quad t \in [a, b]
$$

- **起点和终点**：
  - 起点：$P(x(a), y(a))$
  - 终点：$Q(x(b), y(b))$

- **圆的参数方程**：圆心在$(h,k)$，半径为$r$的圆的参数方程为：

$$
\begin{cases}
  x = h + r\cos t \\
  y = k + r\sin t
  \end{cases}
$$

## 10.2 参数曲线的微积分

- **切线斜率**：设$f$和$g$是可微函数，参数曲线$x=f(t),y=g(t)$上一点的切线斜率为：

$$
\frac{dy}{dx} = \frac{dy/dt}{dx/dt}, \quad \text{其中} \quad \frac{dx}{dt} \neq 0
$$

- **弧长公式**：参数曲线$x=f(t),y=g(t),a \leq t \leq b$的弧长为：

$$
L = \int_a^b \sqrt{\left(\frac{dx}{dt}\right)^2 + \left(\frac{dy}{dt}\right)^2} dt
$$

## 10.3 极坐标

- **极坐标定义**：给定平面上一点$P(x,y)$，设$r=\sqrt{x^2+y^2}$为其到原点$O$的距离，$\theta$为$OP$与正$x$轴的夹角。则$(r,\theta)$称为点$P$的极坐标。

- **坐标转换**：

$$
\begin{cases}
  x = r\cos\theta \\
  y = r\sin\theta
  \end{cases}
$$

- **极曲线**：极方程$r=f(\theta)$或更一般地$F(r,\theta)=0$的图形由所有极坐标满足方程的点$P$组成。

- **切线斜率**：极曲线$r=f(\theta)$的切线斜率为：

$$
\frac{dy}{dx} = \frac{dr/d\theta \cdot \sin\theta + r\cos\theta}{dr/d\theta \cdot \cos\theta - r\sin\theta}
$$

## 10.4 极坐标下的面积与长度

- **扇形面积**：$A = \frac{1}{2}r^2\theta$

- **极坐标区域面积**：如果区域$R$由曲线$r=f(\theta)$和射线$\theta=a$与$\theta=b$所围成，则其面积为：

$$
A = \frac{1}{2} \int_a^b [f(\theta)]^2 d\theta
$$

- **极坐标弧长**：极曲线$r=f(\theta),a \leq \theta \leq b$的弧长为：

$$
L = \int_a^b \sqrt{r^2 + \left(\frac{dr}{d\theta}\right)^2} d\theta
$$

## 10.5 圆锥曲线

- **圆锥曲线定义**：圆锥曲线（Conic Sections），简称二次曲线，是平面与圆锥相交得到的曲线。

- **抛物线**（Parabolas）：
  - $y = ax^2, \quad a \neq 0$
  - $x = ay^2, \quad a \neq 0$

- **椭圆**（Ellipses）：
  - $\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1, \quad a \geq b > 0$
  - $\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1, \quad b \geq a > 0$

- **双曲线**（Hyperbolas）：
  - $\frac{x^2}{a^2} - \frac{y^2}{b^2} = 1, \quad a \neq 0, b \neq 0$
  - $\frac{y^2}{a^2} - \frac{x^2}{b^2} = 1, \quad a \neq 0, b \neq 0$

- **平移二次曲线**：通过适当的平移消去一次项，可以确定方程所表示的二次曲线类型。