---
title: CG-06-纹理映射
date: 2024-05-30
summary: 本章详细介绍了纹理映射的基本原理和应用，包括纹理坐标、过滤模式、Mipmapping、环境映射等技术，以及在OpenGL中的具体实现方法。
category: DMT201_Computer Graphics
tags:
  - 课程笔记
  - 计算机图形学
  - 纹理映射
  - OpenGL
comments: true
draft: false
sticky: 0
---
# 第6章: 纹理映射(Texture Mapping)

### 1. 纹理映射简介

纹理映射(Texture Mapping)是一种技术，用于将图像映射到三角形、点、线及其他图像上。这种技术关联顶点和像素管道，使渲染的图像可以被用作新图像的纹理。纹理映射实现了一到三个参数的通用函数，这些参数由1维、2维或3维表（即纹理图像）指定，并通过插值（即过滤）查找。

纹理映射推动了GPU的硬件架构发展，包括多线程延迟隐藏和着色器(shader)的可编程性。它还为OpenGL增加了许多功能，如体积渲染、替代色彩空间和阴影处理。

### 2. 纹理映射的动机

在现代图形卡中，每秒可处理数千万个多边形。然而，要用三角形来模拟真实对象的细节有时过于复杂。纹理映射让我们能够在计算机图形场景中使用真实图像来增加逼真的细节，而不会带来高昂的几何成本。

### 3. 纹理映射的基础

纹理通常是2D图像，纹理的单个元素称为纹理元(texel)。纹理元的值用于以某种方式修改表面外观。纹理和表面之间的映射决定了像素和纹理元如何对应。

#### 如何找到正确的纹理元？

1. 找到可见像素。
2. 找到对应于可见像素的表面点。
3. 找到映射到表面点的纹理中的点（纹理元）。
4. 使用适当的纹理元值来着色像素。
5. 通过函数计算像素值。
6. 从文件加载像素值。

### 4. 纹理映射策略

应用纹理的三个步骤：

1. 指定纹理：
   - 读取或生成图像。
   - 分配给纹理。
   - 启用纹理映射。
2. 将纹理坐标分配给顶点。
3. 指定纹理参数（如包装、过滤）。

### 5. 在OpenGL中定义和应用纹理

#### 定义纹理图像：

```latex
\text{glTexImage2D}(\text{target}, \text{level}, \text{components}, w, h, \text{border}, \text{format}, \text{type}, \text{texels});
```

- `target`: 纹理类型，例如 `GL_TEXTURE_2D`
- `level`: 用于mipmapping。
- `components`: 每个纹理元的元素。
- `w, h`: 纹理元的宽度和高度，单位为像素。
- `border`: 用于平滑。
- `format` 和 `type`: 描述纹理元。
- `texels`: 指向纹理元数组的指针。

#### 应用纹理：

1. 在纹理对象中指定纹理。
2. 设置纹理过滤器。
3. 设置纹理函数。
4. 设置纹理包装模式。
5. 设置可选的透视校正提示。
6. 绑定纹理对象。
7. 启用纹理映射。
8. 为顶点提供纹理坐标（坐标也可以自动生成）。

### 6. 其他纹理特性

包括环境映射和多纹理处理，这些功能通过级联纹理单元应用一系列纹理。

### 7. 纹理映射和OpenGL管道

图像和几何体分别通过独立的管道流动，并在光栅化器(rasterizer)处汇合。复杂的纹理不会影响几何复杂度。

### 8. 纹理参数

OpenGL有多种参数决定如何应用纹理：

- 包装参数决定当s和t超出(0,1)范围时发生的情况。
- 过滤模式允许使用面积平均而不是点采样。
- Mipmapping允许在多分辨率下使用纹理。
- 环境参数决定纹理映射如何与着色交互。

#### 包装模式

- 钳制(Clamping)：如果s,t > 1则使用1，如果s,t < 0则使用0。
- 包装(Wrapping)：使用s,t取模1。

```c
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP);
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
```

#### 放大和缩小

纹理多边形可以覆盖多个纹理元（缩小）或多个像素可以覆盖一个纹理元（放大）。可以使用点采样（最近纹理元）或线性过滤（2x2过滤器）来获得纹理值。

```c
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
```

#### Mipmapping

Mipmapping允许预过滤的纹理映射在降低分辨率的情况下使用，从而减少了较小纹理对象的插值误差。声明mipmap级别时使用：

```c
glTexImage2D(GL_TEXTURE_2D, level, ...);
```

### 9. 纹理函数

控制如何应用纹理：

```c
glTexEnv{fi}[v](GL_TEXTURE_ENV, prop, param);
```

- `GL_TEXTURE_ENV_MODE` 模式：
  - `GL_MODULATE`: 与计算的阴影调制。
  - `GL_BLEND`: 与环境色混合。
  - `GL_REPLACE`: 仅使用纹理颜色。

```c
glTexEnvf(GL_TEXTURE_ENV, GL_TEXTURE_ENV_MODE, GL_MODULATE);
```

设置混合颜色：

```c
glTexEnvf(GL_TEXTURE_ENV, GL_TEXTURE_ENV_COLOR, ...);
```

### 10. 透视校正提示

纹理坐标和颜色插值可以在线性屏幕空间中进行，也可以使用深度/透视值进行（较慢）。对于“边缘”多边形，这种差异特别明显。

```c
glHint(GL_PERSPECTIVE_CORRECTION_HINT, hint);
```

其中`hint`可以是以下之一：

- `GL_DONT_CARE`
- `GL_NICEST`
- `GL_FASTEST`

### 11. 自动生成纹理坐标

OpenGL可以自动生成纹理坐标：

```c
glTexGen{ifd}[v]();
```

- 指定一个平面。
- 基于距离平面的距离生成纹理坐标。
- 生成模式：
  - `GL_OBJECT_LINEAR`
  - `GL_EYE_LINEAR`
  - `GL_SPHERE_MAP`（用于环境映射）。

### 12. 其他纹理功能

#### 环境映射

- 从广角镜头图像开始。
- 可以是实际扫描的图像或用OpenGL创建的图像。
- 使用此纹理生成球面图。
- 使用自动纹理坐标生成。

#### 多重纹理

通过级联纹理单元应用一系列纹理。