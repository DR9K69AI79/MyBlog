---
title: "高数2 - 第15章 多重积分"
date: 2024-03-23
summary: "本章介绍二重积分和三重积分的概念和计算方法，包括在矩形区域和一般区域上的积分、极坐标下的二重积分、柱坐标系和球坐标系下的三重积分，以及多重积分中的变量替换。"
category: "G0212_Introduction to Advanced Mathematics II"
tags:
  - 课程笔记
  - 高等数学
  - 多重积分
  - 极坐标
  - 柱坐标
  - 球坐标
comments: True
draft: False
sticky: 0
---
# 第15章 多重积分

## 15.1 二重积分在矩形上的定义

- 定积分的回顾：
  $\int_a^b f(x) dx = \lim_{n\to\infty} \sum_{i=1}^n f(x_i^*) \Delta x$
- 二重积分的定义：设函数$f$是定义在闭矩形$R$上的二元函数，如果极限
  
$$
\lim_{m,n\to\infty} \sum_{i=1}^m \sum_{j=1}^n f(x_{ij}^*, y_{ij}^*) \Delta A
$$

  存在，则称$f$在$R$上可积，并把这个极限记为$\iint_R f(x,y) dA$，称为$f$在$R$上的二重积分。
- 可积性定理：如果$f$在闭矩形$R$上有界，并且除去有限条光滑曲线外，$f$在$R$上连续，则$f$在$R$上可积。特别地，如果$f$在$R$上连续，则$f$在$R$上可积。
- 二重积分的性质：
  1. $\iint_R kf(x,y) dA = k \iint_R f(x,y) dA$
  2. $\iint_R [f(x,y) \pm g(x,y)] dA = \iint_R f(x,y) dA \pm \iint_R g(x,y) dA$
  3. 若$f(x,y) \leq g(x,y), \forall (x,y) \in R$，则$\iint_R f(x,y) dA \leq \iint_R g(x,y) dA$
- 累次积分：设$R$为矩形$[a,b] \times [c,d]$，则可定义累次积分
  
$$
\int_c^d \left[ \int_a^b f(x,y) dx \right] dy \quad \text{和} \quad \int_a^b \left[ \int_c^d f(x,y) dy \right] dx
$$

- Fubini定理：若$R = [a,b] \times [c,d]$，则
  
$$
\iint_R f(x,y)dA = \int_c^d \left[ \int_a^b f(x,y) dx \right] dy = \int_a^b \left[ \int_c^d f(x,y) dy \right] dx
$$

## 15.2 二重积分在一般区域上的定义
- 定义：设
  
$$
F(x,y) = \begin{cases}
    f(x,y), & (x,y) \in D \\
    0,      & (x,y) \in R \setminus D
  \end{cases}
$$

  如果$F$在$R$上可积，则定义$f$在$D$上的二重积分为
  
$$
\iint_D f(x,y) dA = \iint_R F(x,y) dA
$$

- 第I型区域：若$D = \{(x,y) : g_1(x) \leq y \leq g_2(x), a \leq x \leq b\}$，则
  
$$
\iint_D f(x,y) dA = \int_a^b \left[ \int_{g_1(x)}^{g_2(x)} f(x,y) dy \right] dx
$$

- 第II型区域：若$D = \{(x,y) : h_1(y) \leq x \leq h_2(y), c \leq y \leq d\}$，则
  
$$
\iint_D f(x,y) dA = \int_c^d \left[ \int_{h_1(y)}^{h_2(y)} f(x,y) dx \right] dy
$$

- 二重积分的性质：
  1. 若$D_1$和$D_2$没有重叠（除边界外），则
     
$$
\iint_{D_1 \cup D_2} f(x,y) dA = \iint_{D_1} f(x,y) dA + \iint_{D_2} f(x,y) dA
$$

  2. $\iint_D 1 dA = A(D)$，其中$A(D)$为$D$的面积。
  3. 若$m \leq f(x,y) \leq M, \forall (x,y) \in D$，则
     
$$
mA(D) \leq \iint_D f(x,y) dA \leq MA(D)
$$

## 15.3 极坐标下的二重积分
- 极坐标矩形：极坐标矩形$R$的形式为
  
$$
R = \{(x,y): x = r \cos \theta, y = r \sin \theta, a \leq r \leq b, \alpha \leq \theta \leq \beta\}
$$

  其中$a \geq 0$且$\beta - \alpha \leq 2\pi$。
- 极坐标矩形$R$的面积为
  
$$
A(R) = \frac{1}{2} b^2 (\beta - \alpha) - \frac{1}{2} a^2 (\beta - \alpha) = \bar{r} \Delta r \Delta \theta
$$

  其中$\bar{r} = \frac{a+b}{2}$为平均半径，$\Delta r = b-a$，$\Delta \theta = \beta - \alpha$。

- 极坐标矩形上的二重积分：
  
$$
\iint_R f(x,y) dA = \int_{\alpha}^{\beta} \int_a^b f(r \cos \theta, r \sin \theta) r dr d\theta
$$

- 一般区域上的极坐标二重积分：设$D = \{(x,y) : x = r \cos \theta, y = r \sin \theta, \alpha \leq \theta \leq \beta, h_1(\theta) \leq r \leq h_2(\theta)\}$，则
  
$$
\iint_D f(x,y) dA = \int_{\alpha}^{\beta} \int_{h_1(\theta)}^{h_2(\theta)} f(r \cos \theta, r \sin \theta) r dr d\theta
$$

## 15.6 三重积分

- 三重积分的定义：设函数$f$定义在长方体区域$B = [a,b] \times [c,d] \times [r,s]$上，三重积分定义为
  
$$
\iiint_B f(x,y,z) dV = \lim_{l,m,n\to\infty} \sum_{i=1}^l \sum_{j=1}^m \sum_{k=1}^n f(x_{ijk}^*, y_{ijk}^*, z_{ijk}^*) \Delta V
$$

  其中极限存在。

- Fubini定理：
  
$$
\iiint_B f(x,y,z) dV = \int_a^b \left[ \int_c^d \left( \int_r^s f(x,y,z) dz \right) dy \right] dx
$$

$$
= \int_a^b \left[ \int_r^s \left( \int_c^d f(x,y,z) dy \right) dz \right] dx = \cdots
$$

- 第I型立体区域：若$E = \{(x,y,z) | (x,y) \in D, u_1(x,y) \leq z \leq u_2(x,y)\}$，则
  
$$
\iiint_E f(x,y,z) dV = \iint_D \left[ \int_{u_1(x,y)}^{u_2(x,y)} f(x,y,z) dz \right] dA
$$

- 第II型立体区域：若$E = \{(x,y,z) | (y,z) \in D, u_1(y,z) \leq x \leq u_2(y,z)\}$，则
  
$$
\iiint_E f(x,y,z) dV = \iint_D \left[ \int_{u_1(y,z)}^{u_2(y,z)} f(x,y,z) dx \right] dA
$$

- 第III型立体区域：若$E = \{(x,y,z) | (x,z) \in D, u_1(x,z) \leq y \leq u_2(x,z)\}$，则
  
$$
\iiint_E f(x,y,z) dV = \iint_D \left[ \int_{u_1(x,z)}^{u_2(x,z)} f(x,y,z) dy \right] dA
$$

## 15.7 柱坐标系下的三重积分

- 柱坐标与直角坐标的关系：
  
$$
x = r \cos \theta, \quad y = r \sin \theta, \quad z = z
$$

$$
r^2 = x^2 + y^2, \quad \tan \theta = \frac{y}{x}, \quad z = z
$$

- 柱坐标系下的三重积分：若区域$E$由不等式$\alpha \leq \theta \leq \beta$，$h_1(\theta) \leq r \leq h_2(\theta)$和$u_1(x,y) \leq z \leq u_2(x,y)$给出，则
  
$$
\iiint_E f(x,y,z) dV = \int_{\alpha}^{\beta} \int_{h_1(\theta)}^{h_2(\theta)} \int_{u_1(r \cos \theta, r \sin \theta)}^{u_2(r \cos \theta, r \sin \theta)} f(r \cos \theta, r \sin \theta, z) r dz dr d\theta
$$

## 15.8 球坐标系下的三重积分

- 球坐标与直角坐标的关系：
  
$$
x = \rho \sin \phi \cos \theta, \quad y = \rho \sin \phi \sin \theta, \quad z = \rho \cos \phi
$$

$$
\rho^2 = x^2 + y^2 + z^2
$$

- 球坐标系下的三重积分：
  
$$
\iiint_E f(x,y,z) dV = \int \int \int_{\text{appropriate limits}} f(\rho \sin \phi \cos \theta, \rho \sin \phi \sin \theta, \rho \cos \phi) \rho^2 \sin \phi d\rho d\theta d\phi
$$

## 15.9 多重积分中的变量替换

- 二重积分中的变量替换：设$T$是从$uv$平面到$xy$平面的一一变换，它将$uv$平面上的有界区域$S$映射到$xy$平面上的有界区域$R$。如果$T$的形式为$T(u,v) = (x(u,v), y(u,v))$，则有
  
$$
\iint_R f(x,y) dx dy = \iint_S f(x(u,v), y(u,v)) |J(u,v)| du dv
$$

  其中$J(u,v)$称为Jacobian行列式，定义为
  
$$
J(u,v) = \begin{vmatrix}
    \frac{\partial x}{\partial u} & \frac{\partial y}{\partial u} \\
    \frac{\partial x}{\partial v} & \frac{\partial y}{\partial v}
  \end{vmatrix} = \frac{\partial x}{\partial u} \frac{\partial y}{\partial v} - \frac{\partial x}{\partial v} \frac{\partial y}{\partial u}
$$

- 三重积分中的变量替换：设$T$是从$uvw$空间到$xyz$空间的一一变换，它将$uvw$空间中的有界区域$S$映射到$xyz$空间中的有界区域$R$。如果$T$的形式为$T(u,v,w) = (x(u,v,w), y(u,v,w), z(u,v,w))$，则有
  
$$
\iiint_R f(x,y,z) dx dy dz = \iiint_S f(x(u,v,w), y(u,v,w), z(u,v,w)) |J(u,v,w)| du dv dw
$$

  其中$J(u,v,w)$称为Jacobian行列式，定义为
  
$$
J(u,v,w) = \frac{\partial (x,y,z)}{\partial (u,v,w)} = \begin{vmatrix}
    \frac{\partial x}{\partial u} & \frac{\partial y}{\partial u} & \frac{\partial z}{\partial u} \\
    \frac{\partial x}{\partial v} & \frac{\partial y}{\partial v} & \frac{\partial z}{\partial v} \\
    \frac{\partial x}{\partial w} & \frac{\partial y}{\partial w} & \frac{\partial z}{\partial w}
  \end{vmatrix}
$$