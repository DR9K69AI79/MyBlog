---
title: "CG-03-局部着色模型"
date: 2024-05-02
summary: "本章介绍了局部着色模型的基本原理，包括漫反射、镜面反射、环境光等光照模型，以及在OpenGL中的实现方法和着色插值技术。"
category: "DMT201_Computer Graphics"
tags:
  - 课程笔记
  - 计算机图形学
  - 着色模型
  - 光照
  - OpenGL
comments: True
draft: False
sticky: 0
---
# 局部着色模型(Local Shading Models)

## 局部着色模型的特点
- 捕捉直接来自光源的照明(Direct illumination from light sources)
- 包括漫反射(Diffuse)和镜面反射(Specular)【**高光**】分量  
- 对全局光照(Global lighting)进行非常近似的模拟
- 不能处理阴影(Shadows)、镜子(Mirrors)和折射(Refraction)

## 渲染的一般过程
- 表面要么自发光(如灯泡)，要么反射其他光源的光，或者两者兼而有之
- 光与材质的交互是一个**递归过程**
- 渲染方程(Rendering Equation)是一个描述这个递归过程极限的积分方程

## 标准光照模型("Standard" Lighting Model)
由三个线性组合的项组成:
- 漫反射分量(Diffuse component): 表示均匀向各个方向反射的入射光量 
- 镜面反射分量(Specular component): 表示以类似镜子方式反射的光量
- 环境项(Ambient term): **近似模拟**通过其他表面到达的光

### 漫反射照明(Diffuse Illumination)
- 从方向$\vec{L}$入射的光 $I_i$ 被均匀地向所有方向反射，与视角方向无关
- 反射光量取决于:
  - 表面相对于光源的角度(实际上决定了表面收集并反射的光量)
  - 表面的漫反射系数(Diffuse reflectance coefficient) $k_d$ 
- 背面不被照亮，使用 $\max(0, \vec{N} \cdot \vec{L})$
- 漫反射光强: 

$$
I_d = k_d I_i \max(\vec{N} \cdot \vec{L}, 0)
$$

*Note：*
- $I_d$: 最终Diffuse Illumination的强度
- $k_d$: 该表面的漫反射系数(Diffuse reflectance coefficient)
- $I_i$: 入射光源的强度
- $\vec{N}$: 该采样点的表面法向量
- $\vec{L}$: 入射光的方向
- $\max(0, \vec{N} \cdot \vec{L})$: 对结果做一个“补正”。即与光向夹角小于90度的采样点将乘以0的系数。即“背面不被照亮”。
### 镜面反射 - 冯氏模型(Phong Model) 
*经验模型*
- 入射光主要沿镜面方向$\vec{R}$反射
  - 感知强度取决于视角方向$\vec{V}$和镜面方向的关系
  - 亮斑称为"镜面反射光" 
- 强度由以下因素控制:
  - 镜面反射系数(Specular reflectance coefficient) $k_s$
  - 参数$n$控制镜面反射光的表观尺寸，$n$越大，高光越小
- 镜面反射光强:

$$
I_s = k_s I_i (\vec{R} \cdot \vec{V})^n
$$

*Note:*
- $I_s$: 最终的Specular光强
- $k_s$: 镜面反射系数(Specular reflectance coefficient)
- $I_i$: 入射光源的强度
- $\vec{R}$: 反射光的方向(通过法向量与入射方向计算得)
- $\vec{V}$: 观察方向
### 冯氏反射模型的加速

为了提高计算效率，可以使用基于法向量$\vec{N}$和"半程向量"(halfway vector)$\vec{H}$的优化方法：
- 基于法向量$\vec{N}$和"半程向量"(halfway vector)$\vec{H}$计算
  - 比镜面方向更容易计算，结果相同
  - $\vec{H} = (\vec{L} + \vec{V}) / 2$  
- 镜面反射光强(优化版):

$$
I_s = k_s I_i (\vec{N} \cdot \vec{H})^n
$$

## 完整的光照模型
- 全局环境光强度(Global ambient intensity) $I_a$:
  - 对所有其他表面反弹光线的粗略近似
  - 由环境反射系数(Ambient reflectance) $k_a$ 调制
- 将所有项相加:  

$$
I = k_a I_a + k_d I_i (\vec{N} \cdot \vec{L}) + k_s I_i (\vec{N} \cdot \vec{H})^n
$$

- 如果有多个光源，则将每个光源的贡献相加
- 有几种变体和近似方法

## 颜色处理
- 对三个颜色分量(红、绿、蓝)分别进行计算
- 注意某些项(计算量大的)是常数
- 这是一种近似，原因不作详述
  - 颜色空间中的混叠(Aliasing)现象 
  - 使用9个颜色样本会得到更好的结果
- 对于红色分量:

$$
I_r = k_{a,r} I_{a,r} + k_{d,r} I_{i,r} (\vec{N} \cdot \vec{L}) + k_{s,r} I_{i,r} (\vec{N} \cdot \vec{H})^n
$$

## 为加速进行的近似
- 视角方向$\vec{V}$和光照方向$\vec{L}$取决于所考虑的表面位置$\vec{x}$ 
- 远距离光源近似(Distant light approximation):
  - 假设对所有$\vec{x}$，$\vec{L}$都是常数
  - 如果光源很远(如太阳)，这是一个很好的近似
- 远距离观察者近似(Distant viewer approximation)  
  - 假设对所有$\vec{x}$，$\vec{V}$都是常数
  - 很少成立，但只影响镜面反射光

## OpenGL光照模型
- 允许自发光$E$: 表面发出的光
- 允许漫反射和镜面反射使用不同的光强  
- 环境光可以与光源相关联
- 允许聚光灯，其强度取决于出射光方向
- 允许光强随距离衰减
- 可以以多种方式指定系数

## 着色插值(Shading Interpolation) 
- 讨论的模型给出了单个点的光强
  - 对每个显示点计算这些模型的计算量很大
  - 并非每个点都明确给出法线
- 几种选择:
  - 平面着色(Flat shading)
  - Gouraud插值 
  - Phong插值
- 新的硬件支持可编程的逐像素着色!!

### 平面着色(Flat shading)
- 在代表点计算着色，并应用于整个多边形 
  - OpenGL使用顶点之一
- 优点:
  - 速度快 - 每个多边形只需一个着色值
- 缺点:  
  - 不精确
  - 多边形边界处不连续

### Gouraud着色
- 使用每个顶点自己的位置和法线对其进行着色
- 在面上进行线性插值
- 优点:
  - 快速 - 光栅化时增量计算
  - 更加平滑 - 对共享顶点使用同一法线以在面之间获得连续性
- 缺点:
  - 镜面反射光可能丢失

### Phong插值
- 在面上插值法线  
- 对每个像素进行着色
- 优点:
  - 高质量，窄镜面反射光
- 缺点: 
  - 计算量大
  - 对大多数表面仍然是一种近似
- 不要与Phong的镜面反射模型混淆

## 着色与OpenGL
- OpenGL定义了两种特定的着色模型
  - 控制如何将颜色分配给像素
  - `glShadeModel(GL_SMOOTH)` 在顶点之间插值颜色(默认)
  - `glShadeModel(GL_FLAT)` 在多边形上使用恒定颜色
## OpenGL命令

### 材质设置
- `glMaterial{if}(face, parameter, value)`
  - 更改面的正面或背面(或两面)的一个材质参数，如环境光(`GL_AMBIENT`)、漫反射(`GL_DIFFUSE`)、镜面反射(`GL_SPECULAR`)系数等
  - `face`可以是`GL_FRONT`、`GL_BACK`或`GL_FRONT_AND_BACK`
  - `{if}`表示参数类型，可以是`f`(float)或`i`(integer)
  
### 光源设置  
- `glLight{if}(light, property, value)`
  - 更改光源的一个属性，如环境光(`GL_AMBIENT`)、漫反射(`GL_DIFFUSE`)、镜面反射(`GL_SPECULAR`)强度，位置(`GL_POSITION`)，方向(`GL_SPOT_DIRECTION`)等
  - 有8个光源: `GL_LIGHT0`, `GL_LIGHT1`, ..., `GL_LIGHT7`
  - `{if}`表示参数类型，可以是`f`(float)或`i`(integer)
- `glLightModel{if}(property, value)` 
  - 更改一个全局光照模型属性，如全局环境光(`GL_LIGHT_MODEL_AMBIENT`)，双面光照(`GL_LIGHT_MODEL_TWO_SIDE`)等
  - `{if}`表示参数类型，可以是`f`(float)或`i`(integer)
- `glEnable(GL_LIGHTi)` 启用第`i`个光源，`i`为0到7

### 颜色材质
- `glColorMaterial(face, mode)`
  - 使指定的材质属性(如`GL_AMBIENT`、`GL_DIFFUSE`、`GL_SPECULAR`等)跟踪当前的`glColor()`设置
  - 可以加速渲染并简化编码
  - `face`可以是`GL_FRONT`、`GL_BACK`或`GL_FRONT_AND_BACK`
  
### 其他设置和注意事项
- `glEnable(GL_LIGHTING)` 打开光照，`glDisable(GL_LIGHTING)` 关闭光照
- 如非必要，不要使用镜面反射
  - 计算量大，可将光源的镜面反射颜色设为(0,0,0)以关闭
- 在使用光照时，不要忘记设置法线，可使用`glNormal3{bsidf}()`函数
- 还有许多其他控制材质和光照的函数，如`glLightModeli()`、`glMaterialf()`等
- 合理设置光照和材质参数对提高场景真实感和渲染性能很重要
- 可以使用`glGetLight*()`, `glGetMaterial*()`等函数查询当前光照和材质状态