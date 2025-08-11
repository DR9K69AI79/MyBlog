---
title: 高等数学2 - 第12章 向量与空间几何
date: 2024-03-23
summary: 本章介绍三维坐标系、向量的基本概念和运算、点积和叉积的性质、直线和平面的方程，以及柱面和二次曲面的分类和性质。
category: 高等数学2
tags:
  - 课程笔记
  - 高等数学
  - 向量
  - 空间几何
  - 二次曲面
comments: true
draft: false
sticky: 0
---
# 第十二章 向量与空间几何

## 12.1 三维坐标系

- **八分空间**：三维空间被三个互相垂直的坐标平面分成八个部分，称为八分空间。

- **点的投影**：点 $P(a,b,c)$ 在三个坐标平面上的投影分别为：
  - $Q(a,b,0)$ 为 $P$ 在 $xy$ 平面上的投影
  - $R(0,b,c)$ 为 $P$ 在 $yz$ 平面上的投影
  - $S(a,0,c)$ 为 $P$ 在 $xz$ 平面上的投影

- **三维直角坐标系**：$\mathbb{R}^3 = \{(x,y,z) | x,y,z \in \mathbb{R}\}$

- **两点间距离公式**：两点 $P_1(x_1,y_1,z_1)$ 和 $P_2(x_2,y_2,z_2)$ 之间的距离为：
  
  $$|P_1P_2| = \sqrt{(x_2-x_1)^2 + (y_2-y_1)^2 + (z_2-z_1)^2}$$

- **球面方程**：以 $C(h,k,l)$ 为球心，$r$ 为半径的球面方程为：
  
  $$(x-h)^2 + (y-k)^2 + (z-l)^2 = r^2$$
  
  特别地，若球心为原点，则球面方程为：
  
  $$x^2 + y^2 + z^2 = r^2$$

## 12.2 向量

- **标量与向量**：
  - 只需要一个数来指定的量称为**标量**
  - 需要大小和方向来完整指定的量称为**向量**

- **向量相等**：两个向量相等当且仅当它们有相同的大小和方向。

- **向量表示**：在三维空间中，向量 $\mathbf{a}$ 可以写成 $\mathbf{a} = \langle a_1, a_2, a_3 \rangle$。

- **向量运算**：若 $\mathbf{a} = \langle a_1, a_2, a_3 \rangle$ 和 $\mathbf{b} = \langle b_1, b_2, b_3 \rangle$，则：
  - **标量乘法**：$c\mathbf{a} = \langle ca_1, ca_2, ca_3 \rangle$
  - **加减法**：$\mathbf{a} \pm \mathbf{b} = \langle a_1 \pm b_1, a_2 \pm b_2, a_3 \pm b_3 \rangle$

- **位置向量**：从点 $A(x_1,y_1,z_1)$ 到点 $B(x_2,y_2,z_2)$ 的向量为：
  
  $$\overrightarrow{AB} = \langle x_2-x_1, y_2-y_1, z_2-z_1 \rangle = \overrightarrow{OB} - \overrightarrow{OA}$$
  
  其中 $\overrightarrow{OA}$ 和 $\overrightarrow{OB}$ 称为位置向量。

- **向量长度**：向量 $\mathbf{a} = \langle a_1, a_2, a_3 \rangle$ 的大小或长度为：
  
  $$\|\mathbf{a}\| = \sqrt{a_1^2 + a_2^2 + a_3^2}$$

- **单位向量**：大小为1的向量称为单位向量。$\hat{\mathbf{a}} = \frac{\mathbf{a}}{\|\mathbf{a}\|}$

- **标准单位向量**：$\mathbf{i} = \langle 1,0,0 \rangle$，$\mathbf{j} = \langle 0,1,0 \rangle$，$\mathbf{k} = \langle 0,0,1 \rangle$

- **向量分解**：向量 $\mathbf{a} = \langle a_1, a_2, a_3 \rangle$ 可以写成 $\mathbf{a} = a_1\mathbf{i} + a_2\mathbf{j} + a_3\mathbf{k}$。

**向量运算定理**：
1. $\mathbf{a} + \mathbf{b} = \mathbf{b} + \mathbf{a}$ （交换律）
2. $(\mathbf{a} + \mathbf{b}) + \mathbf{c} = \mathbf{a} + (\mathbf{b} + \mathbf{c})$ （结合律）
3. $\mathbf{a} + \mathbf{0} = \mathbf{0} + \mathbf{a} = \mathbf{a}$ （零向量）
4. $\mathbf{a} + (-\mathbf{a}) = \mathbf{0}$ （负向量）
5. $a(b\mathbf{a}) = (ab)\mathbf{a}$ （标量乘法结合律）
6. $a(\mathbf{a} + \mathbf{b}) = a\mathbf{a} + a\mathbf{b}$ （分配律）
7. $(a + b)\mathbf{a} = a\mathbf{a} + b\mathbf{a}$ （分配律）
8. $1\mathbf{a} = \mathbf{a}$ （单位标量）
9. $\|a\mathbf{a}\| = |a|\|\mathbf{a}\|$ （长度性质）

## 12.3 点积

- **点积定义**：两个向量 $\mathbf{a} = \langle a_1, a_2, a_3 \rangle$ 和 $\mathbf{b} = \langle b_1, b_2, b_3 \rangle$ 的点积为：
  
  $$\mathbf{a} \cdot \mathbf{b} = a_1b_1 + a_2b_2 + a_3b_3$$

- **点积的性质**：
  1. $\mathbf{a} \cdot \mathbf{b} = \mathbf{b} \cdot \mathbf{a}$ （交换律）
  2. $\mathbf{a} \cdot (\mathbf{b} + \mathbf{c}) = \mathbf{a} \cdot \mathbf{b} + \mathbf{a} \cdot \mathbf{c}$ （分配律）
  3. $c(\mathbf{a} \cdot \mathbf{b}) = (c\mathbf{a}) \cdot \mathbf{b}$ （标量乘法）
  4. $\mathbf{0} \cdot \mathbf{a} = 0$ （零向量性质）
  5. $\mathbf{a} \cdot \mathbf{a} = \|\mathbf{a}\|^2$ （自点积）

- **几何意义**：
  
  $$\mathbf{a} \cdot \mathbf{b} = \|\mathbf{a}\|\|\mathbf{b}\|\cos \theta$$
  
  其中 $\theta$ 为两个向量之间的夹角。

- **正交性**：两个向量 $\mathbf{a}$ 和 $\mathbf{b}$ 正交当且仅当 $\mathbf{a} \cdot \mathbf{b} = 0$。

## 12.4 叉积

- **叉积定义**：两个向量 $\mathbf{a} = \langle a_1, a_2, a_3 \rangle$ 和 $\mathbf{b} = \langle b_1, b_2, b_3 \rangle$ 的叉积为：
  
  $$\mathbf{a} \times \mathbf{b} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ a_1 & a_2 & a_3 \\ b_1 & b_2 & b_3 \end{vmatrix} = (a_2b_3 - a_3b_2)\mathbf{i} - (a_1b_3 - a_3b_1)\mathbf{j} + (a_1b_2 - a_2b_1)\mathbf{k}$$

- **几何解释**：
  - $\mathbf{a} \times \mathbf{b}$ 垂直于 $\mathbf{a}$ 和 $\mathbf{b}$
  - $\mathbf{a}$，$\mathbf{b}$ 和 $\mathbf{a} \times \mathbf{b}$ 构成右手系
  - 叉积的长度：$\|\mathbf{a} \times \mathbf{b}\| = \|\mathbf{a}\|\|\mathbf{b}\|\sin \theta$

- **平行性判定**：两个向量 $\mathbf{a}$ 和 $\mathbf{b}$ 平行当且仅当 $\mathbf{a} \times \mathbf{b} = \mathbf{0}$。

- **标准单位向量的叉积**：
  
  $$\mathbf{i} \times \mathbf{j} = \mathbf{k}, \quad \mathbf{j} \times \mathbf{k} = \mathbf{i}, \quad \mathbf{k} \times \mathbf{i} = \mathbf{j}$$

**性质**：
1. $\mathbf{a} \times \mathbf{b} = -\mathbf{b} \times \mathbf{a}$
2. $\mathbf{a} \times (\mathbf{b}+\mathbf{c}) = \mathbf{a} \times \mathbf{b} + \mathbf{a} \times \mathbf{c}$
3. $c(\mathbf{a} \times \mathbf{b}) = (c\mathbf{a}) \times \mathbf{b}$
4. $\mathbf{a} \times \mathbf{0} = \mathbf{0} \times \mathbf{a} = \mathbf{0}$
5. $\mathbf{a} \times \mathbf{a} = \mathbf{0}$
6. $(\mathbf{a} \times \mathbf{b}) \cdot \mathbf{c} = \mathbf{a} \cdot (\mathbf{b} \times \mathbf{c})$
7. $\mathbf{a} \times (\mathbf{b} \times \mathbf{c}) = (\mathbf{a} \cdot \mathbf{c})\mathbf{b} - (\mathbf{a} \cdot \mathbf{b})\mathbf{c}$

## 12.5 直线和平面的方程

- 一条直线由以下确定：
  - 一个固定点 $P_0(x_0,y_0,z_0)$
  - 一个固定方向向量 $\mathbf{v}=a\mathbf{i}+b\mathbf{j}+c\mathbf{k}$
- 它是所有满足以下条件的点 $P$ 的集合：

$$\overrightarrow{P_0P}=t\mathbf{v}$$

其中 $t$ 为某个实数。

- 若 $\mathbf{r}=\overrightarrow{OP}$ 和 $\mathbf{r}_0=\overrightarrow{OP_0}$，则：

$$\mathbf{r}=\mathbf{r}_0+t\mathbf{v}$$

- 对于 $\mathbf{r}=\langle x,y,z \rangle$，$\mathbf{r}_0=\langle x_0,y_0,z_0 \rangle$ 和 $\mathbf{v}=\langle a,b,c \rangle$，我们有：

$$x=x_0+at,\quad y=y_0+bt,\quad z=z_0+ct$$

这些是通过点 $P_0(x_0,y_0,z_0)$ 并平行于 $\mathbf{v}=\langle a,b,c \rangle$ 的直线的参数方程。

- 当 $a$，$b$，$c$ 都不为零时，我们得到：

$$\frac{x-x_0}{a}=\frac{y-y_0}{b}=\frac{z-z_0}{c}$$

这称为直线的对称方程。

- **平面**：通过点 $P_0(x_0,y_0,z_0)$ 并垂直于向量 $\mathbf{n}=\langle a,b,c \rangle$ 的平面方程为：

$$a(x-x_0)+b(y-y_0)+c(z-z_0)=0$$

## 12.6 柱面和二次曲面

- **柱面**：在三维空间中，$F(x,y)=C$ 或 $G(x,z)=C$ 或 $H(y,z)=C$ 的图像称为柱面。

- **二次曲面**：在三维空间中，二次方程

$$Ax^2+By^2+Cz^2+Dxy+Exz+Fyz+Gx+Hy+Iz+J=0$$

的曲面称为二次曲面。

- 通过坐标轴的平移和旋转，这样的方程可以化简为以下两种标准形式之一：

$$Ax^2+By^2+Cz^2+J=0 \quad\text{或}\quad Ax^2+By^2+Iz=0$$

| 曲面 | 方程 | 曲面 | 方程 |
|------|------|------|------|
| 椭球面 | $\frac{x^2}{a^2}+\frac{y^2}{b^2}+\frac{z^2}{c^2}=1$ <br><br> 所有截痕都是椭圆。 <br><br> 如果$a=b=c$，椭球面是一个球面。 | 锥面 | $\frac{z^2}{c^2}=\frac{x^2}{a^2}+\frac{y^2}{b^2}$ <br><br> 水平截痕是椭圆。 <br><br> 在平面$x=k$和$y=k$中的垂直截痕是双曲线，如果$k \neq 0$，但如果$k=0$则是一对直线。 |
| 椭圆抛物面 | $\frac{z}{c}=\frac{x^2}{a^2}+\frac{y^2}{b^2}$ <br><br> 水平截痕是椭圆。 <br><br> 垂直截痕是抛物线。 <br><br> 一次幂的变量表示抛物面的轴。 | 单叶双曲面 | $\frac{x^2}{a^2}+\frac{y^2}{b^2}-\frac{z^2}{c^2}=1$ <br><br> 水平截痕是椭圆。 <br><br> 垂直截痕是双曲线。 <br><br> 对称轴对应于系数为负的变量。 |
| 双曲抛物面 | $\frac{z}{c}=\frac{x^2}{a^2}-\frac{y^2}{b^2}$ <br><br> 水平截痕是双曲线。 <br><br> 垂直截痕是抛物线。 <br><br> 图中说明了$c<0$的情况。 | 双叶双曲面 | $-\frac{x^2}{a^2}-\frac{y^2}{b^2}+\frac{z^2}{c^2}=1$ <br><br> 如果$k>c$或$k<-c$，$z=k$中的水平截痕是椭圆。 <br><br> 垂直截痕是双曲线。 <br><br> 两个负号表示两个叶面。 |

| Surface | Equation | Surface | Equation |
|---------|----------|---------|----------|
| Ellipsoid | $\frac{x^2}{a^2}+\frac{y^2}{b^2}+\frac{z^2}{c^2}=1$ <br><br> All traces are ellipses. <br><br> If $a=b=c$, the ellipsoid is a sphere. | Cone | $\frac{z^2}{c^2}=\frac{x^2}{a^2}+\frac{y^2}{b^2}$ <br><br> Horizontal traces are ellipses. <br><br> Vertical traces in the planes $x=k$ and $y=k$ are hyperbolas if $k \neq 0$ but are pairs of lines if $k=0$. |
| Elliptic Paraboloid | $\frac{z}{c}=\frac{x^2}{a^2}+\frac{y^2}{b^2}$ <br><br> Horizontal traces are ellipses. <br><br> Vertical traces are parabolas. <br><br> The variable raised to the first power indicates the axis of the paraboloid. | Hyperboloid of One Sheet | $\frac{x^2}{a^2}+\frac{y^2}{b^2}-\frac{z^2}{c^2}=1$ <br><br> Horizontal traces are ellipses. <br><br> Vertical traces are hyperbolas. <br><br> The axis of symmetry corresponds to the variable whose coefficient is negative. |
| Hyperbolic Paraboloid | $\frac{z}{c}=\frac{x^2}{a^2}-\frac{y^2}{b^2}$ <br><br> Horizontal traces are hyperbolas. <br><br> Vertical traces are parabolas. <br><br> The case where $c<0$ is illustrated. | Hyperboloid of Two Sheets | $-\frac{x^2}{a^2}-\frac{y^2}{b^2}+\frac{z^2}{c^2}=1$ <br><br> Horizontal traces in $z=k$ are ellipses if $k>c$ or $k<-c$. <br><br> Vertical traces are hyperbolas. <br><br> The two minus signs indicate two sheets. |