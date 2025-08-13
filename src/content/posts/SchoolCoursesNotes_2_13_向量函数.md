---
title: 高数2 - 第13章 向量函数
date: 2024-03-23
summary: 本章介绍向量函数和空间曲线的概念、向量函数的导数和积分、弧长计算，以及空间运动中的速度和加速度分析。
category: G0212_Introduction to Advanced Mathematics II
tags:
  - 课程笔记
  - 高等数学
  - 向量函数
  - 空间曲线
  - 弧长
comments: true
draft: false
sticky: 0
---
# 第13章 向量函数

## 13.1 向量函数和空间曲线

- 向量值函数（或向量函数）的定义：向量值函数$\mathbf{r}$是一个函数，其定义域是实数的集合，值域是向量的集合。对于$\mathbf{r}$的定义域中的每一个数$t$，都有一个唯一的向量$\mathbf{r}(t)$与之对应。
- 如果$f(t)$，$g(t)$和$h(t)$是向量$\mathbf{r}(t)$的分量，那么$f$，$g$和$h$是实值函数，称为$\mathbf{r}$的分量函数，我们可以写成：

$$\mathbf{r}(t) = \langle f(t), g(t), h(t)\rangle = f(t)\mathbf{i} + g(t)\mathbf{j} + h(t)\mathbf{k}$$

- **定理**：设$\mathbf{r}(t) = f(t)\mathbf{i} + g(t)\mathbf{j} + h(t)\mathbf{k}$，则$\mathbf{r}$在$t=a$处有极限当且仅当$f$，$g$和$h$在$a$处有极限。这种情况下，有

$$\lim_{t\to a}\mathbf{r}(t) = \left[\lim_{t\to a}f(t)\right]\mathbf{i} + \left[\lim_{t\to a}g(t)\right]\mathbf{j} + \left[\lim_{t\to a}h(t)\right]\mathbf{k}$$

- 空间曲线可以由参数方程$x=f(t)$，$y=g(t)$，$z=h(t)$定义，或写成向量函数的形式：

$$\mathbf{r}(t) = f(t)\mathbf{i} + g(t)\mathbf{j} + h(t)\mathbf{k}$$

## 13.2 向量函数的导数和积分

- **导数定义**：向量函数$\mathbf{r}$的导数$\mathbf{r}'$定义为：
  
  $$\frac{d\mathbf{r}}{dt} = \mathbf{r}'(t) = \lim_{h\to 0}\frac{\mathbf{r}(t+h) - \mathbf{r}(t)}{h}$$

- **几何意义**：$\mathbf{r}'(t)$是曲线在点$P$处的切向量。

- **单位切向量**：
  
  $$\mathbf{T}(t) = \frac{\mathbf{r}'(t)}{\|\mathbf{r}'(t)\|}$$

- **导数计算定理**：如果$\mathbf{r}(t) = f(t)\mathbf{i} + g(t)\mathbf{j} + h(t)\mathbf{k}$，其中$f$，$g$和$h$是可微函数，则：
  
  $$\mathbf{r}'(t) = f'(t)\mathbf{i} + g'(t)\mathbf{j} + h'(t)\mathbf{k}$$

- **微分法则**：设$\mathbf{u}$和$\mathbf{v}$是可微的向量值函数，$f$是可微的实值函数，$c$是标量。则有以下法则：
  
  1. $\frac{d}{dt}[\mathbf{u}(t) \pm \mathbf{v}(t)] = \mathbf{u}'(t) \pm \mathbf{v}'(t)$ （加减法）
  2. $\frac{d}{dt}[c\mathbf{u}(t)] = c\mathbf{u}'(t)$ （标量乘法）
  3. $\frac{d}{dt}[f(t)\mathbf{u}(t)] = f(t)\mathbf{u}'(t) + f'(t)\mathbf{u}(t)$ （乘积法则）
  4. $\frac{d}{dt}[\mathbf{u}(t) \cdot \mathbf{v}(t)] = \mathbf{u}'(t) \cdot \mathbf{v}(t) + \mathbf{u}(t) \cdot \mathbf{v}'(t)$ （点积法则）
  5. $\frac{d}{dt}[\mathbf{u}(t) \times \mathbf{v}(t)] = \mathbf{u}'(t) \times \mathbf{v}(t) + \mathbf{u}(t) \times \mathbf{v}'(t)$ （叉积法则）
  6. $\frac{d}{dt}[\mathbf{u}(f(t))] = \mathbf{u}'(f(t))f'(t)$ （链式法则）

- **积分定义**：连续向量函数$\mathbf{r}(t)$的定积分定义为：
  
  $$\int_a^b\mathbf{r}(t)dt = \lim_{n\to\infty}\sum_{i=1}^n\mathbf{r}(t_i^*)\Delta t$$

- **分量积分**：如果$\mathbf{r}(t) = f(t)\mathbf{i} + g(t)\mathbf{j} + h(t)\mathbf{k}$，则：
  
  $$\int_a^b\mathbf{r}(t)dt = \left[\int_a^bf(t)dt\right]\mathbf{i} + \left[\int_a^bg(t)dt\right]\mathbf{j} + \left[\int_a^bh(t)dt\right]\mathbf{k}$$

## 13.3 弧长

- **弧长公式**：假设曲线有向量方程$\mathbf{r}(t) = x(t)\mathbf{i} + y(t)\mathbf{j} + z(t)\mathbf{k}$，$a \leq t \leq b$，则曲线长度为：
  
  $$L = \int_a^b\sqrt{\left(\frac{dx}{dt}\right)^2 + \left(\frac{dy}{dt}\right)^2 + \left(\frac{dz}{dt}\right)^2}dt = \int_a^b\|\mathbf{r}'(t)\|dt$$

## 13.4 空间运动：速度和加速度

- **运动描述**：移动点$P$的位置向量为$\mathbf{r}(t) = f(t)\mathbf{i} + g(t)\mathbf{j} + h(t)\mathbf{k}$，其速度向量$\mathbf{v}(t)$和加速度向量$\mathbf{a}(t)$分别为：
  
  $$\mathbf{v}(t) = \mathbf{r}'(t) = f'(t)\mathbf{i} + g'(t)\mathbf{j} + h'(t)\mathbf{k}$$
  
  $$\mathbf{a}(t) = \mathbf{r}''(t) = f''(t)\mathbf{i} + g''(t)\mathbf{j} + h''(t)\mathbf{k}$$

- **运动性质**：
  - 加速度向量指向曲线的凹侧
  - 速度大小：$v = \|\mathbf{v}(t)\| = \|\mathbf{r}'(t)\|$

- **物理定律**：牛顿第二运动定律：$\mathbf{F}(t) = m\mathbf{a}(t)$

- **抛体运动**：假设空气阻力可以忽略，唯一的外力是重力（$g \approx 9.8\ \mathrm{m/s^2}$），抛体的位置函数$\mathbf{r}(t)$的参数方程为：
  
  $$\begin{cases}
  x = (v_0\cos\alpha)t \\
  y = (v_0\sin\alpha)t - \frac{1}{2}gt^2
  \end{cases}$$
  
  其轨迹是一条抛物线。