---
title: MATLAB高级绘图：多图布局与对数坐标系
date: 2025-02-19
summary: 介绍MATLAB中的常见数学函数、多图布局方法（tiledlayout、subplot）、对数坐标系绘图以及双y轴绘图等高级可视化技术。
category: G0123 MATLAB
tags:
  - 课程笔记
  - MATLAB
  - 高级绘图
  - 可视化
comments: true
draft: false
sticky: 0
---
# MATLAB高级绘图：多图布局与对数坐标系

## 1. 前面内容回顾

### 1.1 矩阵与向量创建

1. **行向量**
    
    ```matlab
    x = [2 4 6 8 10];
    x = [1, 2, 3, 4, 5];
    ```
    
2. **列向量**
    
    ```matlab
    x = [1; 2; 3; 4; 5];
    ```
    
3. **矩阵**
    
    ```matlab
    A = [1 2 3; 4 5 6];
    ```
    
4. **冒号运算符**
    
    ```matlab
    0:3:20    % 生成从 0 到 20, 步长为 3
    ```
    
5. **linspace**
    
    ```matlab
    linspace(0,10,11)  % 生成 11 个等间距点
    ```

### 1.2 长度与最大/最小值

- `length(x)`：获取向量 x 的长度。
- `max(x)` / `min(x)`：分别返回最大值、最小值。

### 1.3 索引与赋值

- `x(4)`：第 4 个元素；`x(end)`：向量的最后一个元素。
- `x(a:b)`：提取向量从下标 a 到 b 的元素（整段）。
- 如果直接为超出当前大小的下标赋值，则数组自动扩展。

### 1.4 示例：线性函数

- 直线 y=mx+cy = mx + c，可只用两个点绘制：
    
    ```matlab
    x = [-10 10];
    y = 2*x - 3;
    plot(x,y);
    ```

---

## 2. 常见函数（指数 / 对数 / 幂 / 根）

MATLAB 提供多种指数和对数相关函数：

- **指数函数**：`exp(x)` 表示 exe^x
- **对数函数**：`log(x)` 为自然对数 ln⁡(x)\ln(x)，`log10(x)` 为常用对数 log⁡10(x)\log_{10}(x)，`log2(x)` 为 log⁡2(x)\log_2(x)
- **幂函数**：可使用 `.^` 实现逐元素幂运算。
- **根函数**：`sqrt(x)`, `nthroot(x,n)`, `realsqrt(x)`（要求非负数）。

---

## 3. 多图绘制：子图与网格布局

### 3.1 `tiledlayout(m,n)` 与 `nexttile`

- **`tiledlayout(m,n)`**：创建一个包含 m×nm \times n 网格的 **“tiled chart layout”**。
- **`nexttile`**：在该布局内选定一个子图区域，随后 `plot` 即绘制到该子图。
- 可通过 `nexttile([m n])` 跨多个单元格绘制，或使用 `title(t,"Shared Title")`/`xlabel(t,"x")` 等方式添加共享标题和坐标轴标签。

示例：

```matlab
tiledlayout(2,2)

% 第 1 个子图
nexttile
plot(x, x.^2)

% 第 2 个子图
nexttile
plot(x, sin(x))

% 第 3 个子图(跨 1×2 单元)
nexttile([1 2])
plot(x, x.^3)
```

### 3.2 `subplot(m,n,p)`

- **`subplot(m,n,p)`**：将当前图窗划分为 m×nm \times n 网格，将第 pp 块设为当前坐标轴。
- 若需要跨越多个网格，可指定一个向量如 `[1 3]`。
- 与 `tiledlayout` 效果类似，但 `subplot` 在某些布局场景下更为传统。

---

## 4. 对数坐标绘图

对于快速增长或跨多个数量级的数据，常用对数坐标绘图：

6. **`semilogy(x,y)`**：x 轴保持线性，y 轴使用 10 为底的对数刻度。
7. **`semilogx(x,y)`**：x 轴使用对数刻度，y 轴保持线性。
8. **`loglog(x,y)`**：x、y 坐标都采用对数刻度。

示例：

```matlab
% 画 y = 10^x, x 从 0 到 5
x = 0:0.1:5;
semilogy(x, 10.^x);
title("semilogy plot of 10^x");
```

这些对数绘图本质上与取 log 后再线性绘图等效，但能直接使用高层接口实现自动坐标刻度与标记。

---

## 5. 其他示例：`logspace` 与指数函数可视化

- **`logspace(a,b,n)`**：生成 nn 个在 [10a,10b][10^a, 10^b] 之间对数均匀分布的点。
- 可结合 `plot`、`semilogx`、`loglog` 等实现不同坐标变换。

示例：

```matlab
x = logspace(0,4,100);  % 从 10^0=1 到 10^4=10000
plot(x, log10(x));
semilogx(x, log10(x));
loglog(x, 10.^x);
```

---

## 6. `yyaxis` 实现双 y 轴

当需要在同一 x 轴上绘制两个范围差距较大的 y 值时，可使用 **双 y 轴**：

```matlab
x = linspace(-10,10);

yyaxis left
plot(x, x.^2)
ylabel("x^2")

yyaxis right
plot(x, x.^3)
ylabel("x^3")
title("双 y 轴示例")
```

---

## 7. 在图中添加文本：`text`

- `text(x, y, "Some Label")`：在坐标 (x, y) 处添加文本。
- 用于标记关键点时，可根据需要设定 `FontSize`, `Color` 等属性。
- 箭头、上下标等可借助 TeX/LaTeX 字符或 `"\uparrow"`, `"\leftarrow"` 等辅助符号完成。

示例：

```matlab
x = linspace(-2*pi, 2*pi);
y = sin(x);
plot(x,y); grid on

% 在 (pi, 0) 处添加文本
text(pi, 0, "\leftarrow (\pi,0)");
```

---

## 8. 小结

本次 Lecture 3 的内容涵盖了：

9. **前两讲回顾**：向量/矩阵创建、索引与赋值、基础绘图。
10. **常见函数**：指数、对数、幂及根函数在 MATLAB 中的使用。
11. **多图排布**：`tiledlayout` + `nexttile` 和传统 `subplot` 的区别与用法。
12. **对数坐标系**：`semilogy` / `semilogx` / `loglog` 在可视化中应用。
13. **双 y 轴**：`yyaxis` 实现双轴绘图。
14. **辅助标注**：`text` 用于在图中添加文本或箭头标记。

通过学习这些内容，能够在更丰富的场景下完成对数据的可视化及初步分析，并熟练地在同一图窗内组织多张子图，或以对数坐标系有效呈现高速变化的数据。

---

_以上即为 Lecture 3 的核心笔记与要点整理。_