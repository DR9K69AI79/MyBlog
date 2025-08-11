---
title: 初等数论 - 第5章 - 二次剩余
date: 2024-03-21
summary: 本章系统介绍二次剩余理论，包括勒让德符号、欧拉判别法、高斯引理、二次互反律以及雅可比符号等重要概念，为深入研究数论中的二次型问题奠定基础。
category: 初等数论
tags:
  - 课程笔记
  - 数论
  - 二次剩余
  - 数学
comments: true
draft: false
sticky: 0
---
# 5.1 二次剩余与二次非剩余

## 定义

如果正整数 $m$ 和整数 $a$ 满足 $(a,m)=1$，且 $x^2 \equiv a \bmod m$ 有解，我们称 $a$ 为模 $m$ 的二次剩余。

如果 $x^2 \equiv a \bmod m$ 无解，我们称 $a$ 为模 $m$ 的二次非剩余。

## 定理

1. 设 $p$ 是奇素数，$a$ 是不能被 $p$ 整除的整数。则同余式 $x^2 \equiv a \bmod p$ 要么无解，要么有两个模 $p$ 的解。

2. 如果 $p$ 是奇素数，那么在 $1,2,\ldots,p-1$ 中恰有 $(p-1)/2$ 个模 $p$ 的二次剩余和 $(p-1)/2$ 个模 $p$ 的二次非剩余。

3. 设 $p$ 为素数，$r$ 为 $p$ 的一个原根。如果整数 $a$ 不能被 $p$ 整除，那么当 $\mathrm{ind}_r a$ 为偶数时，$a$ 是模 $p$ 的二次剩余；当 $\mathrm{ind}_r a$ 为奇数时，$a$ 是模 $p$ 的二次非剩余。

## 勒让德符号

设 $p$ 为奇素数，$a$ 为不能被 $p$ 整除的整数。勒让德符号 $\left(\frac{a}{p}\right)$ 定义为：

$$
\left(\frac{a}{p}\right) = \begin{cases}
1, & \text{如果 } a \text{ 是模 } p \text{ 的二次剩余}; \\
-1, & \text{如果 } a \text{ 是模 } p \text{ 的二次非剩余}.
\end{cases}
$$

## 欧拉判别法

设 $p$ 为奇素数，$a$ 为不能被 $p$ 整除的整数。则

$$
\left(\frac{a}{p}\right) \equiv a^{\frac{p-1}{2}} \bmod p
$$

## 定理

设 $p$ 为奇素数，$a$ 和 $b$ 为不能被 $p$ 整除的整数。则

1. 如果 $a \equiv b \bmod p$，则 $\left(\frac{a}{p}\right) = \left(\frac{b}{p}\right)$。
2. $\left(\frac{a}{p}\right)\left(\frac{b}{p}\right) = \left(\frac{ab}{p}\right)$。
3. $\left(\frac{a^2}{p}\right) = 1$。

## 定理

如果 $p$ 是奇素数，则 $-1$ 是模 $p$ 的二次剩余当且仅当 $p \equiv 1 \bmod 4$。

## 高斯引理

设 $p$ 为奇素数，$a$ 为与 $p$ 互素的整数。如果在 $a,2a,3a,\ldots,\frac{p-1}{2}a$ 的最小正剩余中大于 $(p-1)/2$ 的数有 $s$ 个，则

$$
\left(\frac{a}{p}\right) = (-1)^s
$$

## 定理

设 $p$ 为奇素数。则 $2$ 是模 $p$ 的二次剩余当且仅当 $p \equiv \pm 1 \bmod 8$。

# 5.2 二次互反律

## 二次互反律

设 $p$ 和 $q$ 是不同的奇素数。则

$$
\left(\frac{p}{q}\right)\left(\frac{q}{p}\right) = (-1)^{\frac{p-1}{2} \cdot \frac{q-1}{2}}
$$

## 引理

如果 $p$ 是奇素数，$a$ 是不能被 $p$ 整除的奇整数，则

$$
\left(\frac{a}{p}\right) = (-1)^{T(a,p)}
$$

其中

$$
T(a,p) = \sum_{j=1}^{(p-1)/2} \left\lfloor \frac{ja}{p} \right\rfloor
$$

这里 $\lfloor x \rfloor$ 表示不超过 $x$ 的最大整数。

## 定理

当 $a$ 和 $b$ 是互素的奇整数时，考虑矩形

$$
R = \left\{(x,y) \mid 0 < x < \frac{a}{2}, 0 < y < \frac{b}{2}\right\}
$$

和直线

$$
L = \left\{(x,y) \mid y = \left\lfloor \frac{b}{a}x \right\rfloor\right\}
$$

1. $T(b,a)$ 为矩形 $R$ 中位于直线 $L$ 下方的格点数。
2. $T(a,b)$ 为矩形 $R$ 中位于直线 $L$ 上方的格点数。

# 5.3 雅可比符号

## 定义

设 $n$ 是奇正整数，其素因子分解为 $n=p_1^{t_1}p_2^{t_2}\cdots p_m^{t_m}$，$a$ 是与 $n$ 互素的整数。则雅可比符号 $\left(\frac{a}{n}\right)$ 定义为

$$
\left(\frac{a}{n}\right) = \left(\frac{a}{p_1}\right)^{t_1}\left(\frac{a}{p_2}\right)^{t_2}\cdots\left(\frac{a}{p_m}\right)^{t_m}
$$

如果 $(a,n)>1$，则 $\left(\frac{a}{n}\right)=0$。

## 雅可比符号的性质

设 $n$ 是奇正整数，$a$ 和 $b$ 是与 $n$ 互素的整数。则

1. 如果 $a \equiv b \bmod n$，则 $\left(\frac{a}{n}\right) = \left(\frac{b}{n}\right)$。
2. $\left(\frac{ab}{n}\right) = \left(\frac{a}{n}\right)\left(\frac{b}{n}\right)$。
3. $\left(\frac{-1}{n}\right) = (-1)^{\frac{n-1}{2}}$。
4. $\left(\frac{2}{n}\right) = (-1)^{\frac{n^2-1}{8}}$。

## 雅可比符号的互反律

设 $m$ 和 $n$ 是大于 $1$ 的互素奇正整数。则

$$
\left(\frac{m}{n}\right)\left(\frac{n}{m}\right) = (-1)^{\frac{m-1}{2} \cdot \frac{n-1}{2}}
$$