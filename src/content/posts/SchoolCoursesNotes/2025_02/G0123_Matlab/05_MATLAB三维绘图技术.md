---
title: MATLAB三维绘图技术
date: 2025-02-19
summary: 介绍MATLAB中的三维绘图功能，包括三维线图、网格曲面图、等高线图、球体椭球体绘制以及三维图形的旋转和视角控制。
category: G0123 MATLAB
tags:
  - 课程笔记
  - MATLAB
  - 三维绘图
  - 可视化
comments: true
draft: false
sticky: 0
---
# MATLAB三维绘图技术

## 1. 三维线图：`plot3`

### 1.1 基本用法

- **`plot3(X, Y, Z)`**：若 XX、YY、ZZ 均为 **等长向量**，此函数会在三维坐标系中绘制连接各坐标点 (xi,yi,zi)(x_i, y_i, z_i) 的线段。
    
    ```matlab
    % 连接 (1,2,1) 和 (2,3,3) 两点的三维线图
    plot3([1 2],[2 3],[1 3]);
    grid on
    xlabel("x"); ylabel("y"); zlabel("z");
    ```

### 1.2 视角调整

- **`view(az, el)`**：手动设置相机视角的方位角（azimuth, az）与仰角（elevation, el）。
- **`view(2)`** 与 `view(3)`：快速切换默认的二维或三维视图。

示例：

```matlab
% 先绘制点 (x, y, z)，再调整视角
plot3(x, y, z);
view(-20, 18)   % 将方位角设为 -20°，仰角设为 18°
view(2)         % 切回2D视图（俯视）
```

---

## 2. 网格与曲面图：`mesh`、`surf`

### 2.1 `meshgrid`：生成 2D 网格

- **`[X, Y] = meshgrid(x, y)`**：根据向量 `x` 和 `y` 生成网格坐标矩阵 `X`、`Y`，其中 `X` 的每一行都是 `x`，`Y` 的每一列都是 `y`。
- 对函数 z=f(x,y)z = f(x,y)，可先用 `meshgrid` 生成坐标，再令 `Z = f(X,Y)`。

### 2.2 `mesh`：网格图

- **`mesh(X, Y, Z)`**：在 x-y 平面上用 `X`、`Y` 网格定位，`Z` 作为垂直高度并形成网格表面，仅有线框。
- 可用 **`mesh(X, Y, Z, "EdgeColor", "interp")`** 等参数来指定插值着色或线框颜色。

```matlab
x = linspace(-2,2);
[X,Y] = meshgrid(x,x);
Z = X.^2 + Y.^2;
mesh(X,Y,Z);
xlabel("x"); ylabel("y"); zlabel("z");
colorbar;
```

### 2.3 `surf`：曲面图

- **`surf(X, Y, Z)`**：与 `mesh` 相似，但生成带有 **实心面** 的三维表面，可通过顶点值进行颜色映射。
- 常用属性：
    - `"FaceColor","interp"`：面插值着色
    - `"EdgeColor","none"`：隐藏网格线

```matlab
x = linspace(-2,2);
[X,Y] = meshgrid(x,x);
Z = X.^2 + Y.^2;
surf(X,Y,Z,"FaceColor","interp");
shading interp;      % 进一步改善插值效果
colormap(jet(8));    % 使用8种渐变色
colorbar;
```

### 2.4 `shading` 控制

- `shading faceted`（默认）：带黑色网格线
- `shading flat`：面颜色统一，每块面单独
- `shading interp`：平滑插值

---

## 3. 等高线图与组合绘制

### 3.1 `contour` 与 `contour3`

- **`contour(X, Y, Z, levels)`**：在平面上绘制 `Z` 的等高线；`levels` 可指定画几条线，或指定具体高度值。
    
- `contour3`：在三维坐标中显示等高线（在 zz 轴方向相应抬高）。
    
    ```matlab
    x = linspace(-5,5);
    [X,Y] = meshgrid(x,x);
    Z = X.^2 + Y.^2;
    contour(X,Y,Z,10,"ShowText","on");  % 在平面显示10条等高线，并显示数值
    axis equal; colorbar;
    ```

### 3.2 组合图：`meshc`、`surfc`

- **`meshc(X,Y,Z)`**：在网格图下方附加等高线。
- **`surfc(X,Y,Z)`**：在曲面图下方附加等高线。

示例：

```matlab
x = linspace(-5,5,50);
[X,Y] = meshgrid(x,x);
Z = X.^2 + Y.^2;
surfc(X,Y,Z);
shading interp;
colorbar;
```

---

## 4. 绘制球面、椭球体

### 4.1 `sphere`

- **`sphere`**：直接绘制单位球（20×20面）。
- **`[X, Y, Z] = sphere(n)`**：返回半径为1、大小为 (n+1)×(n+1)(n+1) \times (n+1) 的球面坐标矩阵，但不自动绘图。可搭配 `surf(X,Y,Z)` 或 `mesh(X,Y,Z)` 来绘制。
- 可以通过缩放和平移，将球体变为其它位置或大小：
    
    ```matlab
    [Xs, Ys, Zs] = sphere(30);
    r = 5;
    a = 2; b = 3; c = 1;       % 球心 (a,b,c)，半径 r
    surf(r*Xs + a, r*Ys + b, r*Zs + c);
    axis equal;
    ```

### 4.2 `ellipsoid`

- **`ellipsoid(xc, yc, zc, xr, yr, zr)`**：绘制中心位于 (xc,yc,zc)(xc,yc,zc) 的椭球体，三个半轴分别是 `xr`、`yr`、`zr`，默认 20×20 面。
- 返回值可用来进行平移或旋转处理。

示例：

```matlab
% 椭球：中心(0,0,0)、半径(4,8,2)
ellipsoid(0,0,0,4,8,2)
axis equal
```

---

## 5. 旋转图形：`rotate`

- **`rotate(h, direction, angle)`**：将图形对象 `h` 围绕 `direction` 向量所指的轴旋转 `angle` 度（默认为度数）。
- 注意：`rotate` 会改变对象本身的数据，相对于仅改变视角的 `view`、`rotate3d` 不同。

示例：

```matlab
[X, Y, Z] = ellipsoid(0,0,0,4,8,2);
hSurf = surf(X,Y,Z);
direction = [1 0 0]; % 绕x轴
rotate(hSurf, direction, 45);
```

---

## 6. 综合示例

以下示例展示从定义网格，到绘制曲面、等高线再到添加球体的过程：

```matlab
% 1) 定义网格并计算Z
x = linspace(-3,3,50);
[X,Y] = meshgrid(x,x);
Z = X.^2 + Y.^2;

% 2) 绘制表面 + 等高线
figure;
surfc(X,Y,Z);
shading interp;
colormap(parula);
colorbar;
title("Surf + Contour of z = x^2 + y^2");

% 3) 叠加单位球
hold on;
[Xs, Ys, Zs] = sphere(20);
surf(Xs, Ys, Zs, "FaceColor","r","FaceAlpha",0.3,"EdgeColor","none");
axis equal;
hold off;
```

---

## 7. 小结

Lecture 5 主要介绍了 **三维绘图** 在 MATLAB 中的各类实现方式，包括：

1. **三维线图**：`plot3(X,Y,Z)` 及 `view`、`grid on` 等操作。
2. **网格/曲面图**：利用 `meshgrid` 配合 `mesh(X,Y,Z)`、`surf(X,Y,Z)` 绘制三维数据，结合 `shading`、`colormap` 及 `colorbar` 做可视化增强。
3. **等高线图**：`contour`/`contour3` 以及组合图 `meshc`、`surfc`。
4. **球面与椭球**：`sphere`、`ellipsoid` 的绘制及变换。
5. **对象旋转**：`rotate` 函数改变对象自身数据，与仅调整视图的 `view`/`rotate3d` 不同。

通过本讲的学习，可以进一步掌握 MATLAB 中三维坐标系下的数据可视化技术，实现更加丰富、直观的三维分析与展示。

---

_以上即为 Lecture 5 的核心笔记与要点整理。_