---
title: DMT211_算法-03-算法分析（续）
date: 2024-04-23
summary: 继续深入算法分析，涵盖常见函数的渐近界、求和公式、非递归算法分析、递归算法分析、递归关系求解以及斐波那契数列的递归分析方法。
category: DMT211_ALGORITHM
tags:
  - 课程笔记
  - 算法分析
  - 递归算法
  - 复杂度分析
comments: true
draft: false
sticky: 0
---
# 算法分析（续）

## 本课主题
- 算法的时间效率(time efficiency)
  - 非递归算法
  - 递归算法

## 一些常见函数的渐近界(asymptotic bounds)
- 多项式(polynomials)：如果$a_d>0$，则$a_0+a_1n+\dots+a_dn^d$是$O(n^d)$。
- 对数(logarithms)：对任意常数$a,b>0$，$O(\log_an)=O(\log_bn)$。
- 对数(logarithms)：对每个$x>0$，$\log n\in O(n^x)$。
- 指数(exponentials)：对每个$r>1$和每个$d>0$，$n^d\in O(r^n)$。

## 有用的求和公式和规则
- $\sum_{i=l}^u1=1+1+\dots+1=u-l+1$
- $\sum_{i=1}^{n-1}1=1+1+\dots+1=n-1-1+1=n-1\in\Theta(n)$
- $\sum_{i=1}^ni=1+2+3+\dots+n=\frac{n(n+1)}{2}\approx\frac{1}{2}n^2\in\Theta(n^2)$
- $\sum_{i=1}^ni^2=1^2+2^2+3^2+\dots+n^2=\frac{n(n+1)(2n+1)}{6}\approx\frac{1}{3}n^3\in\Theta(n^3)$
- $\sum_{i=0}^na^i=1+a+a^2+\dots+a^n=\frac{a^{n+1}-1}{a-1}$，对任意$a\neq1$
- $\sum_{i=0}^n2^i=1+2+2^2+\dots+2^n=\frac{2^{n+1}-1}{2-1}=2^{n+1}-1\in\Theta(2^n)$
- $\sum_{i=l}^uca^i=c\sum_{i=l}^ua^i$
- $\sum_{i=l}^u(a_i\pm b_i)=\sum_{i=l}^ua_i+\sum_{i=l}^ub_i$
- $\sum_{i=l}^ua_i=\sum_{i=l}^ma_i+\sum_{i=m+1}^ua_i$

## 非递归算法分析计划
1. 决定表示输入大小的参数$n$
2. 识别算法的基本操作(basic operation)
3. 检查基本操作执行的次数。确定大小为$n$的输入的最坏/平均/最佳情况
4. 设置一个表示基本操作执行次数的求和式
5. 使用标准公式和规则简化求和式

## 递归(recurrence relation)
- 递归是一个定义为自身的方程，也称为递推或递推方程
- 提供了分析递归结构的方法
- 每次函数调用自身时，返回地址都会被推入堆栈
- 对于每个返回，返回地址从堆栈弹出到控制返回的位置

## 递归算法分析计划
1. 决定表示输入大小的参数
2. 识别算法的基本操作
3. 确定大小为$n$的输入的最坏/平均/最佳情况  
4. 设置一个带有适当初始条件的递归关系，表示基本操作执行的次数
5. 通过反向替换或其他方法求解递归（或至少确定其解的增长阶）

## 解决递归的有用资源
- https://www.youtube.com/watch?v=gCsfk2ei2R8
- https://www.youtube.com/watch?v=Ob8SM0fz6p0

## 斐波那契数(Fibonacci numbers)
斐波那契数列：0, 1, 1, 2, 3, 5, 8, 13, 21, ...，由以下斐波那契递归定义：
- $F(n)=F(n-1)+F(n-2)$，对$n>1$
- $F(0)=0$
- $F(1)=1$

解决递归：# 课程4：分析算法（续）

## 本课主题
- 算法的时间效率(time efficiency)
  - 非递归算法
  - 递归算法

## 一些常见函数的渐近界(asymptotic bounds)
- 多项式(polynomials)：如果$a_d>0$，则$a_0+a_1n+\dots+a_dn^d$是$O(n^d)$。
- 对数(logarithms)：对任意常数$a,b>0$，$O(\log_an)=O(\log_bn)$。
- 对数(logarithms)：对每个$x>0$，$\log n\in O(n^x)$。
- 指数(exponentials)：对每个$r>1$和每个$d>0$，$n^d\in O(r^n)$。

## 有用的求和公式和规则
- $\sum_{i=l}^u1=1+1+\dots+1=u-l+1$
- $\sum_{i=1}^{n-1}1=1+1+\dots+1=n-1-1+1=n-1\in\Theta(n)$
- $\sum_{i=1}^ni=1+2+3+\dots+n=\frac{n(n+1)}{2}\approx\frac{1}{2}n^2\in\Theta(n^2)$
- $\sum_{i=1}^ni^2=1^2+2^2+3^2+\dots+n^2=\frac{n(n+1)(2n+1)}{6}\approx\frac{1}{3}n^3\in\Theta(n^3)$
- $\sum_{i=0}^na^i=1+a+a^2+\dots+a^n=\frac{a^{n+1}-1}{a-1}$，对任意$a\neq1$
- $\sum_{i=0}^n2^i=1+2+2^2+\dots+2^n=\frac{2^{n+1}-1}{2-1}=2^{n+1}-1\in\Theta(2^n)$
- $\sum_{i=l}^uca^i=c\sum_{i=l}^ua^i$
- $\sum_{i=l}^u(a_i\pm b_i)=\sum_{i=l}^ua_i+\sum_{i=l}^ub_i$
- $\sum_{i=l}^ua_i=\sum_{i=l}^ma_i+\sum_{i=m+1}^ua_i$

## 非递归算法分析计划
1. 决定表示输入大小的参数$n$
2. 识别算法的基本操作(basic operation)
3. 检查基本操作执行的次数。确定大小为$n$的输入的最坏/平均/最佳情况
4. 设置一个表示基本操作执行次数的求和式
5. 使用标准公式和规则简化求和式

## 递归(recurrence relation)
- 递归是一个定义为自身的方程，也称为递推或递推方程
- 提供了分析递归结构的方法
- 每次函数调用自身时，返回地址都会被推入堆栈
- 对于每个返回，返回地址从堆栈弹出到控制返回的位置

## 递归算法分析计划
1. 决定表示输入大小的参数
2. 识别算法的基本操作
3. 确定大小为$n$的输入的最坏/平均/最佳情况  
4. 设置一个带有适当初始条件的递归关系，表示基本操作执行的次数
5. 通过反向替换（Backward Substitution）或其他方法求解递归（或至少确定其解的增长阶）

## 关于反向替换的有用资源
- https://www.youtube.com/watch?v=gCsfk2ei2R8
- https://www.youtube.com/watch?v=Ob8SM0fz6p0

## 斐波那契数(Fibonacci numbers)
斐波那契数列：0, 1, 1, 2, 3, 5, 8, 13, 21, ...，由以下斐波那契递归定义：
- $F(n)=F(n-1)+F(n-2)$，对$n>1$
- $F(0)=0$
- $F(1)=1$

解决递归：
- 使用定理 - 具有常系数的一般二阶线性齐次递推(general second order linear homogeneous recurrence with constant coefficients)：$aX(n)+bX(n-1)+cX(n-2)=0$

## 总结
- 时间效率(time efficiency) - 表示算法运行速度
  - 其输入大小的函数
  - 基本操作执行的次数
  - 最坏情况，平均情况，最佳情况
- 渐近增长阶(asymptotic order of growth)
  - $O$, $\Omega$, $\Theta$记号
- 效率类(efficiency classes)
  - 常数，对数，线性，线性对数(linearithmic)，二次，三次，指数
- 非递归/递归算法分析
- 使用定理 - 具有常系数的一般二阶线性齐次递推(general second order linear homogeneous recurrence with constant coefficients)：$aX(n)+bX(n-1)+cX(n-2)=0$