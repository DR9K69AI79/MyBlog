---
title: 高数2 - 第16章 向量微积分
date: 2024-03-24
summary: 本章介绍向量场、线积分、线积分基本定理、格林定理、旋度与散度、参数曲面及其面积、曲面积分、斯托克斯定理和散度定理，是向量微积分的核心内容。
category: G0212_Introduction to Advanced Mathematics II
tags:
  - 课程笔记
  - 高等数学
  - 向量微积分
  - 向量场
  - 线积分
  - 曲面积分
comments: true
draft: false
sticky: 0
---
# 第16章 向量微积分

## 16.1 向量场

### 定义

- **向量场**：设D是$\mathbb{R}^2$中的一个点集（平面区域）。$\mathbb{R}^2$上的向量场是一个函数F，它将D中的每个点$(x,y)$映射为一个二维向量$\mathbf{F}(x,y)$。类似地，设E是$\mathbb{R}^3$的子集。$\mathbb{R}^3$上的向量场是一个函数F，它将E中的每个点$(x,y,z)$映射为一个三维向量$\mathbf{F}(x,y,z)$。

- **梯度**：设标量场f可微，则f的梯度，记为$\nabla f$，是由下式给出的向量场：

$$
\nabla f(x,y)=\frac{\partial f}{\partial x}\mathbf{i}+\frac{\partial f}{\partial y}\mathbf{j}
$$

$$
\nabla f(x,y,z)=\frac{\partial f}{\partial x}\mathbf{i}+\frac{\partial f}{\partial y}\mathbf{j}+\frac{\partial f}{\partial z}\mathbf{k} 
$$

- **保守向量场**：如果向量场F是某个标量函数f的梯度，则称F为保守向量场。f称为向量场F的势函数。

## 16.2 线积分

### 定义

- **线积分**：设C是由下列参数方程给出的光滑平面曲线：

$$
x=x(t),\ y=y(t),\ a\leq t\leq b
$$

其中$x'$和$y'$在区间$(a,b)$上连续但不同时为零。函数f在C上的线积分定义为：

$$
\int_C f(x,y)ds=\lim_{n\to\infty}\sum_{i=1}^n f(x_i^*,y_i^*)\Delta s_i
$$

如果该极限存在。其中$\Delta s_i$表示子弧$P_{i-1}P_i$的长度，$(x_i^*,y_i^*)$是子区间$[t_{i-1},t_i]$上的任意点。

### 定理

- 设C由参数方程$x=x(t),\ y=y(t),\ a\leq t\leq b$给出，则
$$
\int_C f(x,y)ds=\int_a^b f(x(t),y(t))\sqrt{[x'(t)]^2+[y'(t)]^2}dt
$$

- 设C由参数方程$\mathbf{r}(t)=(x(t),y(t),z(t)),\ a\leq t\leq b$给出，则
$$
\int_C f(x,y,z)ds=\int_a^b f(\mathbf{r}(t))\|\mathbf{r}'(t)\|dt
$$

- **对x和y的线积分**：

$$
\int_C f(x,y)dx=\int_a^b f(x(t),y(t))x'(t)dt
$$

$$
\int_C f(x,y)dy=\int_a^b f(x(t),y(t))y'(t)dt  
$$

### 定理

- 设C是从A到B的任意一条分段光滑曲线，则
$$
\int_{-C}f(x,y)dx=-\int_C f(x,y)dx
$$

$$
\int_{-C}f(x,y)dy=-\int_C f(x,y)dy
$$

其中-C表示与C由相同的点构成但取向相反的曲线。

- **向量场的线积分（做功）**：设F是$\mathbb{R}^3$上的连续力场。对于光滑曲线C：$\mathbf{r}(t), a\leq t\leq b$，有
$$
W=\int_C \mathbf{F}\cdot d\mathbf{r}=\int_a^b \mathbf{F}(\mathbf{r}(t))\cdot \mathbf{r}'(t)dt=\int_C \mathbf{F}\cdot \mathbf{T}ds=\int_C F_1dx+F_2dy+F_3dz
$$

其中$\mathbf{T}(x,y,z)$是C在点$(x,y,z)$处的单位切向量。

## 16.3 线积分基本定理

### 定理

- **线积分基本定理**：设C是由$\mathbf{r}=\mathbf{r}(t), a\leq t\leq b$给出的分段光滑曲线。如果f在包含C的一个开集上连续可微，则
$$
\int_C \nabla f(\mathbf{r})\cdot d\mathbf{r}=f(\mathbf{r}(b))-f(\mathbf{r}(a))  
$$

### 定义

- 若对于D中的任意两点A和B，对D中从A到B的每一条路径C，线积分$\int_C \mathbf{F}(\mathbf{r})\cdot d\mathbf{r}$的值总是相同的，则称该线积分在连通集D中与路径无关。

### 定理

- 设$\mathbf{F}(\mathbf{r})$在$\mathbb{R}^n\ (n\geq 2)$的子集D上连续，则线积分$\int_C \mathbf{F}(\mathbf{r})\cdot d\mathbf{r}$在D中与路径无关的充分必要条件是对D中的每一条闭路径C，都有$\int_C \mathbf{F}(\mathbf{r})\cdot d\mathbf{r}=0$。

- **与路径无关定理**：设$\mathbf{F}(\mathbf{r})$在$\mathbb{R}^n\ (n\geq 2)$的开连通子集D上连续。则线积分$\int_C \mathbf{F}(\mathbf{r})\cdot d\mathbf{r}$在D中与路径无关的充分必要条件是存在标量函数f使得$\mathbf{F}(\mathbf{r})=\nabla f(\mathbf{r})$，即F在D上是保守向量场。

### 定理

- 设$\mathbf{F}=F_1(x,y)\mathbf{i}+F_2(x,y)\mathbf{j}$是$\mathbb{R}^2$中一个开单连通区域D上的向量场。如果$F_1$和$F_2$有连续的一阶偏导数，则F为保守向量场的充分必要条件是
$$
\frac{\partial F_1}{\partial y}=\frac{\partial F_2}{\partial x}  
$$

- 设$\mathbf{F}=F_1\mathbf{i}+F_2\mathbf{j}+F_3\mathbf{k}$是$\mathbb{R}^3$中一个开单连通区域D上的向量场。如果$F_1,F_2,F_3$有连续的一阶偏导数，则F为保守向量场的充分必要条件是
$$
\frac{\partial F_1}{\partial y}=\frac{\partial F_2}{\partial x},\quad \frac{\partial F_1}{\partial z}=\frac{\partial F_3}{\partial x},\quad \frac{\partial F_2}{\partial z}=\frac{\partial F_3}{\partial y}
$$

## 16.4 格林定理

### 定理

- **格林定理**：设C是xy平面上的一条分段光滑、简单闭合曲线，其正向边界为区域D。如果$P(x,y)$和$Q(x,y)$在包含D的一个开区域上有连续偏导数，则
$$
\iint_D \left(\frac{\partial Q}{\partial x}-\frac{\partial P}{\partial y}\right)dA=\int_C Pdx+Qdy
$$

## 16.5 旋度与散度

### 定义

- **旋度**：设$\mathbf{F}=F_1\mathbf{i}+F_2\mathbf{j}+F_3\mathbf{k}$是存在一阶偏导数的向量场，则F的旋度定义为
$$
\mathrm{curl}\ \mathbf{F}=\nabla\times\mathbf{F}
=\begin{vmatrix}
\mathbf{i} & \mathbf{j} & \mathbf{k} \\
\frac{\partial}{\partial x} & \frac{\partial}{\partial y} & \frac{\partial}{\partial z} \\
F_1 & F_2 & F_3
\end{vmatrix}
$$
$$
=\left(\frac{\partial F_3}{\partial y}-\frac{\partial F_2}{\partial z}\right)\mathbf{i}+\left(\frac{\partial F_1}{\partial z}-\frac{\partial F_3}{\partial x}\right)\mathbf{j}+\left(\frac{\partial F_2}{\partial x}-\frac{\partial F_1}{\partial y}\right)\mathbf{k}
$$

- **散度**：设$\mathbf{F}=F_1\mathbf{i}+F_2\mathbf{j}+F_3\mathbf{k}$是存在一阶偏导数的向量场，则F的散度定义为
$$
  
$$

### 定理

- $\mathrm{curl}(\nabla f)=0$

- 如果F是保守向量场，则$\mathrm{curl}\ \mathbf{F}=0$。

- 如果$\mathbf{F}$是定义在整个$\mathbb{R}^3$上且分量函数有连续偏导数的向量场，并且$\mathrm{curl}\ \mathbf{F}=0$，则F是保守向量场。

## 16.6 参数曲面及其面积

### 定义

- **参数曲面**：由下式给出的点的集合称为参数曲面：
$$
\mathbf{r}(u,v)=x(u,v)\mathbf{i}+y(u,v)\mathbf{j}+z(u,v)\mathbf{k},\quad (u,v)\in D  
$$

- **切平面**：设参数曲面S由向量函数$\mathbf{r}(u,v)$在点$P_0$（对应位置向量$\mathbf{r}(u_0,v_0)$）处描绘。若$\mathbf{r}_u\times\mathbf{r}_v\neq 0$，则称曲面S是光滑的。对于光滑曲面，切平面是同时包含切向量$\mathbf{r}_u$和$\mathbf{r}_v$的平面，而$\mathbf{r}_u\times\mathbf{r}_v$是该切平面的一个法向量。

- **曲面面积**：参数曲面$\mathbf{r}(u,v)$（其中$(u,v)\in D$）的面积为
$$
A(S)=\iint_D \|\mathbf{r}_u\times\mathbf{r}_v\|dA  
$$

- 对于特殊情形$z=f(x,y)$（其中$(x,y)\in D$，且f有连续偏导数），有
$$
A(S)=\iint_D \sqrt{1+\left(\frac{\partial z}{\partial x}\right)^2+\left(\frac{\partial z}{\partial y}\right)^2}dA
$$

## 16.7 曲面积分

### 定义

- **曲面积分**：设曲面S由$\mathbf{r}(u,v)$参数化，其中$(u,v)\in D=[a,b]\times[c,d]$。函数f在S上的曲面积分定义为
$$
\iint_S f(x,y,z)dS=\lim_{m,n\to\infty}\sum_{i=1}^m\sum_{j=1}^n f(\mathbf{r}(u_{ij}^*,v_{ij}^*))\Delta S_{ij}
$$

其中$\Delta S_{ij}$是$S_{ij}$的面积。

### 定理

- 对于由$\mathbf{r}(u,v)$（其中$(u,v)\in D$）给出的参数曲面S，有
$$
\iint_S f(x,y,z)dS=\iint_D f(\mathbf{r}(u,v))\|\mathbf{r}_u(u,v)\times\mathbf{r}_v(u,v)\|dA
$$

- 特别地，如果S是函数$z=f(x,y)$（其中$(x,y)\in D$）的图像，则
$$
\iint_S f(x,y,z)dS=\iint_D f(x,y,f(x,y))\sqrt{1+\left(\frac{\partial z}{\partial x}\right)^2+\left(\frac{\partial z}{\partial y}\right)^2}dA
$$

- **向量场的曲面积分**：设$\mathbf{F}=F_1\mathbf{i}+F_2\mathbf{j}+F_3\mathbf{k}$是定义在有向曲面S（由$\mathbf{r}(u,v)$给出，其中$(u,v)\in D$）上的连续向量场，单位法向量为$\mathbf{n}$，则F在S上的曲面积分为
$$
\iint_S \mathbf{F}\cdot d\mathbf{S}=\iint_S \mathbf{F}\cdot\mathbf{n}dS
$$

该积分也称为F穿过S的通量。

### 定理

$$
\iint_S \mathbf{F}\cdot d\mathbf{S}=\iint_D \mathbf{F}\cdot(\mathbf{r}_u\times\mathbf{r}_v)dA
$$

如果$z=f(x,y)$，则
$$
\iint_S \mathbf{F}\cdot d\mathbf{S}=\iint_D \mathbf{F}\cdot\left\langle-\frac{\partial z}{\partial x},-\frac{\partial z}{\partial y},1\right\rangle dA
$$

## 16.8 斯托克斯定理

### 定理

- **斯托克斯定理**：设S是一个有向的分片光滑曲面，其边界C是一条简单闭合的分段光滑曲线，方向与S上的单位法向量$\mathbf{n}$相吻合。设$\mathbf{F}$是一个在包含S的$\mathbb{R}^3$的开子集上分量有连续偏导数的向量场，则
$$
\int_C \mathbf{F}\cdot d\mathbf{r}=\iint_S \mathrm{curl}\ \mathbf{F}\cdot d\mathbf{S}
$$

- 有向曲面S的正向边界曲线常写作$\partial S$，于是有
$$
\int_{\partial S}\mathbf{F}\cdot d\mathbf{r}=\iint_S \mathrm{curl}\ \mathbf{F}\cdot d\mathbf{S}
$$

### 定理

- 设D是单连通的。证明如果在D上$\mathrm{curl}\ \mathbf{F}=0$，则F在D上是保守的。

## 16.9 散度定理

### 定理

- **散度定理（高斯定理）**：设E是一个简单实体区域，S是E的取正向（外法向）的边界曲面。设$\mathbf{F}=F_1\mathbf{i}+F_2\mathbf{j}+F_3\mathbf{k}$是一个向量场，其中$F_1,F_2,F_3$在包含E的一个开区域上有连续的偏导数，则
$$
\iint_{\partial E}\mathbf{F}\cdot d\mathbf{S}=\iiint_E \mathrm{div}\ \mathbf{F}dV
$$

## 16.10 总结

- **线积分基本定理**：设 C 是由 $\mathbf{r}=\mathbf{r}(t), a\leq t\leq b$ 给出的分段光滑曲线。如果 f 在包含 C 的一个开集上连续可微，则

$$
\int_C \nabla f(\mathbf{r})\cdot d\mathbf{r}=f(\mathbf{r}(b))-f(\mathbf{r}(a))
$$

- **格林定理**：设 C 是 xy 平面上的一条分段光滑、简单闭合曲线，其正向边界为区域 D。如果 $P(x,y)$ 和 $Q(x,y)$ 在包含 D 的一个开区域上有连续偏导数，则

$$
\iint_D \left(\frac{\partial Q}{\partial x}-\frac{\partial P}{\partial y}\right)dA=\oint_C Pdx+Qdy
$$

- **斯托克斯定理**：设 S 是一个有向的分片光滑曲面，其边界 C 是一条简单闭合的分段光滑曲线，方向与 S 上的单位法向量 $\mathbf{n}$ 相吻合。设 $\mathbf{F}$ 是一个在包含 S 的 $\mathbb{R}^3$ 的开子集上分量有连续偏导数的向量场，则

$$
\oint_C \mathbf{F}\cdot d\mathbf{r}=\iint_S \mathrm{curl}\ \mathbf{F}\cdot d\mathbf{S}
$$

- **散度定理（高斯定理）**：设 E 是一个简单实体区域，S 是 E 的取正向（外法向）的边界曲面。设 $\mathbf{F}=F_1\mathbf{i}+F_2\mathbf{j}+F_3\mathbf{k}$ 是一个向量场，其中 $F_1,F_2,F_3$ 在包含 E 的一个开区域上有连续的偏导数，则

$$
\unicode{8751}_{\partial E}\mathbf{F}\cdot d\mathbf{S}=\iiint_E \mathrm{div}\ \mathbf{F}dV
$$

## *附：*

### 1 向量场和向量微积分

| 英文                          | 中文      |
| --------------------------- | ------- |
| `Vector Field`              | `向量场`   |
| `Conservative Vector Field` | `保守向量场` |
| `Gradient`                  | `梯度`    |
| `Curl`                      | `旋度`    |
| `Divergence`                | `散度`    |
| `Line Integral`             | `线积分`   |
| `Surface Integral`          | `曲面积分`  |

### 2 定理和定律

| 英文                                         | 中文           |
| ------------------------------------------ | ------------ |
| `Fundamental Theorem for Line Integrals`   | `线积分基本定理`    |
| `Green's Theorem`                          | `格林定理`       |
| `Stokes' Theorem`                          | `斯托克斯定理`     |
| `The Divergence Theorem (Gauss's Theorem)` | `散度定理（高斯定理）` |
| `Newton's Law of Gravitation`              | `牛顿万有引力定律`   |
| `Newton's Second Law of Motion`            | `牛顿第二运动定律`   |
| `Law of Conservation of Energy`            | `能量守恒定律`     |

### 3 曲面和曲线

| 英文                       | 中文     |
| ------------------------ | ------ |
| `Parametric Surface`       | `参数曲面`   |
| `Tangent Plane`            | `切平面`    |
| `Normal Vector`            | `法向量`    |
| `Piecewise-smooth Surface` | `分片光滑曲面` |
| `Piecewise-smooth Curve`   | `分片光滑曲线` |
| `Simple Closed Curve`      | `简单闭合曲线` |
| `Oriented Surface`         | `有向曲面`   |

### 4 其他

| 英文                    | 中文       |
| --------------------- | -------- |
| `Scalar Field`        | `标量场`    |
| `Potential Function`  | `势函数`    |
| `Simply Connected`    | `单连通`    |
| `Connected Set`       | `连通集`    |
| `Simple Solid Region` | `简单实体区域` |
| `Flux`                | `通量`     |
| `Kinetic Energy`      | `动能`     |
| `Potential Energy`    | `势能`     |