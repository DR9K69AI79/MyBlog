---
title: G0123_MATLAB-02-MATLAB文本处理与绘图基础
date: 2025-02-19
summary: 介绍MATLAB中的文本数据类型（字符与字符串）、文本格式化方法，以及基础的绘图功能，包括plot函数、图例、坐标轴设置等。
category: G0123 MATLAB
tags:
  - 课程笔记
  - MATLAB
  - 文本处理
  - 绘图
comments: true
draft: false
sticky: 0
---
# MATLAB文本处理与绘图基础

## 1. 字符与字符串

MATLAB 提供两种存储文本的方式：

1. **字符数组（char array）**：使用单引号 `' '` 声明。
    
    ```matlab
    c = 'foo bar'   % c 是一个 1×7 的字符数组
    ```
    
    - 可以直接用数组下标访问其中的字符，例如 `c(5)` 即可取出第 5 个字符。
    - 可使用 `double()` 将字符转化为其对应的 **Unicode** 码值。
2. **字符串（string scalar/array）**：使用双引号 `"` 声明。
    
    ```matlab
    s = "foo bar"   % s 为一个字符串标量
    ```
    
    - **无法** 使用下标提取其中的字符，除非先用 `char(s)` 转化为字符数组。
    - 使用 `double("200")` 时，会将可解析数字的字符串转换为对应的数值，否则返回 `NaN`。

### 1.1 常见字符串操作

- **`char(s)`**：将字符串转为字符数组，以便字符级操作。
- **`num2str(x)`**：将数值转为字符串，以便与其他文本拼接。
- **拼接字符串**：使用 `+` 运算符（针对 string 类型）
    
    ```matlab
    deg = char(176);   % 176 代表 ‘°’ 符号  
    example = "The temp is " + num2str(21) + deg + "C."
    ```
    
- **Unicode 码值**：`double('foo')` 返回 `[102 111 111]`，依次表示 `'f' 'o' 'o'` 的码值。

---

## 2. 文本格式化：`compose`

- **基本用法**：
    
    ```matlab
    s = compose("The value of x is %d.", 500);
    ```
    
- **常见格式说明符**：
    - `%d` / `%i`: 整数
    - `%f`: 浮点数（定点表示法）
    - `%e`: 科学计数法表示
    - `%g`: `%e` 与 `%f` 中更紧凑的一种
- **精度指定**：
    - `%.4f` 表示保留 4 位小数
    - `%.4e` 表示科学计数法并保留 4 位小数
    - `%.4g` 表示保留 4 位有效数字

示例：

```matlab
s = compose("The value of x is %.4f.", pi);  % => "The value of x is 3.1416."
```

---

## 3. MATLAB 绘图基础：`plot` 函数

### 3.1 基本用法

- **`plot(x, y)`**：当 `x` 和 `y` 长度一致时，绘制 (x,y) 之间的折线。
- **`plot(y)`**：若只提供 `y`，则 x 轴默认为 `1:length(y)`。
- **增加更多数据点** 可使曲线更平滑。
- **数据顺序** 影响连接顺序，MATLAB 将按数据下标顺序逐点连接。

### 3.2 线型、颜色、标记（LineSpec）

- 在 `plot` 函数中可以通过第三个参数（或者 `Name-Value` 对）指定 **颜色**、**线型**、**标记样式**：
    
    ```matlab
    plot(x, y, "r--o") 
    ```
    
    其中：
    - 颜色：`"r"`(红), `"g"`(绿), `"b"`(蓝), `"m"`(洋红), `"c"`(青), `"y"`(黄), `"k"`(黑) 等
    - 线型：`"-"`(实线), `"--"`(虚线), `":"`(点线), `"-."`(点划线)
    - 标记：`"o"`(圆点), `"+"`, `"*"`, `"x"`, `"square"` 等

#### 3.2.1 Name-Value 参数

- **`"Color"`**：可用 RGB 三元组或预定义名称/十六进制来指定线色
- **`"LineStyle"`**：同上面介绍
- **`"LineWidth"`**：线宽(默认0.5)
- **`"Marker"`**：标记类型，如 `"o"`, `"*"`, `"square"`, 等
- **`"MarkerIndices"`**：指定在哪些点显示标记
- **`"MarkerSize"`**：标记大小
- **`"MarkerEdgeColor"`**：标记外框颜色
- **`"MarkerFaceColor"`**：标记填充颜色

示例：

```matlab
plot(x, y, "-o", "Color", [0 0.5 0.8], ...
     "MarkerIndices", 1:5:length(x), ...
     "LineWidth", 2, "MarkerSize", 8)
```

### 3.3 同一坐标轴绘制多条曲线

- **直接写多个 `(x, y)` 对**：
    
    ```matlab
    plot(x, y1, x, y2, x, y3)
    ```
    
- 也可用一次 `plot` + `hold on/off`：
    
    ```matlab
    plot(x, y1)
    hold on
    plot(x, y2)
    hold off
    ```

---

## 4. 图例：`legend`

- **基本用法**：`legend("label1", "label2", ...)` 为当前坐标轴各曲线添加图例。
- 可以只写 `legend` 而不带标签，则自动使用 `data1`, `data2`…… 或 `DisplayName` 作为标签：
    
    ```matlab
    plot(x, x.^2, "DisplayName","y = x^2");
    legend
    ```
    
- **位置与布局**：
    - `"Location"`：如 `"north"`, `"southoutside"`, `"eastoutside"`, 等等
    - `"Orientation"`：`"vertical"`(默认) 或 `"horizontal"`
    - `"NumColumns"`：设置图例中列数
- **图例外观**：
    - `legend("boxoff")` 可去掉图例外框
    - 可通过 `Name-Value` 对如 `"FontSize"`, `"TextColor"` 等进一步设置。

---

## 5. 标题、坐标轴名称和刻度

### 5.1 标题与副标题

- `title("主标题")`
- `title("主标题","副标题")`
- 设置字体与颜色：
    
    ```matlab
    title("My Title", "FontSize", 14, "Color", "blue")
    ```
    
- `Interpreter` 可以指定 `'latex'`, `'tex'`, 或 `'none'` 以控制文本解释方式。

### 5.2 坐标轴标签

- `xlabel("x-axis")`, `ylabel("y-axis")`
- 同样可通过 `FontSize` 等进行设置。

### 5.3 坐标轴范围与刻度

- `xlim([xmin xmax])`，`ylim([ymin ymax])`
- 若只想自动选一边，可设为 `-inf` 或 `inf`：
    
    ```matlab
    xlim([-inf 10])
    ```
    
- `xticks()` / `yticks()`：显式指定刻度位置。
- `xticklabels()` / `yticklabels()`：指定对应刻度标签文本。

### 5.4 网格与次网格

- `grid on` / `grid off`：打开或关闭主网格线。
- `grid minor`：添加细分网格线。

---

## 6. 坐标轴与图窗控制

### 6.1 获取/设置当前坐标轴：`gca`

- `ax = gca;` 将当前坐标轴句柄赋给 ax，可以 `ax.XAxisLocation = 'origin'` 等进行更多设置：
    - `XAxisLocation`/`YAxisLocation`: `'bottom'` / `'top'` / `'left'` / `'right'` / `'origin'`
    - `Box = 'off'` 可隐藏坐标轴边框

### 6.2 坐标轴比例与其它功能

- `axis equal`：让坐标轴单位比例相同（圆看起来是圆）。
- `axis square`：坐标轴区域绘制为正方形。
- `axis off`：隐藏坐标轴。
- `cla`：清除当前坐标轴的图形内容。
- `cla reset`：在清除图形的同时重置坐标轴属性为默认值。

### 6.3 图窗管理

- `figure`：新建一个空白图窗。也可通过 `figure(n)`/`figure(f)` 指定编号或句柄。
- `clf`：清空当前图窗内容。
- `clf('reset')`：重置当前图窗为默认属性。

---

## 7. 保存图像

- 使用 **图窗工具栏** 的 **“导出”** 按钮，可选择 `PNG/JPEG/TIFF/PDF` 等格式。
- **命令行方式**：
    - `saveas(gcf, "filename.png")`：保存当前图窗为指定图像格式；若不写扩展名则默认 `.fig`
    - `exportgraphics(gca, "filename.png", "Resolution", 300)`：导出当前坐标轴，带有紧凑边距并可设置分辨率。

示例：

```matlab
x = linspace(-10,10);
plot(x, x.^2);

saveas(gcf, "myplot.png")           % 直接保存为 png
exportgraphics(gca, "myplot2.png"); % 以较紧凑的边界保存当前坐标轴
```

---

## 8. 小结

本次 Lecture 2 的内容涵盖了：

1. **文本数据类型**：字符与字符串的区别及常见操作。
2. **文本格式化**：使用 `compose`、格式说明符以及 `num2str`。
3. **MATLAB 绘图**：`plot` 基础用法、线型与标记、同一图中绘制多条曲线、`legend` 图例配置、以及对坐标轴(`xlim`/`ylim`/`grid`/`ticks` 等)的灵活设置。
4. **图窗与坐标轴**：如何管理多个图窗、获取并修改当前坐标轴的属性等。
5. **保存图像**：可视化结果的导出方法。

通过学习这些知识，既能更好地掌握 MATLAB 中的文本与字符串处理方式，又能灵活地完成绘图、标注和图表美化操作，为后续更高级的可视化与数据处理打下基础。

---

_以上即为 Lecture 2 的核心笔记与要点整理。_