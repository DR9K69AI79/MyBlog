---
title: DMT201_CG-02-三维视图和图形渲染管线回顾
date: 2024-04-18
summary: 本章详细介绍了三维视图的基本概念、图形渲染管线的各个阶段，包括模型变换、视图变换、投影变换、裁剪和光栅化等核心内容。
category: DMT201_CG
tags:
  - 课程笔记
  - 计算机图形学
  - 渲染管线
  - OpenGL
comments: true
draft: false
sticky: 0
---
# 三维视图和图形渲染管线回顾

## 视图(Viewing)

- 视图包括从世界坐标(World Coordinates)到屏幕坐标(Screen Coordinates)的转换
- 裁剪(Clipping): 移除屏幕外的部分
  - 二维裁剪
  - 三维裁剪

## 二维视图管线(2D Viewing Pipeline)

1. 裁剪窗口(Clipping Window):我们想看到的区域
   - 在世界坐标中定义一个矩形区域，由$(x^w_{min}, x^w_{max}, y^w_{min}, y^w_{max})$确定
2. 视口(Viewport):我们想在屏幕上显示的区域 
   - 在屏幕坐标中定义一个矩形区域，由$(x^v_{min}, x^v_{max}, y^v_{min}, y^v_{max})$确定
3. 视图变换包括:
   - 平移(Panning): 改变裁剪窗口的位置
   - 缩放(Zooming): 改变裁剪窗口的大小
4. 二维视图管线的步骤:
   - 应用模型变换(Apply model transformations) 
   - 确定可见部分(Determine visible parts)
   - 转换到标准坐标(To standard coordinates) 
   - 裁剪并确定像素(Clip and determine pixels)

## 裁剪窗口到规范化坐标的变换

1. 平移变换 $T(-x^w_{min}, -y^w_{min})$
2. 缩放变换 
$$S\left(\frac{x^v_{max}-x^v_{min}}{x^w_{max}-x^w_{min}}, \frac{y^v_{max}-y^v_{min}}{y^w_{max}-y^w_{min}}\right)$$
3. 如果两个缩放因子不相等，则会改变宽高比(aspect ratio)导致失真(distortion)
4. 平移变换 $T(x^v_{min}, y^v_{min})$
5. 综合变换:
$$T(x^v_{min}, y^v_{min})  
S\left(\frac{x^v_{max}-x^v_{min}}{x^w_{max}-x^w_{min}}, \frac{y^v_{max}-y^v_{min}}{y^w_{max}-y^w_{min}}\right)
T(-x^w_{min}, -y^w_{min})$$

## OpenGL中的二维视图

1. 首先选择投影矩阵(Projection Matrix):
```cpp
glMatrixMode(GL_PROJECTION);
```
2. 指定二维裁剪窗口:
```cpp
gluOrtho2D(xwmin, xwmax, ywmin, ywmax);  
```
3. 指定视口:
```cpp
glViewport(xvmin, yvmin, vpWidth, vpHeight);
```
4. 为防止失真,需确保:
$$\frac{yw_{max} - yw_{min}}{xw_{max} - xw_{min}} = \frac{vpWidth}{vpHeight}$$

## 二维裁剪(2D Clipping)

- 裁剪就是移除裁剪窗口外部的部分
- 有许多裁剪算法:点裁剪、线裁剪、区域填充、曲线裁剪等
- 点裁剪:如果点$P=(x,y)$在矩形内部则保留,即
$$xw_{min} \leq x \leq xw_{max} \text{ and } yw_{min} \leq y \leq yw_{max}$$
- 线裁剪:
  - 基本算法:计算线段PQ与裁剪窗口边的**交点**,得到参数u的区间$(u_0, u_1)$,其中
$$X(u) = P + u(Q-P), 0 \leq u \leq 1$$
  - **Cohen-Sutherland算法:**
    - 为每个端点赋予一个4位的区域码(region code)
    - 区域码1表示在外部,0表示在内部
    - 如果两个端点的区域码按位或为0,则线段完全在内部
    - 如果两个端点的区域码按位与不为0,则线段完全在外部 
    - 否则,用区域码快速计算交点

## 三维视图(3D Viewing) 

- 视图:虚拟相机(virtual camera)
- 投影(Projection)  
- 深度(Depth)
- 可见线和表面(Visible lines and surfaces)
- 表面渲染(Surface rendering)

## 三维视图管线(3D Viewing Pipeline)

1. 与拍照类似:放置和指向虚拟相机,然后"按下快门"
2. 投影平面又称视图平面(Viewing plane)
3. 管线结构与二维情形类似
4. 管线的步骤:  
   - 应用模型变换(Apply model transformations)
   - 转换到相机坐标(To camera coordinates)
   - 投影(Project)
   - 转换到标准坐标(To standard coordinates) 
   - 裁剪并转换为像素(Clip and convert to pixels)

## 三维视图坐标(3D Viewing Coordinates)

1. 定义投影需要指定:
   - $P_0$: 视点(View point)或眼睛(Eye point) 
   - $P_{ref}$: 参考点(Reference point)或视线目标(Look-at point)
   - $\vec{V}$: 视图向上向量(View-up vector),指定垂直方向
   - $z_{vp}$: 视平面的位置
2. $P_0$, $P_{ref}$, $\vec{V}$定义了视图坐标系,有多种选择方式
3. 视图坐标轴的推导:
   - $\vec{n} = \frac{\overrightarrow{P_0 P_{ref}}}{|\overrightarrow{P_0 P_{ref}}|} = (n_x, n_y, n_z)$ 
   - $\vec{u} = \frac{\vec{V} \times \vec{n}}{|\vec{V} \times \vec{n}|} = (u_x, u_y, u_z)$, 与$\vec{n}$垂直
   - $\vec{v} = \vec{n} \times \vec{u} = (v_x, v_y, v_z)$, 与$\vec{u}$垂直
4. 从世界坐标到视图坐标的变换矩阵:
$$M_{WC \rightarrow VC} = T(-P_0) R$$
其中
$$R = \begin{bmatrix} 
u_x & u_y & u_z & 0\\
v_x & v_y & v_z & 0\\
n_x & n_y & n_z & 0\\
0 & 0 & 0 & 1
\end{bmatrix}$$

## 投影变换(Projection Transformations)

- 平行投影(Parallel Projection):投影线互相平行
- 透视投影(Perspective Projection):投影线汇聚于一点

## 正交投影(Orthogonal Projections) 

1. **平行投影** + 投影线垂直于投影平面 = **正交投影**
2. 如果投影线与坐标轴夹角相等,则称为**等轴测投影(Isometric Projection)**  
3. 正交投影的变换非常简单:
$$ x = x, y = y, z = z_p$$
其中$z_p$是常数,表示投影平面的z坐标
4. 正交投影的观察体(View Volume)是一个长方体,由远近裁剪平面(Near/Far Clipping Plane)和裁剪窗口(Clipping Window)决定
5. 将观察体变换为规范化观察体 $[-1,1]^3$:
   - 先平移使其中心在原点
   - 再缩放使其cada边长为2 
   - 最后从右手系变换为左手系

## 透视投影(Perspective Projection)

1. 透视投影的特点:
   - 投影线汇聚于一点(投影参考点 Projection Reference Point)
   - 视平面垂直于z轴  
2. 问题:点P=(x,y,z)在视平面z=z_vp上的投影点坐标是多少?
3. 推导:
   - 假设投影参考点在原点R=(0,0,0) 
   - 连接P和R的直线为 $X(u) = R + u(P-R) = uP, u>0$
   - 与视平面z=z_vp的交点满足 $z=uz_p=z_{vp}$, 即$u=\frac{z_{vp}}{z}$
   - 将u代入得到 $x_p=\frac{z_{vp}}{z}x, y_p=\frac{z_{vp}}{z}y$
4. 几何意义:
   - 在侧视图中,可以看到 $\frac{y_p}{y}=\frac{z_{vp}}{z}$
   - 裁剪窗口宽度W与z_vp的比值决定了透视效果的强弱
   - 该比值等于视角$\theta$的2倍正切,即$\frac{W}{z_{vp}}=2\tan\frac{\theta}{2}$
5. 用相机的比喻,可以用焦距f来控制透视效果:
   - 20mm广角、50mm标准、100mm长焦
   - 应用程序调整W和z_vp,使得 $\frac{W}{z_{vp}}=\frac{24}{f}$ (水平方向),$\frac{W}{z_{vp}}=\frac{36}{f}$ (垂直方向) 

## 透视投影的视体(View Volume)

- 透视投影的视体是一个视锥体(viewing frustum),由远近裁剪平面和视平面上的裁剪窗口决定
- 将视锥体变换为规范化视体$[-1,1]^3$的过程类似于正交情形

## 齐次坐标下的透视投影变换

- 引入齐次坐标:
  - 点用四维向量P=(x,y,z,w)表示
  - 笛卡尔坐标下为(x/w, y/w, z/w)
  - 一般情况下w=1,但透视投影中w=-z
- 透视投影变换可以写作矩阵形式:
$$\begin{aligned}
\begin{bmatrix}
x_p \\ y_p \\ z_p \\ w_p
\end{bmatrix} &=
\begin{bmatrix}
s_{xx} & s_{xy} & s_{xz} & t_x\\  
s_{yx} & s_{yy} & s_{yz} & t_y\\
s_{zx} & s_{zy} & s_{zz} & t_z\\
0 & 0 & -1 & 0
\end{bmatrix}
\begin{bmatrix}
x \\ y \\ z \\ 1  
\end{bmatrix} \\
\begin{bmatrix}  
x_v \\ y_v \\ z_v
\end{bmatrix} &= 
\begin{bmatrix}
x_p/w_p \\ y_p/w_p \\ z_p/w_p  
\end{bmatrix}
\end{aligned}$$
- 简化情形(正方形裁剪窗口,边长为2r,裁剪平面与视平面重合即zn=zvp):
$$\begin{aligned}  
s_{xx} &= \frac{z_n}{r}, s_{yy}=\frac{z_n}{r}, s_{zz}=\frac{z_f+z_n}{z_f-z_n}\\
t_x &= t_y = 0, t_z = \frac{-2z_fz_n}{z_f-z_n}
\end{aligned}$$

## OpenGL中的3D视图

1. 放置相机:
```cpp
gluLookAt(x0,y0,z0, xref,yref,zref, Vx,Vy,Vz);
```
其中:
   - (x0,y0,z0)是视点$P_0$的坐标
   - (xref,yref,zref)是参考点$P_{ref}$的坐标
   - (Vx,Vy,Vz)是视图向上向量$\vec{V}$
   - 默认值为 $P_0=(0,0,0), P_{ref}=(0,0,-1), \vec{V}=(0,1,0)$
2. 正交投影:
```cpp
glOrtho(xwmin, xwmax, ywmin, ywmax, dnear, dfar);  
```
其中:
   - (xwmin,xwmax,ywmin,ywmax)指定了裁剪窗口
   - dnear和dfar指定了到近、远裁剪平面的距离
   - 须确保 dnear<dfar,且模型在两个裁剪平面之间
3. 透视投影:  
```cpp
glFrustum(xwmin, xwmax, ywmin, ywmax, dnear, dfar);
```
参数含义与正交投影类似,但
   - 标准情况下 $xw_{min}=-xw_{max}$, $yw_{min}=-yw_{max}$
   - 须确保 $0 < d_{near} < d_{far}$
4. 设置视口:
```cpp
glViewport(xvmin, yvmin, vpWidth, vpHeight);
```
其中$(x_{min},yv_{min})$v是视口左下角在像素坐标下的坐标,$vp_{Width}$和$vp_{Height}$是视口的宽度和高度

## OpenGL中的2D视图

OpenGL提供了完整的二维视图功能，包括裁剪窗口设置、视口变换和坐标映射等功能。
## 图形渲染管线(Graphics Rendering Pipeline)

- 输入:三维三角形汤(soup of 3D triangles) 
- 输出:从特定视角看到的二维图像
- 流水线式处理:
  - 包含不同的阶段 
  - 每个三角形依次通过各个阶段

## 图形渲染管线的主要阶段

1. 顶点处理阶段(Vertex Processing Stage):
   - 顶点着色器(Vertex Shader):以相同的方式独立处理每个顶点
     - 对每个顶点做变换(transformations)
     - 对每个顶点计算光照(lighting)  
   - 几何着色器(Geometry Shader):生成、修改图元(primitives)
2. 图元装配和光栅化阶段(Primitive Assembly and Rasterization Stage):
   - 装配点、线、三角形等图元
   - 将图元转换为栅格图像
   - 生成片段(fragments),即像素的候选
   - 片段的属性由图元的顶点插值得到
3. 片段处理阶段(Fragment Processing Stage):  
   - 片段着色器(Fragment Shader):以相同的方式独立处理每个片段
   - 片段经处理后,可能被丢弃(discarded)或存储到帧缓冲(framebuffer)中

## 其他图形渲染管线的功能

- 解决可见性(visibility)问题
- 应用光照模型(lighting model)
- 计算阴影(shadows)(非核心功能)
- 应用纹理(textures)

## 重要的管线阶段

1. 模型-视图变换(Model-View Transformation)
2. 投影变换(Projection Transformation) 
3. 裁剪和顶点属性插值(Clipping and Vertex Interpolation of Attributes)
4. 光栅化和像素属性插值(Rasterization and Pixel Interpolation of Attributes)
5. 图形硬件(Graphics Hardware)

## 模型变换(Model Transformation)

- 世界坐标系(World Coordinates)
- 物体坐标系(Object Coordinates) 
- 模型变换:将物体从物体坐标系变换到世界坐标系
  - 设置物体的位置、缩放和方向
  - 图形硬件/库只支持线性变换,如平移(translation)、旋转(rotation)、缩放(scaling)和错切(shear)

## 视图变换(View Transformation)

输入:
- 视点(eye)的位置和方向
- 视点(view point)
- 图像平面的法向量$\vec{N}$
- 向上向量(view up)$\vec{U}$

目标:
- 将视点移到原点
- 将图像平面的法向量与-Z轴对齐
- 将向上向量与+Y轴对齐
- 通过旋转和平移实现上述变换

## 投影变换(Projection Transformation)

- 定义视锥体(view frustum)(6个参数)
- 假设原点是视点
- 近平面和远平面(平行于XY平面,在-Z轴上)
- 近平面上的矩形,由left、right、top、bottom确定
- 将视锥体(以及内部物体)变换为一个长方体
  - 近远平面变为中心在-Z轴的正方形
- 将物体投影到近平面上

## 窗口坐标变换(Window Coordinate Transformation)

- 将规范化长方体的XY坐标缩放到窗口尺寸(相对像素坐标)
- 平移到窗口在屏幕上的位置,得到绝对像素坐标
- Z值用于解决遮挡关系