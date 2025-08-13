---
title: 高数2 - 第14章 偏导数
date: 2024-03-23
summary: 本章介绍多元函数的概念、极限与连续性、偏导数的定义和计算、切平面与线性近似、链式法则、方向导数与梯度向量，以及多元函数的极值问题和拉格朗日乘数法。
category: G0212_Introduction to Advanced Mathematics II
tags:
  - 课程笔记
  - 高等数学
  - 偏导数
  - 多元函数
  - 梯度
comments: true
draft: false
sticky: 0
---
# 第14章 偏导数

## 14.1 多元函数

- 二元函数定义：实值二元函数$f$将平面上某个集合$D$中的每一个有序数对$(x,y)$赋予一个唯一的实数$f(x,y)$。
- 二元函数的定义域$D$：如果没有特别说明，则$D$为函数规则有意义的所有$(x,y)$的集合，称为函数的自然定义域。
- 二元函数的值域：函数的所有取值的集合。
- 如果$z=f(x,y)$，称$x$和$y$为自变量，$z$为因变量。
- 三元或多元函数的定义：类似地，可以定义三元或多元函数$f(x,y,z)$，$f(x_1,x_2,\dots,x_n)$。
- 水平集：二元函数$f$的水平集是方程$f(x,y)=k$的曲线，其中$k$是$f$的值域中的常数。这些曲线的集合称为等高线图。

## 14.2 极限与连续性

- 二元函数极限的定义：
  
  设函数$f$的定义域$D$包含$(a,b)$附近的点。如果对于任意$\epsilon>0$，存在$\delta>0$（可能依赖于$f,\epsilon,a,b$），使得当$(x,y)\in D$且$0<\|(x,y)-(a,b)\|<\delta$时，有$|f(x,y)-L|<\epsilon$，则称$f(x,y)$当$(x,y)$趋于$(a,b)$时的极限为$L$，记作
  
  $$\lim_{(x,y)\to(a,b)}f(x,y)=L$$

- 多元函数极限的定义可以类似地推广。
  
- 定理：
  
  如果$f(x,y)$是多项式函数，则
  
  $$\lim_{(x,y)\to(a,b)}f(x,y)=f(a,b)$$
  
  如果$f(x,y)=\frac{p(x,y)}{q(x,y)}$是有理函数（$p,q$是多项式），则
  
  $$\lim_{(x,y)\to(a,b)}f(x,y)=\frac{p(a,b)}{q(a,b)}$$
  
  其中$q(a,b)\neq0$。
  
  如果$\lim_{(x,y)\to(a,b)}p(x,y)=L\neq0$且$\lim_{(x,y)\to(a,b)}q(x,y)=0$，则
  
  $$\lim_{(x,y)\to(a,b)}\frac{p(x,y)}{q(x,y)}$$
  
  不存在。

- 二元函数连续性定义：如果$f(x,y)$在点$(a,b)$满足以下条件，则称$f(x,y)$在$(a,b)$处连续：
  
  1. $f$在$(a,b)$处有定义；
  2. $f$在$(a,b)$处有极限；
  3. $f$在$(a,b)$处的函数值等于其极限值，即
     
     $$\lim_{(x,y)\to(a,b)}f(x,y)=f(a,b)$$

- 复合函数连续性定理：
  
  如果二元函数$g$在$(a,b)$连续，且一元函数$f$在$g(a,b)$连续，则复合函数$f\circ g$在$(a,b)$连续，其中$(f\circ g)(x,y)=f(g(x,y))$。

## 14.3 偏导数

- 偏导数定义：
  
  设$f$是二元函数，如果$y$保持不变，如$y=b$，则$f(x,b)$是$x$的一元函数。其在$x=a$处的导数称为$f$在$(a,b)$关于$x$的偏导数，记作$f_x(a,b)$。即
  
  $$f_x(a,b)=\lim_{h\to0}\frac{f(a+h,b)-f(a,b)}{h}$$
  
  类似地，$f$在$(a,b)$关于$y$的偏导数为
  
  $$f_y(a,b)=\lim_{h\to0}\frac{f(a,b+h)-f(a,b)}{h}$$

- 偏导数作为函数：
  
  $$f_x(x,y)=\lim_{h\to0}\frac{f(x+h,y)-f(x,y)}{h}$$
  
  $$f_y(x,y)=\lim_{h\to0}\frac{f(x,y+h)-f(x,y)}{h}$$

- 偏导数记号：如果$z=f(x,y)$，则
  
  $$f_x(x,y)=f_x=\frac{\partial f}{\partial x}=\frac{\partial}{\partial x}f(x,y)=\frac{\partial z}{\partial x}=D_1f=D_xf$$
  
  $$f_y(x,y)=f_y=\frac{\partial f}{\partial y}=\frac{\partial}{\partial y}f(x,y)=\frac{\partial z}{\partial y}=D_2f=D_yf$$

- 求偏导数的规则：
  
  如果$z=f(x,y)$，
  
  1. 要求$f_x$，将$y$视为常数，对$f(x,y)$关于$x$求导。
  2. 要求$f_y$，将$x$视为常数，对$f(x,y)$关于$y$求导。

- 偏导数的解释：
  
  - $f$在$(a,b)$的偏导数是过点$P(a,b,c)$的曲线$C_1$和$C_2$在该点切线的斜率。
  - 偏导数也可以解释为瞬时变化率。

- 高阶偏导数定义：
  
  如果$z=f(x,y)$，
  
  $$f_{xx}=(f_x)_x=\frac{\partial}{\partial x}\left(\frac{\partial f}{\partial x}\right)=\frac{\partial^2f}{\partial x^2}$$
  
  $$f_{yy}=(f_y)_y=\frac{\partial}{\partial y}\left(\frac{\partial f}{\partial y}\right)=\frac{\partial^2f}{\partial y^2}$$
  
  $$f_{xy}=(f_x)_y=\frac{\partial}{\partial y}\left(\frac{\partial f}{\partial x}\right)=\frac{\partial^2f}{\partial y\partial x}$$
  
  $$f_{yx}=(f_y)_x=\frac{\partial}{\partial x}\left(\frac{\partial f}{\partial y}\right)=\frac{\partial^2f}{\partial x\partial y}$$

- Clairaut定理：
  
  如果$f_{xy}$和$f_{yx}$在开集$S$上连续，则对于$S$中的每一点，有
  
  $$f_{xy}=f_{yx}$$

- 多于两个变量的函数的偏导数：
  
  如果$u=f(x,y,z)$，
  
  $$f_x(x,y,z)=\lim_{h\to0}\frac{f(x+h,y,z)-f(x,y,z)}{h}$$
  
  $$f_y(x,y,z)=\lim_{h\to0}\frac{f(x,y+h,z)-f(x,y,z)}{h}$$
  
  $$f_z(x,y,z)=\lim_{h\to0}\frac{f(x,y,z+h)-f(x,y,z)}{h}$$
  
  高阶偏导数如$f_{xy}$和$f_{xyz}$称为混合偏导数。

## 14.4 切平面与线性近似

- 切平面方程：
  
  如果$f$有连续的偏导数，则曲面$z=f(x,y)$在点$P(x_0,y_0,z_0)$处的切平面方程为
  
  $$z-z_0=f_x(x_0,y_0)(x-x_0)+f_y(x_0,y_0)(y-y_0)$$

- 线性近似：
  
  $$L(x,y)=f(a,b)+f_x(a,b)(x-a)+f_y(a,b)(y-b)$$
  
  称为$f$在$(a,b)$的线性近似或切平面近似。

- 可微性定义：
  
  如果
  
  $$f(a+\Delta x,b+\Delta y)=f(a,b)+f_x(a,b)\Delta x+f_y(a,b)\Delta y+\epsilon_1\Delta x+\epsilon_2\Delta y$$
  
  其中当$(\Delta x,\Delta y)\to(0,0)$时，$\epsilon_1\to0$，$\epsilon_2\to0$，则称$f$在$(a,b)$可微。

- 定理：
  
  如果$f_x(x,y)$和$f_y(x,y)$在$(a,b)$附近存在且在$(a,b)$连续，则$f(x,y)$在$(a,b)$可微。

## 14.5 链式法则

- 链式法则：
  
  设$z=f(x,y)$是$x$和$y$的可微函数，其中$x=g(t)$和$y=h(t)$都是$t$的可微函数。则$z$是$t$的可微函数，且
  
  $$\frac{dz}{dt}(t)=\frac{\partial f}{\partial x}(x(t),y(t))\frac{dx}{dt}(t)+\frac{\partial f}{\partial y}(x(t),y(t))\frac{dy}{dt}(t)$$
  
  也可以写作
  
  $$\frac{dz}{dt}=\frac{\partial z}{\partial x}\frac{dx}{dt}+\frac{\partial z}{\partial y}\frac{dy}{dt}$$

- 链式法则（多元情况）：
  
  设$x=x(s,t)$和$y=y(s,t)$在$(s,t)$有一阶偏导数，且$z=f(x,y)$在$(x(s,t),y(s,t))$可微。则$z=f(x(s,t),y(s,t))$有一阶偏导数，满足
  
  $$\frac{\partial z}{\partial s}=\frac{\partial z}{\partial x}\frac{\partial x}{\partial s}+\frac{\partial z}{\partial y}\frac{\partial y}{\partial s}$$
  
  $$\frac{\partial z}{\partial t}=\frac{\partial z}{\partial x}\frac{\partial x}{\partial t}+\frac{\partial z}{\partial y}\frac{\partial y}{\partial t}$$

- 两个变量的隐函数求导：
  
  如果$F(x,y)=0$隐式地定义了$y$是$x$的函数，则
  
  $$\frac{dy}{dx}=-\frac{\partial F/\partial x}{\partial F/\partial y}$$

- 三个变量的隐函数求导：
  
  如果$F(x,y,z)=0$隐式地定义了$z$是$x$和$y$的函数，则
  
  $$\frac{\partial z}{\partial x}=-\frac{\partial F/\partial x}{\partial F/\partial z}$$
  
  $$\frac{\partial z}{\partial y}=-\frac{\partial F/\partial y}{\partial F/\partial z}$$

## 14.6 方向导数与梯度向量

- 方向导数定义：
  
  对于任意单位向量$\mathbf{u}$，函数$f$在点$\mathbf{p}$沿$\mathbf{u}$方向的方向导数定义为
  
  $$D_{\mathbf{u}}f(\mathbf{p})=\lim_{h\to0}\frac{f(\mathbf{p}+h\mathbf{u})-f(\mathbf{p})}{h}$$
  
  如果该极限存在。

- 定理：
  
  设$f(x,y)$在$\mathbf{p}$可微。则$f$在$\mathbf{p}$沿单位向量$\mathbf{u}=a\mathbf{i}+b\mathbf{j}$的方向导数存在，且
  
  $$D_{\mathbf{u}}f(x,y)=f_x(x,y)a+f_y(x,y)b$$

- 梯度向量定义：
  
  函数$f(x,y)$的梯度为
  
  $$\nabla f=\left\langle\frac{\partial f}{\partial x},\frac{\partial f}{\partial y}\right\rangle=\frac{\partial f}{\partial x}\mathbf{i}+\frac{\partial f}{\partial y}\mathbf{j}$$

- 计算方向导数的另一种方法：
  
  $$D_{\mathbf{u}}f=\nabla f\cdot\mathbf{u}$$

- 三元函数的梯度：
  
  函数$f(x,y,z)$的梯度为
  
  $$\nabla f=\left\langle\frac{\partial f}{\partial x},\frac{\partial f}{\partial y},\frac{\partial f}{\partial z}\right\rangle=\frac{\partial f}{\partial x}\mathbf{i}+\frac{\partial f}{\partial y}\mathbf{j}+\frac{\partial f}{\partial z}\mathbf{k}$$

- 最大变化率：
  
  函数在点$\mathbf{p}$处沿梯度方向$\nabla f(\mathbf{p})$的变化率最大，大小为$\|\nabla f(\mathbf{p})\|$。

- 水平集的切平面：
  
  设$F(x,y,z)=k$隐式确定了一个曲面（$F(x,y,z)$的一个水平集），并且$F$在曲面上的点$P(x_0,y_0,z_0)$处可微，且$\nabla F(x_0,y_0,z_0)\neq\mathbf{0}$。则通过$P$点并垂直于$\nabla F(x_0,y_0,z_0)$的平面是曲面在$P$点处的切平面。
  
  - 切平面通过点$P(x_0,y_0,z_0)$，法向量为$\nabla F(x_0,y_0,z_0)$。
  
  - 切平面方程：
    
    $$F_x(x_0,y_0,z_0)(x-x_0)+F_y(x_0,y_0,z_0)(y-y_0)+F_z(x_0,y_0,z_0)(z-z_0)=0$$
  
  - 法线的对称方程：
    
    $$\frac{x-x_0}{F_x(x_0,y_0,z_0)}=\frac{y-y_0}{F_y(x_0,y_0,z_0)}=\frac{z-z_0}{F_z(x_0,y_0,z_0)}$$

## 14.7 极值

- 绝对极值定义：
  
  设函数$f$的定义域为$S$，$\mathbf{p}_0$是$S$中的一点。
  
  - 如果对所有$S$中的$\mathbf{p}$，都有$f(\mathbf{p}_0)\geq f(\mathbf{p})$，则称$f(\mathbf{p}_0)$为绝对极大值。
  - 如果对所有$S$中的$\mathbf{p}$，都有$f(\mathbf{p}_0)\leq f(\mathbf{p})$，则称$f(\mathbf{p}_0)$为绝对极小值。
  - 如果$f(\mathbf{p}_0)$是绝对极大值或绝对极小值，则称其为绝对极值。

- 局部极值定义：
  
  设函数$f$的定义域为$S$，$\mathbf{p}_0$是$S$中的一点。
  
  - 如果存在$\mathbf{p}_0$的某个邻域$N$，对所有$S\cap N$中的$\mathbf{p}$，都有$f(\mathbf{p}_0)\geq f(\mathbf{p})$，则称$f(\mathbf{p}_0)$为局部极大值。
  - 如果存在$\mathbf{p}_0$的某个邻域$N$，对所有$S\cap N$中的$\mathbf{p}$，都有$f(\mathbf{p}_0)\leq f(\mathbf{p})$，则称$f(\mathbf{p}_0)$为局部极小值。
  - 如果$f(\mathbf{p}_0)$是局部极大值或局部极小值，则称其为局部极值。

- 极值定理：
  
  如果函数$f$在闭区域$S$上连续，则$f$在$S$上一定能取到绝对极大值和绝对极小值。

- 函数$f$在集合$S$上的临界点$\mathbf{p}_0$有以下三种类型之一：
  
  1. 边界点。
  2. 驻点：$S$内部的点$\mathbf{p}_0$，且$\nabla f(\mathbf{p}_0)=\mathbf{0}$。
  3. 奇点：$S$内部的点$\mathbf{p}_0$，且$f$在该点不可微。

- 临界点定理：
  
  设函数$f$定义在集合$S$上，且$S$包含$\mathbf{p}_0$。如果$f(\mathbf{p}_0)$是极值，则$\mathbf{p}_0$必须是临界点。

- 二阶导数判别法：
  
  设$f(x,y)$在$(x_0,y_0)$的某个邻域内有连续的二阶偏导数，且$\nabla f(x_0,y_0)=\mathbf{0}$。令
  
  $$D=D(x_0,y_0)=f_{xx}(x_0,y_0)f_{yy}(x_0,y_0)-(f_{xy}(x_0,y_0))^2$$
  
  - 如果$D>0$且$f_{xx}(x_0,y_0)<0$，则$f(x_0,y_0)$是局部极大值。
  - 如果$D>0$且$f_{xx}(x_0,y_0)>0$，则$f(x_0,y_0)$是局部极小值。
  - 如果$D<0$，则$(x_0,y_0)$是鞍点，$f(x_0,y_0)$不是极值。
  - 如果$D=0$，则判别法失效。$f$在$(x_0,y_0)$可能有局部极值，也可能是鞍点。
  
  判别式$D$的另一种计算方法：
  
  $$D=\begin{vmatrix}f_{xx}&f_{xy}\\f_{xy}&f_{yy}\end{vmatrix}=f_{xx}f_{yy}-(f_{xy})^2$$
  
  如果$D>0$，则$f_{xx}(x_0,y_0)$和$f_{yy}(x_0,y_0)$同号，因此$f_{yy}(x_0,y_0)$的符号也可以判断极值类型。

## 14.8 拉格朗日乘数法

- 拉格朗日乘数法步骤：
  
  为了在约束条件$g(\mathbf{p})=0$下求$f(\mathbf{p})$的极值：
  
  1. 求解方程组
     
     $$\nabla f(\mathbf{p})=\lambda\nabla g(\mathbf{p}),\quad g(\mathbf{p})=0$$
     
     得到$\mathbf{p}$和$\lambda$。
  
  2. 步骤1得到的每个点$\mathbf{p}$都是约束极值问题的一个临界点。将这些$\mathbf{p}$代入$f$，得到的最大值为$f$的最大值，最小值为$f$的最小值。

- 其中$\lambda$称为拉格朗日乘数。